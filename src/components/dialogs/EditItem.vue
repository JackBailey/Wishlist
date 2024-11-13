<template>
    <v-dialog
        :max-width="$vuetify.display.mobile ? '100%' : '90%'"
        :fullscreen="$vuetify.display.mobile ? true : false"
        v-model="dialogOpen"
    >
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                :icon="mdiPencil"
                base-color="primary"
                size="small"
                :variant="variant"
            />
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Edit Item">
                <v-card-text>
                    <ItemFields
                        v-model:item="editedItem"
                        :currency="currency"
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
                        text="Cancel"
                        @click="isActive.value = false"
                    />
                    <v-btn
                        color="primary"
                        text="Save"
                        @click="editItem"
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
import ItemFields from "@/components/dialogs/fields/ItemFields.vue";
export default {
    title: "ListDialog",
    props: {
        item: {
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
        }
    },
    components: {
        ItemFields
    },
    data() {
        return {
            dialogOpen: false,
            editedItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: "",
                displayPrice: false,
                priority: "none"
            },
            mdiPencil,
            mdiAlert,
            alert: false,
            loading: false
        };
    },
    watch: {
        dialogOpen(open) {
            if (open === true) {
                this.editedItem = {
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
    },
    methods: {
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
                        title: this.editedItem.title,
                        description: this.editedItem.description || null,
                        url: this.editedItem.url || null,
                        image: this.editedItem.image || null,
                        price: parseFloat(this.editedItem.price) || 0,
                        displayPrice: this.editedItem.displayPrice,
                        priority: this.editedItem.priority,
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
