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
                    <v-text-field
                        label="Title"
                        v-model="newItem.title"
                    />
                    <v-textarea
                        label="Description"
                        v-model="newItem.description"
                    />
                    <v-text-field
                        type="url"
                        label="Website"
                        v-model="newItem.url"
                        :prepend-icon="mdiLink"
                    />
                    <v-text-field
                        type="url"
                        label="Image"
                        v-model="newItem.image"
                        :prepend-icon="mdiImage"
                    />
                    <v-text-field
                        type="number"
                        label="Price"
                        step="0.01"
                        v-model="newItem.price"
                        :prefix="currencySymbol"
                        :prepend-icon="mdiCash"
                    />
                    <v-switch
                        label="Show Price"
                        v-model="newItem.displayPrice"
                        color="primary"
                        inset
                    />
                    <v-select
                        label="Priority"
                        :items="Object.entries(priorityMap).map((priority) => ({title: priority[1].text, value: priority[0]}))"
                        v-model="newItem.priority"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="primary"
                        text="Save"
                        @click="createItem"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { currencySymbol, priorityMap } from "@/utils";
import { mdiCash, mdiImage, mdiLink, mdiPlus } from "@mdi/js";
import { databases } from "@/appwrite";
import { ID } from "appwrite";
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
            currencySymbol,
            priorityMap,
            newItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: 0,
                displayPrice: false,
                priority: "none"
            },
            mdiPlus,
            mdiImage,
            mdiLink,
            mdiCash
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
                    list: this.listId,
                }
            );

            this.$emit("newItem", {
                item: result
            })

            this.dialogOpen = false;
        }
    }
}
</script>