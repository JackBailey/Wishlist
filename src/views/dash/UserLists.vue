<template>
    <div class="page-content">
        <v-alert
            type="warning"
            border="start"
            elevation="32"
            :icon="mdiInformation"
            title="Verification Required"
            text="Please verify your email address to create lists."
            class="mb-4"
            v-if="auth.user.emailVerification === false"
        >
            <v-card-actions>
                <v-btn
                    variant="outlined"
                    @click="verifyEmail"
                >
                    Send Verification Email
                </v-btn>
                <v-dialog
                    max-width="500"
                    v-model="verificationDialog"
                >
                    <v-card>
                        <v-card-text>
                            A verification email has been sent to {{ auth.user.email }}. Please
                            check your inbox and spam folder, the link will be valid for 7 days.
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer />

                            <v-btn
                                text="Close"
                                @click="verificationDialog = false"
                            />
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card-actions>
        </v-alert>
        <v-card
            color="surface"
            variant="flat"
            class="pa-0 mb-4"
        >
            <v-card-item class="px-0">
                <template v-slot:title>
                    <h1 class="mb-0">Your lists</h1>
                </template>
                <template v-slot:append>
                    <CreateList
                        @createList="createList"
                        :disabled="auth.user.emailVerification === false"
                    />
                </template>
            </v-card-item>
            <v-card-text class="px-0">
                <div class="sorting">
                    <v-btn-group
                        variant="tonal"
                        divided
                    >
                        <v-btn ref="sortTypeButton">
                            {{ sorting.type.name }}
                            <v-menu
                                activator="parent"
                                location="bottom start"
                                transition="fade-transition"
                            >
                                <v-list
                                    variant="tonal"
                                    rounded="xl"
                                    :items="sorting.typeOptions"
                                    item-title="name"
                                    item-value="value"
                                    class="py-0 mt-2"
                                    return-object=""
                                    @update:selected="setSortType"
                                />
                            </v-menu>
                        </v-btn>
                        <v-btn
                            :icon="sorting.order === 'asc' ? mdiSortAscending : mdiSortDescending"
                            @click="toggleSortDirection"
                        />
                    </v-btn-group>
                    <v-select
                        :items="sorting.typeOptions"
                        item-title="text"
                        item-value="value"
                        v-model="sorting.type"
                        return-object
                        hide-details
                        :menu-props="{
                            activator: $refs.sortTypeButton,
                            closeOnClick: true,
                        }"
                        v-show="false"
                    />
                </div>
                
            </v-card-text>
        </v-card>
        <v-card
            variant="tonal"
            class="mb-4"
            v-if="quickCreateURL"
        >
            <v-card-text>
                <p>
                    Select or create a list to add the following item to:
                </p>
                <strong>URL:</strong> {{ quickCreateURL }}
            </v-card-text>
        </v-card>
        <div
            class="loaders"
            v-if="loading"
        >
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />

            <v-card
                class="pa-0 mb-4"
                variant="flat"
                color="surface"
            >
                <v-card-item class="px-0">
                    <template v-slot:title>
                        <h2 class="mb-0">Saved lists</h2>
                    </template>
                    <template v-slot:prepend>
                        <v-icon>{{ mdiStar }}</v-icon>
                    </template>
                </v-card-item>
            </v-card>

            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
        </div>

        <v-list v-else-if="!loading && lists?.length">
            <ListCard
                v-for="list in lists"
                :key="list.$id"
                :list="list"
                :quickCreateURL="quickCreateURL"
                :ownList="list.author === auth.user.$id"
            />

        </v-list>
        <v-card
            class="pa-0 mb-4"
            variant="flat"
            color="surface"
            v-if="!loading && savedLists.length"
        >
            <v-card-item class="px-0">
                <template v-slot:title>
                    <h2 class="mb-0">Saved lists</h2>
                </template>
                <template v-slot:prepend>
                    <v-icon>{{ mdiStar }}</v-icon>
                </template>
            </v-card-item>
        </v-card>
        <v-list
            v-if="!loading && savedLists.length"
        >
            <ListCard
                v-for="list in savedLists"
                :key="list.$id"
                :list="list"
                :quickCreateURL="quickCreateURL"
                :ownList="list.author === auth.user.$id"
            />
        </v-list>

        <div
            class="no-items"
            v-if="!loading && !lists?.documents?.length && !savedLists.length"
        >
            <v-spacer height="20" />
            <v-alert
                type="info"
                :icon="mdiInformation"
                elevation="2"
                class="mt-5"
                text="No lists currently exist. Add some!"
            />
        </div>
    </div>
</template>

<script>
import { account, databases } from "@/appwrite";
import { mdiInformation, mdiSortAscending, mdiSortDescending, mdiStar } from "@mdi/js";
import CreateList from "@/components/dialogs/CreateList.vue";
import ListCard from "@/components/ListCard.vue";
import { Query } from "appwrite";
import { useAuthStore } from "@/stores/auth";
import validation from "@/utils/validation";

export default {
    components: {
        CreateList,
        ListCard
    },
    data() {
        return {
            auth: useAuthStore(),
            lists: [],
            loading: true,
            mdiInformation,
            mdiSortAscending,
            mdiSortDescending,
            mdiStar,
            quickCreateURL: false,
            savedLists: [],
            sorting: {
                order: "desc",
                type: { name: "Last updated", value: "$updatedAt" },
                typeOptions: [
                    { name: "Title", value: "title" },
                    { name: "Last updated", value: "$updatedAt" },
                    { name: "Created", value: "$createdAt" }
                ]
            },
            verificationDialog: false
        };
    },
    methods: {
        createList(data) {
            this.$router.push({
                name: "list",
                params: {
                    id: data.list.$id
                },
                query: {
                    quickcreateurl: this.quickCreateURL
                }
            });
        },
        async getLists() {
            this.loading = true;

            const listQuery = [
                this.sorting.order === "asc"
                    ? Query.orderAsc(this.sorting.type.value)
                    : Query.orderDesc(this.sorting.type.value),
                Query.or(
                    [
                        Query.equal("author", this.auth.user.$id),
                        this.auth.userPrefs.savedLists?.length ? Query.equal("$id", this.auth.userPrefs.savedLists) : null
                    ]
                )
            ];

            const lists = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                listQuery
            );

            this.savedLists = lists.documents.filter(list => this.auth.userPrefs.savedLists.includes(list.$id));
            this.lists = lists.documents.filter(list => !this.auth.userPrefs.savedLists.includes(list.$id));

            this.loading = false;
        },
        setSortType(event) {
            this.sorting.type = event[0];
            this.getLists();
        },
        toggleSortDirection() {
            this.sorting.order = this.sorting.order === "asc" ? "desc" : "asc";
            this.getLists();
        },
        async verifyEmail() {
            try {
                await account.createVerification("https://readyto.gift/dash/verify");

                this.verificationDialog = true;
            } catch (error) {
                alert(error);
            }
        }
    },
    async mounted() {
        await this.getLists();

        // Handle quick create URL query
        const { title, text, url } = this.$route.query;

        if (!title && !text && !url) return;

        if (!url) {
            if (text.match(validation.urlRegexGlobal)) {
                this.quickCreateURL = text.match(validation.urlRegexGlobal)[0];
            }
            else if (title.match(validation.urlRegexGlobal)) {
                this.quickCreateURL = title.match(validation.urlRegexGlobal)[0];
            }
        } else {
            this.quickCreateURL = url;
        }
    }
};
</script>

<style lang="scss" scoped>
main {
    .page-content {
        width: var(--section-width);
        margin: 0 auto;
        padding: 2rem 0;

        h1, h2 {
            word-break: break-word;
            white-space: pre-wrap;
        }
    }


}
</style>
