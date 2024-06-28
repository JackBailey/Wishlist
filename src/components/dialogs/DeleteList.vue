<template>
    <v-dialog max-width="500px" v-model="dialogOpen">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="error"
                :icon="mdiDelete"
                :variant="variant"
            />
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Delete List">
                <v-card-text>
                    Are you sure you want to delete this list?
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="error"
                        text="Delete"
                        @click="deleteList"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { mdiAlert, mdiDelete } from "@mdi/js";
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
            listId: null,
            dialogOpen: false,
            mdiDelete,
            mdiAlert,
            alert: false
        };
    },
    methods: {
        async deleteList() {
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                this.list.$id
            );

            this.$router.push("/dash/lists");

            this.dialogOpen = false;
        }
    }
};
</script>