<template>
    <v-btn-group
        base-color="primary"
        divided
        rounded="pill"
    >
        <ModifyItem
            :list="list"
            :variant="variant"
            :currency="currency"
            :quickCreateURL="quickCreateURL"
            @unsetQuickCreateURL="resetQuickCreateURL"
            @newItem="(data) => $emit('newItem', data)"
        />

        <v-btn
            size="small"
            icon
            variant="tonal"
        >
            <v-icon :icon="mdiMenuDown" />

            <v-menu
                activator="parent"
                location="bottom end"
                transition="fade-transition"
            >
                <v-list
                    density="compact"
                    min-width="250"
                    rounded="lg"
                    slim
                >
                    <EditList :list="list" />
                    <DeleteList :list="list" />
                </v-list>
            </v-menu>
        </v-btn>

        <v-dialog
            :max-width="$vuetify.display.mobile ? '100%' : '500px'"
            :fullscreen="$vuetify.display.mobile ? true : false"
            v-model="quickcreateDialogOpen"
        >
            <template v-slot:activator>
                <v-btn
                    :prepend-icon="mdiClipboard"
                    variant="tonal"
                    @click="quickCreate"
                > 
                    Quickcreate
                </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card :title="quickCreateError.title">
                    <v-card-text>
                        {{ quickCreateError.text }}
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            text="OK"
                            @click="isActive.value = false"
                        />
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </v-btn-group>
</template>

<script setup>
import { defineProps, ref } from "vue";
import { mdiClipboard, mdiMenuDown } from "@mdi/js";
import DeleteList from "./DeleteList.vue";
import EditList from "./EditList.vue";
import ModifyItem from "./ModifyItem.vue";
import validation from "@/utils/validation";

defineProps({
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
    }
});

let quickCreateURL = ref("");
let quickCreateError = ref({
    title: "",
    text: ""
});
let quickcreateDialogOpen = ref(false);

const quickCreate = async () => {
    const result = await navigator.permissions.query({ name: "clipboard-read" });
    if (result.state === "granted") {
        const clipboardContents = await navigator.clipboard.readText();

        const validURL = validation.urlRegex.test(clipboardContents);

        if (validURL) {
            quickCreateURL.value = clipboardContents;
        } else {
            quickCreateError.value = {
                title: "Invalid URL",
                text: "The clipboard does not contain a valid URL."
            };
            quickcreateDialogOpen.value = true;
        }
    } else {
        alert("Clipboard read permission denied");
    }
};

const resetQuickCreateURL = () => {
    quickCreateURL.value = "";
};
</script>
