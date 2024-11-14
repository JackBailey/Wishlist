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
    </v-btn-group>
</template>

<script setup>
import { defineProps } from "vue";
import DeleteList from "./DeleteList.vue";
import EditList from "./EditList.vue";
import { mdiMenuDown } from "@mdi/js";
import ModifyItem from "./ModifyItem.vue";

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
</script>
