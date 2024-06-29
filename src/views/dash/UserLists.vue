<template>
    <v-main>
        <div class="page-content">
            <h1>Lists <CreateList @createList="createList" /></h1>
            <v-divider />
            <v-list v-if="lists?.documents?.length">
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
    </v-main>
</template>

<script>
import { mdiFormatListBulleted, mdiInformation } from "@mdi/js";
import CreateList from "@/components/dialogs/CreateList.vue";
import { databases } from "@/appwrite";
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
            lists: []
        };
    },
    methods: {
        createList(data) {
            this.lists.documents.push(data.list);
        }
    },
    async mounted() {
        this.lists = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
            [Query.equal("author", this.auth.user.$id)]
        );
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
