<template>
    <v-dialog
        v-model="dialogOpen"
        :max-width="$vuetify.display.mobile ? '100%' : '90%'"
        :fullscreen="$vuetify.display.mobile ? true : false"
    >
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
            <v-card title="Create Item">
                <v-card-text>
                    <ItemFields
                        v-model:item="newItem"
                        :currency="list.currency"
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
                    <v-btn
                        text="Auto-fill"
                        :prepend-icon="mdiRobot"
                        variant="tonal"
                        @click="autoFill"
                        :loading="autofillLoading"
                    />
                    <v-btn
                        text="Cancel"
                        @click="isActive.value = false"
                    />
                    <v-btn
                        color="primary"
                        text="Create"
                        @click="createItem"
                        variant="elevated"
                        :loading="loading"
                    />
                </v-card-actions>
                <v-alert
                    :text="autofillError"
                    v-if="autofillError"
                />
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { AppwriteException, ID } from "appwrite";
import { databases, functions } from "@/appwrite";
import { mdiAlert, mdiPlus, mdiRobot } from "@mdi/js";
import ItemFields from "@/components/dialogs/fields/ItemFields.vue";
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
        ItemFields
    },
    data() {
        return {
            listId: null,
            dialogOpen: false,
            newItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: 0,
                displayPrice: true,
                priority: "none"
            },
            mdiPlus,
            mdiAlert,
            mdiRobot,
            alert: false,
            loading: false,
            autofillLoading: false,
            autofillError: false
        };
    },
    watch: {
        dialogOpen(open) {
            this.autofillError = false;
            if (open === true) {
                this.listId = this.list.$id;
            }
        }
    },
    methods: {
        async autoFill() {
            const url = this.newItem.url;
            if (!url) {
                this.autofillError = "Please enter a URL to use the auto-fill feature.";
                return;
            }
            this.autofillError = false;
            this.autofillLoading = true;

            try {
                const result = await functions.createExecution(
                    "get-autofill-data",
                    JSON.stringify({
                        url
                    }),
                    false
                );

                console.log(result);

                if (result.status === "completed") {
                    const responseData = JSON.parse(result.responseBody);
                    if (!responseData.hasOwnProperty("error")) {
                        this.newItem.title = responseData.title;
                        this.newItem.description = responseData.description;
                        this.newItem.image = responseData.image;
                        this.newItem.price = parseFloat(responseData.price.price) || 0;
                    } else {
                        console.error("Error:" , responseData);
                        this.autofillError = responseData.error;
                    }

                }
            } catch (e) {
                console.error("Error:" , e);
            }

            this.autofillLoading = false;
        },
        async createItem() {
            let result;
            this.alert = false;
            this.loading = true;

            if (this.newItem.title === "") {
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
                        title: this.newItem.title,
                        description: this.newItem.description || null,
                        url: this.newItem.url || null,
                        image: this.newItem.image || null,
                        price: parseFloat(this.newItem.price) || 0,
                        displayPrice: this.newItem.displayPrice,
                        priority: this.newItem.priority,
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

            this.newItem = {
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
        }
    }
};
</script>
