<template>
    <v-dialog max-width="90%" v-model="dialogOpen">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                icon="edit"
                base-color="primary"
                size="small"
                :variant="variant"
            />
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Edit List">
                <v-card-text>
                    <v-text-field
                        label="Title"
                        v-model="editedList.title"
                    />
                    <v-textarea
                        label="Description"
                        v-model="editedList.description"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="primary"
                        text="Save"
                        @click="updateList"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { databases } from "@/appwrite";
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
            editedList: {},
            listId: null,
            dialogOpen: false
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
        async updateList() {
            await databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                this.listId,
                this.editedList
            );

            this.$emit("updateList", {
                listId: this.listId,
                list: this.editedList
            });

            this.dialogOpen = false;
        }
    }
}
</script>

<style lang="scss" scoped>
md-dialog {
    max-width: 80%;
    width: 100%;
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}

</style>