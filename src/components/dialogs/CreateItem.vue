<template>
    <v-dialog max-width="90%" v-model="dialogOpen">
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
                    <ItemFields v-model:item="newItem" />
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="primary"
                        text="Create"
                        @click="createItem"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { databases } from "@/appwrite";
import { ID } from "appwrite";
import ItemFields from "@/components/dialogs/fields/ItemFields.vue";
import { mdiPlus } from "@mdi/js";
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
            mdiPlus
        };
    },
    watch: {
        dialogOpen(open) {
            if (open === true) {
                this.listId = this.list.$id;
            }
        }
    },
    methods: {
        async createItem() {
            const result = await databases.createDocument(
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
        }
    }
};
</script>