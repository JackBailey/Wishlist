<template>
    <v-dialog max-width="500px" v-model="dialogOpen">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                :prepend-icon="item.fulfillment ? mdiGiftOff : mdiGift"
                :variant="variant"
            > {{ item.fulfillment ? item.fulfillment.name : "Fulfill" }} </v-btn>
        </template>
        
        <template v-slot:default="{ isActive }">
            <v-card title="Fulfill Item" v-if="!item.fulfillment">
                <v-card-text>
                    <v-text-field
                        label="Your name"
                        v-model="name"
                    />

                    <b>Thank you!</b>

                    This will only be shown to other viewers of this list to help prevent duplicates.<br/>
                    It will <span class="text-error" style="font-weight: bold; text-decoration: underline;">not be shown</span> to the owner of this list.
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="primary"
                        text="Fulfill"
                        @click="fulfillItem"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
            <v-card title="Unfulfill Item" v-else>
                <v-card-text>
                    Are you sure you want to do this? It can be undone at any time
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="isActive.value = false"/>
                    <v-btn
                        color="primary"
                        text="Unfulfill"
                        @click="unfulfillItem"
                        variant="elevated"
                    />
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { mdiGift, mdiGiftOff } from "@mdi/js";
import { databases } from "@/appwrite";
import { ID } from "appwrite";
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
            name: "",
            dialogOpen: false,
            mdiGift,
            mdiGiftOff
        };
    },
    methods: {
        async fulfillItem() {
            const result = await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_FULFILLMENT_COLLECTION,
                ID.unique(),
                {
                    name: this.name,
                    item: this.item.$id
                }
            );

            this.$emit("fulfillItem", result);

            this.dialogOpen = false;
        },
        async unfulfillItem() {
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_FULFILLMENT_COLLECTION,
                this.item.fulfillment.$id
            );

            this.$emit("unfulfillItem");

            this.dialogOpen = false;
        }
    }
};
</script>