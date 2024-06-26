<template>
    <main>
        <EditListDialog :list="list" />
        <dialog ref="newListDialog" v-if="privateView">
            <h2>Create new item</h2>
            <form @submit.prevent="createItem">
                <label for="title">Title</label>
                <input type="text"
                       id="title"
                       name="title"
                       required
                       v-model="newItem.title" />
                <label for="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    v-model="newItem.description"
                ></textarea>
                <label for="url">URL</label>
                <input type="url"
                       id="url"
                       name="url"
                       v-model="newItem.url" />
                <label for="image">Image</label>
                <input type="url"
                       id="image"
                       name="image"
                       v-model="newItem.image" />
                <label for="price">Price</label>
                <input type="number"
                       id="price"
                       name="price"
                       v-model="newItem.price"
                       min="0" />
                <label for="priority">Priority</label>
                <select name="priority" id="priority" v-model="newItem.priority">
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button type="submit">Create</button>
            </form>
        </dialog>
        <md-elevated-card class="list-header">
            <h1>
                {{ list.title }}
                <md-filled-icon-button @click="openDialog" v-if="privateView">
                    <md-icon>add</md-icon>
                </md-filled-icon-button>
                <md-outlined-icon-button @click="openDialog" v-if="privateView">
                    <md-icon>edit</md-icon>
                </md-outlined-icon-button>
            </h1>
            <vue-markdown v-if="list.description" :source="list.description" class="description" />
        </md-elevated-card>
        <md-divider style="margin: 1rem 0" />
        <div class="items">
            <ListItem v-for="item in list.items" :key="item.$id" :item="item" />
        </div>
    </main>
</template>

<script>
import "material/card/elevated-card";
import "material/iconbutton/filled-icon-button";
import "material/iconbutton/outlined-icon-button";
import "material/icon/icon";
import "material/divider/divider";
import { databases } from "@/appwrite";
import { ID } from "appwrite";
import ListItem from "@/components/ListItem.vue";
import { useAuthStore } from "@/stores/auth";
import VueMarkdown from "vue-markdown-render";
import EditListDialog from "@/components/EditListDialog.vue";
export default {
    components: {
        VueMarkdown,
        ListItem,
        EditListDialog
    },
    data() {
        return {
            auth: useAuthStore(),
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
        openDialog() {
            this.$refs.newListDialog.showModal();
        },
        async createItem() {
            console.log({ ...this.newItem, list: this.listId });
            const document = await databases.createDocument(
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
            md-filled-icon-button,
            md-outlined-icon-button {
                margin-left: 1rem;
            }
        }
    }

    .items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
