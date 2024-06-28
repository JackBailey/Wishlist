<template>
    <v-dialog max-width="90%" v-model="dialogOpen">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                :icon="mdiPlus"
                base-color="primary"
                size="small"
                :variant="variant"
            />
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="New List">
                <v-card-text>
                    <v-text-field
                        label="Title"
                        v-model="newList.title"
                    />
                    <v-textarea
                        label="Description"
                        v-model="newList.description"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="primary"
                        text="Create"
                        @click="createList"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { databases } from "@/appwrite";
import { ID } from "appwrite";
import { mdiPlus } from "@mdi/js";
import { useAuthStore } from "@/stores/auth";
export default {
    title: "ListDialog",
    props: {
        list: {
            type: Object,
            default: () => ({})
        },
        variant: {
            type: String,
            default: "elevated"
        }
    },
    data() {
        return {
            newList: {
                title: "",
                description: ""
            },
            listId: null,
            dialogOpen: false,
            mdiPlus,
            auth: useAuthStore()
        };
    },
    watch: {
        dialogOpen(open) {
            if (open === true) {
                this.editedList = { 
                    title: this.list.title,
                    description: this.list.description
                };
                this.listId = this.list.$id;
            }
        }
    },
    methods: {
        async createList() {
            const list = await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                ID.unique(),
                { ...this.newList, author: this.auth.user.$id }
            );

            this.$emit("createList", {
                list
            });

            this.newList = {
                title: "",
                description: ""
            };

            this.dialogOpen = false;
        }
    }
};
</script>