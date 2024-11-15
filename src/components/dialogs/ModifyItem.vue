<template>
    <v-dialog
        v-model="dialogOpen"
        :max-width="$vuetify.display.mobile ? '100%' : '90%'"
        :fullscreen="$vuetify.display.mobile ? true : false"
    >
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                :append-icon="item ? mdiPencil : mdiPlus"
                base-color="primary"
                size="small"
                :variant="variant"
            >
                <template v-if="!item"> Add Item </template>
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card :title="item ? 'Edit Item' : 'Create Item'">
                <v-card-text>
                    <ItemFields
                        v-model:item="modifiedItem"
                        :currency="currency"
                        :errors="errors"
                    />
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
                    <v-tooltip
                        :open-on-hover="modifiedItem.url === ''"
                    >
                        <template v-slot:activator="{ props }">
                            <span v-bind="props">
                                <v-btn
                                    text="Auto-fill"
                                    :prepend-icon="mdiRobot"
                                    variant="tonal"
                                    @click="autoFill"
                                    :loading="autofillLoading"
                                    :disabled="modifiedItem.url === ''"
                                /></span>
                        </template>
                        <span>Please enter a URL to use the auto-fill feature</span>
                    </v-tooltip>
                    <v-btn
                        text="Cancel"
                        @click="isActive.value = false"
                    />
                    <v-btn
                        color="primary"
                        text="Save"
                        @click="editItem"
                        variant="elevated"
                        :loading="loading"
                        v-if="item"
                    />
                    <v-btn
                        color="primary"
                        text="Create"
                        @click="createItem"
                        variant="elevated"
                        :loading="loading"
                        v-else
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { AppwriteException, ID } from "appwrite";
import { databases, functions } from "@/appwrite";
import { mdiAlert, mdiPencil, mdiPlus, mdiRobot } from "@mdi/js";
import ItemFields from "@/components/dialogs/fields/ItemFields.vue";
export default {
    title: "ListDialog",
    props: {
        item: {
            type: Object
        },
        list: {
            type: Object,
            default: () => ({})
        },
        variant: {
            type: String,
            default: "elevated"
        },
        currency: {
            type: String,
            required: true
        },
        quickCreateURL: {
            type: String,
            default: ""
        }
    },
    components: {
        ItemFields
    },
    data() {
        return {
            listId: null,
            dialogOpen: false,
            modifiedItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: "",
                displayPrice: true,
                priority: "none"
            },
            mdiPencil,
            mdiPlus,
            mdiAlert,
            mdiRobot,
            alert: false,
            loading: false,
            autofillLoading: false,
            errors: {}
        };
    },
    watch: {
        quickCreateURL(newURL) {
            if (newURL) {
                this.dialogOpen = true;
                this.modifiedItem.url = newURL;
                this.autoFill();

                this.$emit("unsetQuickCreateURL", "");
            }
        },
        dialogOpen(open) {
            this.errors = {};
            if (open === true) {
                this.listId = this.list.$id;

                if (this.item) {
                    this.modifiedItem = {
                        title: this.item.title,
                        description: this.item.description,
                        url: this.item.url,
                        image: this.item.image,
                        price: this.item.price,
                        displayPrice: this.item.displayPrice,
                        priority: this.item.priority
                    };
                }
            }
        }
    },
    methods: {
        async autoFill() {
            this.errors = {};
            const url = this.modifiedItem.url;
            if (!url) {
                this.errors = {
                    url: "Please enter a URL to use the auto-fill feature."
                };
                return;
            }
            this.autofillLoading = true;

            try {
                const result = await functions.createExecution(
                    "get-autofill-data",
                    JSON.stringify({
                        url
                    }),
                    false
                );

                if (result.status === "completed") {
                    const responseData = JSON.parse(result.responseBody);
                    if (!Object.prototype.hasOwnProperty.call(responseData, "error")) {
                        if (!responseData.title && !responseData.image && !responseData.price) {
                            this.errors = {
                                url: "Unable to autofill data."
                            };
                            this.autofillLoading = false;
                            return;
                        }
                        if (responseData.title) this.modifiedItem.title = responseData.title;
                        this.modifiedItem.description = responseData.description;
                        this.modifiedItem.url = responseData.url;
                        if (responseData.image) this.modifiedItem.image = responseData.image;
                        if (responseData.price) {
                            this.modifiedItem.price = parseFloat(responseData.price.price) || 0;
                        }
                    } else {
                        this.errors = {
                            url: responseData.error
                        };
                    }
                }
            } catch (e) {
                console.error("Error:", e);
            }

            this.autofillLoading = false;
        },
        async createItem() {
            let result;
            this.alert = false;
            this.loading = true;

            if (this.modifiedItem.title === "") {
                this.alert = {
                    title: "Error",
                    text: "Title is required."
                };
                this.loading = false;
                return;
            }
            try {
                result = await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DB,
                    import.meta.env.VITE_APPWRITE_ITEM_COLLECTION,
                    ID.unique(),
                    {
                        title: this.modifiedItem.title,
                        description: this.modifiedItem.description || null,
                        url: this.modifiedItem.url || null,
                        image: this.modifiedItem.image || null,
                        price: parseFloat(this.modifiedItem.price) || 0,
                        displayPrice: this.modifiedItem.displayPrice,
                        priority: this.modifiedItem.priority,
                        list: this.listId
                    }
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

            this.$emit("newItem", {
                item: result
            });

            this.modifiedItem = {
                title: "",
                description: "",
                url: "",
                image: "",
                price: 0,
                displayPrice: true,
                priority: "none"
            };

            this.dialogOpen = false;
            this.loading = false;
        },
        async editItem() {
            let result;
            this.alert = false;
            this.loading = true;

            try {
                result = await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DB,
                    import.meta.env.VITE_APPWRITE_ITEM_COLLECTION,
                    this.item.$id,
                    {
                        title: this.modifiedItem.title,
                        description: this.modifiedItem.description || null,
                        url: this.modifiedItem.url || null,
                        image: this.modifiedItem.image || null,
                        price: parseFloat(this.modifiedItem.price) || 0,
                        displayPrice: this.modifiedItem.displayPrice,
                        priority: this.modifiedItem.priority,
                        list: this.listId
                    }
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

            this.$emit("editItem", {
                item: result
            });

            this.dialogOpen = false;
            this.loading = false;
        }
    }
};
</script>
