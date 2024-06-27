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
            <v-card title="Edit Item">
                <v-card-text>
                    <v-text-field
                        label="Title"
                        v-model="editedItem.title"
                    />
                    <v-textarea
                        label="Description"
                        v-model="editedItem.description"
                    />
                    <v-text-field
                        type="url"
                        label="Website"
                        v-model="editedItem.url"
                        prepend-icon="link"
                    />
                    <v-text-field
                        type="url"
                        label="Image"
                        v-model="editedItem.image"
                        prepend-icon="image"
                    />
                    <v-text-field
                        type="number"
                        label="Price"
                        v-model="editedItem.price"
                        :prefix="getCurrencyPrefix()"
                        prepend-icon="wallet"
                        step="0.01"
                    />
                    <v-select
                        label="Priority"
                        :items="Object.entries(priorityMap).map((priority) => ({title: priority[1].text, value: priority[0]}))"
                        v-model="editedItem.priority"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="primary"
                        text="Save"
                        @click="editItem"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { databases } from "@/appwrite";
import { priorityMap } from "@/utils";
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
        }
    },
    data() {
        return {
            dialogOpen: false,
            priorityMap,
            editedItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: 0,
                priority: "none"
            }
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
                    priority: this.item.priority
                };
            }
        }
    },
    methods: {
        getCurrencyPrefix() {
            let formatter = new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: import.meta.env.VITE_CURRENCY
            });

            return formatter.formatToParts(0)[0].value;
        },
        async editItem() {
            const result = await databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_ITEM_COLLECTION,
                this.item.$id,
                {
                    title: this.editedItem.title,
                    description: this.editedItem.description || null,
                    url: this.editedItem.url || null,
                    image: this.editedItem.image || null,
                    price: parseFloat(this.editedItem.price) || 0,
                    priority: this.editedItem.priority,
                    list: this.listId,
                }
            );

            this.$emit("editItem", {
                item: result
            })

            this.dialogOpen = false;
        }
    }
}
</script>