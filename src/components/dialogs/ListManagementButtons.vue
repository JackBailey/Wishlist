<template>
    <v-btn-group
        base-color="primary"
        divided
        rounded="pill"
    >
        <CreateItem
            :list="list"
            :variant="variant"
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
    </v-btn-group>
</template>

<script setup>
import CreateItem from "./CreateItem.vue";
import { defineProps } from "vue";
import DeleteList from "./DeleteList.vue";
import EditList from "./EditList.vue";
import { mdiMenuDown } from "@mdi/js";

defineProps({
    list: {
        type: Object,
        default: () => ({})
    },
    variant: {
        type: String,
        default: "elevated"
    }
});
</script>
