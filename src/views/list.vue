<template>
    <main>
        <dialog ref="newListDialog">
            <h2>Create new item</h2>
            <form @submit.prevent="createItem"> 
                <label for="title">Title</label>
                <input type="text" id="title" name="title" required v-model="newItem.title">
                <label for="description">Description</label>
                <textarea id="description" name="description" v-model="newItem.description"></textarea>
                <label for="url">URL</label>
                <input type="url" id="url" name="url" v-model="newItem.url">
                <label for="image">Image</label>
                <input type="url" id="image" name="image" v-model="newItem.image">
                <label for="price">Price</label>
                <input type="number" id="price" name="price" v-model="newItem.price" min="0">
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
        <h1>{{ list.title }} <button @click="openDialog">New</button></h1>
        <vue-markdown v-if="list.description" :source="list.description" />
        <div class="items">
            <div class="item" v-for="item in list.items" :key="item.$id">
                <div class="item-content">
                    <h2>{{ item.title }}</h2>
                    <vue-markdown v-if="item.description" :source="item.description" />
                    <p>{{ item.price }}</p>
                    <p>{{ item.priority }}</p>
                    <p>{{ item.url }}</p>
                    <p>{{ item.fulfilled }}</p>
                </div>
                <div class="item-image">
                    <img v-if="item.image" :src="item.image" alt="">
                    <div v-else class="image-fallback"></div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { ID } from "appwrite";
import VueMarkdown from "vue-markdown-render";
import { useAuthStore } from "@/stores/auth";
import { databases } from "@/appwrite";
export default {
    components: {
        VueMarkdown
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
            }
        }
    },
    methods: {
        openDialog() {
            this.$refs.newListDialog.showModal();
        },
        async createItem() {
            console.log({...this.newItem, list: this.listId})
            const document = await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_ITEM_COLLECTION,
                ID.unique(),
                {
                    ...this.newItem,
                    list: this.listId,
                    url: this.newItem.url || null,
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
}
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

    .items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .item {
            // border: 1px solid var(--foreground-1);
            background-color: var(--background-2);
            display: grid;
            grid-template-columns: 1fr 12rem;
            gap: 2rem;
            padding: 1rem;
            border-radius: 1rem;
            .item-image {
                img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: cover;
                    border-radius: 1rem;
                    aspect-ratio: 1/1;
                }
            }
        }
    }
}
</style>