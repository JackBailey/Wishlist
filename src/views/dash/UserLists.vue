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
            class="pa-2 mb-4"
        >
            <template v-slot:title>
                <h1 class="mb-0">Your lists</h1>
            </template>
            <template v-slot:append>
                <CreateList
                    @createList="createList"
                    :disabled="auth.user.emailVerification === false"
                />
            </template>
        </v-card>
        <v-card
            variant="tonal"
            class="mb-4"
            color="surface"
            v-if="quickCreateURL"
        >
            <v-card-text>
                <p>
                    Select a list to add the following item to:
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
                class="pa-2 mb-4"
                variant="flat"
                color="surface"
            >
                <template v-slot:title>
                    <h2 class="mb-0">Saved lists</h2>
                </template>
                <template v-slot:prepend>
                    <v-icon>{{ mdiStar }}</v-icon>
                </template>
            </v-card>

            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
        </div>

        <v-list v-else-if="!loading && lists?.documents?.length">
            <v-card
                v-for="list in lists.documents"
                :key="list.$id"
                :href="`/list/${list.$id}${quickCreateURL ? `?quickcreateurl=${quickCreateURL}` : ''}`"
                variant="tonal"
                class="mb-4"
            >
                <template v-slot:title>
                    <h3>{{ list.title }}</h3>                    
                </template>
                <template
                    v-slot:subtitle
                    v-if="list.description"
                >
                    <VueMarkdown
                        :source="list.description"
                        lass="description user-item-markdown"
                    />
                </template>
            </v-card>

        </v-list>
        <v-card
            class="pa-2 mb-4"
            variant="flat"
            color="surface"
            v-if="!loading && savedLists.length"
        >
            <template v-slot:title>
                <h2 class="mb-0">Saved lists</h2>
            </template>
            <template v-slot:prepend>
                <v-icon>{{ mdiStar }}</v-icon>
            </template>
        </v-card>
        <v-list
            v-if="!loading && savedLists.length"
        >
            <v-card
                v-for="list in savedLists"
                :key="list.$id"
                :href="`/list/${list.$id}${quickCreateURL ? `?quickcreateurl=${quickCreateURL}` : ''}`"
                :title="list.title"
                variant="tonal"
                class="mb-4"
            >
                <template v-slot:title>
                    <h3>{{ list.title }}</h3>                    
                </template>
                <template
                    v-slot:subtitle
                    v-if="list.description"
                >
                    <VueMarkdown
                        :source="list.description"
                        lass="description user-item-markdown"
                    />
                </template>
            </v-card>
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
import { mdiInformation, mdiStar } from "@mdi/js";
import CreateList from "@/components/dialogs/CreateList.vue";
import { Query } from "appwrite";
import { useAuthStore } from "@/stores/auth";
import validation from "@/utils/validation";
import VueMarkdown from "vue-markdown-render";

export default {
    components: {
        CreateList,
        VueMarkdown
    },
    data() {
        return {
            auth: useAuthStore(),
            mdiInformation,
            mdiStar,
            lists: [],
            savedLists: [],
            loading: true,
            verificationDialog: false,
            quickCreateURL: false
        };
    },
    methods: {
        createList(data) {
            this.lists.documents.push(data.list);
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
        this.lists = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
            [
                Query.equal("author", this.auth.user.$id),
                Query.orderDesc("$createdAt")
            ]
        );

        if (this.auth.userPrefs.savedLists && this.auth.userPrefs.savedLists.length) {
            const savedLists = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                [
                    Query.equal("$id", this.auth.userPrefs.savedLists)
                ]
            );

            this.savedLists = savedLists.documents;
        }

        this.loading = false;

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
