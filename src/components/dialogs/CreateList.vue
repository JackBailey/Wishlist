<template>
    <v-dialog
        :max-width="$vuetify.display.mobile ? '100%' : '90%'"
        :fullscreen="$vuetify.display.mobile ? true : false"
        v-model="dialogOpen"
    >
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                :append-icon="mdiPlus"
                base-color="primary"
                :variant="variant"
                :disabled="disabled"
                title="Create a new list"
                size="large"
                rounded="pill"
            >Create List</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="New List">
                <v-card-text>
                    <ListFields v-model:list="newList" />
                    <v-alert
                        v-if="alert"
                        type="error"
                        border="start"
                        class="mt-4"
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
                        text="Create"
                        @click="createList"
                        variant="elevated"
                        :loading="loading"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { AppwriteException, ID, Query } from "appwrite";
import { databases } from "@/appwrite";
import ListFields from "@/components/dialogs/fields/ListFields.vue";
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
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        ListFields
    },
    data() {
        return {
            newList: {
                title: "",
                description: "",
                currency: "USD",
                shortUrl: ""
            },
            listId: null,
            dialogOpen: false,
            mdiPlus,
            auth: useAuthStore(),
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
                    shortUrl: this.list.shortUrl
                };
                this.listId = this.list.$id;
            }
        }
    },
    methods: {
        async createList() {
            let list;
            this.alert = false;
            this.loading = true;
            if (this.newList.title === "") {
                this.alert = {
                    title: "Error",
                    text: "Title is required."
                };
                this.loading = false;
                return;
            }

            if (this.newList.shortUrl) {
                try {
                    const conflictingDocuments = await databases.listDocuments(
                        import.meta.env.VITE_APPWRITE_DB,
                        import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                        [
                            Query.equal("shortUrl", this.newList.shortUrl)
                        ]
                    );

                    if (conflictingDocuments.total !== 0) {
                        this.alert = {
                            title: "Error",
                            text: "Short URL already in use."
                        };
                        this.loading = false;
                        return;
                    }
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
            }

            try {
                list = await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DB,
                    import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                    ID.unique(),
                    { ...this.newList, author: this.auth.user.$id }
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

            this.$emit("createList", {
                list
            });

            this.newList = {
                title: "",
                description: "",
                shortUrl: ""
            };

            this.dialogOpen = false;
            this.loading = false;
        }
    }
};
</script>
