<template>
    <main>
        <!-- <EditList :list="list" />
        <dialog
            ref="newListDialog"
            v-if="privateView"
        >
            <h2>Create new item</h2>
            <form @submit.prevent="createItem">
                <label for="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    v-model="newItem.title"
                />
                <label for="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    v-model="newItem.description"
                ></textarea>
                <label for="url">URL</label>
                <input
                    type="url"
                    id="url"
                    name="url"
                    v-model="newItem.url"
                />
                <label for="image">Image</label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    v-model="newItem.image"
                />
                <label for="price">Price</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    v-model="newItem.price"
                    min="0"
                />
                <label for="priority">Priority</label>
                <select
                    name="priority"
                    id="priority"
                    v-model="newItem.priority"
                >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button type="submit">Create</button>
            </form>
        </dialog> -->
        <v-card class="list-header">
            <h1>
                {{ list.title }}
                <v-btn-group
                    base-color="primary"
                    divided
                    rounded="pill"
                    v-if="privateView"
                >
                    <v-btn
                        icon="add"
                        size="small"
                        @click="openDialog"
                    />
                    <EditList
                        :list="list"
                        @updateList="updateList"
                        variant="outlined"
                    />
                </v-btn-group>
            </h1>
            <vue-markdown
                v-if="list.description"
                :source="list.description"
                class="description user-item-markdown"
            />
        </v-card>
        <v-divider style="margin: 1rem 0;"/>
        <div class="items">
            <ListItem
                v-for="item in list.items"
                :key="item.$id"
                :item="item"
            />
        </div>
    </main>
</template>

<script>
import { databases } from "@/appwrite";
import EditList from "@/components/EditList.vue";
import { ID } from "appwrite";
import ListItem from "@/components/ListItem.vue";
import VueMarkdown from "vue-markdown-render";
export default {
    components: {
        EditList,
        ListItem,
        VueMarkdown
    },
    data() {
        return {
            list: [],
            listId: this.$route.params.id,
            newItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: 0,
                priority: "none"
            },
            privateView: this.$route.meta?.requiresAuth || false
        };
    },
    methods: {
        updateList(data) {
            this.list.title = data.list.title;
            this.list.description = data.list.description;
        },
        openDialog() {
            this.$refs.newListDialog.showModal();
        },
        async createItem() {
            console.log({ ...this.newItem, list: this.listId });
            await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_ITEM_COLLECTION,
                ID.unique(),
                {
                    ...this.newItem,
                    list: this.listId,
                    url: this.newItem.url || null
                }
            );

            this.$refs.newListDialog.close();
        }
    },
    async mounted() {
        this.list = await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
            this.listId,
            []
        );
    }
};
</script>

<style lang="scss" scoped>
main {
    width: var(--section-width);
    margin: 0 auto;
    dialog {
        form {
            display: flex;
            flex-direction: column;
        }
    }

    .list-header {
        padding: 1rem;
        h1 {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .description {
            margin-top: 1rem;
        }
    }

    .items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
