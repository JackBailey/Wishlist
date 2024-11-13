<template>
    <div class="page-content">
        <v-card
            :prepend-icon="mdiInformation"
            variant="elevated"
            class="mb-5"
            color="warning"
            v-if="auth.user.emailVerification === false"
        >
            <template v-slot:title>
                <span class="font-weight-black">Please verify your email address to create lists.</span>
            </template>
            <v-card-text class="pt-4">
                <v-btn
                    color="surface-variant"
                    variant="flat"
                    @click="verifyEmail"
                >Send Verification Email</v-btn>
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
            </v-card-text>
        </v-card>
        <h1>
            Lists
            <CreateList
                @createList="createList"
                :disabled="auth.user.emailVerification === false"
            />
            <!-- TODO: Properly disable -->
        </h1>
        <v-divider />
        <div
            class="loaders"
            v-if="loading"
        >
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
            <v-skeleton-loader type="list-item-two-line" />
        </div>
        <v-list v-else-if="lists?.documents?.length">
            <v-list-item
                v-for="list in lists.documents"
                :key="list.$id"
                :href="`/list/${list.$id}`"
                :title="list.title"
                :lines="list.description ? 'two' : 'one'"
                :prepend-icon="mdiFormatListBulleted"
            >
                <template
                    v-slot:subtitle
                    v-if="list.description"
                >
                    <VueMarkdown :source="list.description" />
                </template>
            </v-list-item>
        </v-list>
        <div
            class="no-items"
            v-else
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
import { mdiFormatListBulleted, mdiInformation } from "@mdi/js";
import CreateList from "@/components/dialogs/CreateList.vue";
import { Query } from "appwrite";
import { useAuthStore } from "@/stores/auth";
import VueMarkdown from "vue-markdown-render";
export default {
    components: {
        CreateList,
        VueMarkdown
    },
    data() {
        return {
            auth: useAuthStore(),
            mdiFormatListBulleted,
            mdiInformation,
            lists: [],
            loading: true,
            verificationDialog: false
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
            [Query.equal("author", this.auth.user.$id)]
        );
        this.loading = false;
    }
};
</script>

<style lang="scss" scoped>
main {
    .page-content {
        width: var(--section-width);
        margin: 0 auto;
        padding: 2rem 0;

        h1 {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding-bottom: 0.5rem;
        }
    }
}
</style>
