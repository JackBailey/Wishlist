<template>
    <v-dialog
        :max-width="$vuetify.display.mobile ? '100%' : '90%'"
        :fullscreen="$vuetify.display.mobile ? true : false"
        v-model="dialogOpen"
    >
        <template v-slot:activator="{ props: activatorProps }">
            <v-list-item
                v-bind="activatorProps"
                :prepend-icon="mdiPencil"
                title="Edit List"
                link
            />
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Edit List">
                <v-card-text>
                    <ListFields
                        v-model:list="editedList"
                        :currency="currency"
                    />
                    <v-alert
                        v-if="alert"
                        type="error"
                        dismissible
                        border="left"
                        elevation="2"
                        :icon="mdiAlert"
                        :title="alert.title"
                        :text="alert.text"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        text="Cancel"
                        @click="isActive.value = false"
                    />
                    <v-btn
                        color="primary"
                        text="Save"
                        @click="updateList"
                        variant="elevated"
                        :loading="loading"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { mdiAlert, mdiPencil } from "@mdi/js";
import { AppwriteException } from "appwrite";
import { databases } from "@/appwrite";
import ListFields from "@/components/dialogs/fields/ListFields.vue";
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
    components: {
        ListFields
    },
    data() {
        return {
            editedList: {},
            listId: null,
            dialogOpen: false,
            mdiPencil,
            mdiAlert,
            alert: false,
            loading: false
        };
    },
    watch: {
        dialogOpen(open) {
            if (open === true) {
                this.editedList = {
                    title: this.list.title,
                    description: this.list.description,
                    currency: this.list.currency
                };
                this.listId = this.list.$id;
            }
        }
    },
    methods: {
        async updateList() {
            this.alert = false;
            this.loading = true;
            try {
                await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DB,
                    import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                    this.listId,
                    this.editedList
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

            this.$emit("updateList", {
                listId: this.listId,
                list: this.editedList
            });

            this.loading = false;
            this.dialogOpen = false;
        }
    }
};
</script>
