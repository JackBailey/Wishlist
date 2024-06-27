<template>
    <v-dialog max-width="500px" v-model="dialogOpen">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="error"
                icon="delete"
                :variant="variant"
            />
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Delete Item">
                <v-card-text>
                    Are you sure you want to delete this item?
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="error"
                        text="Delete"
                        @click="deleteItem"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { databases } from "@/appwrite";
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
            listId: null,
            dialogOpen: false,
        };
    },
    methods: {
        getCurrencyPrefix() {
            let formatter = new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: import.meta.env.VITE_CURRENCY
            });

            return formatter.formatToParts(0)[0].value;
        },
        async deleteItem() {
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_ITEM_COLLECTION,
                this.item.$id,
            );

            this.$emit("removeItem", {
                item: this.item.$id
            })

            this.dialogOpen = false;
        }
    }
}
</script>