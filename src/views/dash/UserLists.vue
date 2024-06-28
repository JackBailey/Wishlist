<template>
    <v-main>
        <dialog ref="newListDialog">
            <h2>Create new list</h2>
            <form @submit.prevent="createList"> 
                <label for="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    v-model="newList.title"
                />
                <label for="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    v-model="newList.description"
                ></textarea>
                <button type="submit">Create</button>
            </form>
        </dialog>
        <h1>Lists <button @click="openDialog">New</button></h1>

        <p>{{ lists }}</p>
        <div class="lists">
            <a
                class="list"
                v-for="list in lists.documents"
                :key="list.$id"
                :href="`/list/${list.$id}`"
            >
                <h2>{{ list.title }}</h2>
                <p>{{ list.description }}</p>
            </a>
        </div>
    </v-main>
</template>

<script>
import { databases } from "@/appwrite";
import { ID } from "appwrite";
import { useAuthStore } from "@/stores/auth";
export default {
    data() {
        return {
            auth: useAuthStore(),
            lists: [],
            newList: {
                title: "",
                description: ""
            }
        };
    },
    methods: {
        openDialog() {
            this.$refs.newListDialog.showModal();
        },
        async createList() {
            const document = await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                ID.unique(),
                { ...this.newList, author: this.auth.user.$id }
            );

            this.$router.push("/list/" + document.$id);
        }
    },
    async mounted() {
        this.lists = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
            []
        );
    }
};
</script>

<style lang="scss" scoped>
main {
    dialog {
        form {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>