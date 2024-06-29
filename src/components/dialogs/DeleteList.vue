<template>
    <v-dialog
        :max-width="$vuetify.display.mobile ? '100%' : '500px'"
        :fullscreen="$vuetify.display.mobile ? true : false"
        v-model="dialogOpen"
    >
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
                    <v-alert
                        v-if="alert"
                        type="error"
                        border="left"
                        elevation="2"
                        :icon="mdiAlert"
                        :title="alert.title"
                        :text="alert.text"
                        class="mt-4"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        text="Cancel"
                        @click="isActive.value = false"
                    />
                    <v-btn
                        color="error"
                        text="Delete"
                        @click="deleteList"
                        variant="elevated"
                        :loading="loading"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { mdiAlert, mdiDelete } from "@mdi/js";
import { AppwriteException } from "appwrite";
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
            alert: false,
            loading: false
        };
    },
    methods: {
        async deleteList() {
            this.loading = true;
            this.alert = false;
            try {
                await databases.deleteDocument(
                    import.meta.env.VITE_APPWRITE_DB,
                    import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                    this.list.$id
                );
            } catch (e) {
                if (e instanceof AppwriteException) {
                    this.alert = {
                        title: "Error",
                        text: e.message
                    };
                } else {
                    this.alert = {
                        title: "Error",
                        text: "An unknown error occurred."
                    };
                }
                this.loading = false;
                return;
            }

            this.$router.push("/dash/lists");

            this.dialogOpen = false;
            this.loading = false;
        }
    }
};
</script>
