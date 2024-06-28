<template>
    <v-dialog max-width="90%" v-model="dialogOpen">
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
                    <ItemFields v-model:item="editedItem" />
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
import ItemFields from "./fields/ItemFields.vue";
import { mdiPencil } from "@mdi/js";
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
                price: 0,
                displayPrice: false,
                priority: "none"
            },
            mdiPencil
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
                    displayPrice: this.editedItem.displayPrice,
                    priority: this.editedItem.priority,
                    list: this.listId
                }
            );

            this.$emit("editItem", {
                item: result
            });

            this.dialogOpen = false;
        }
    }
};
</script>