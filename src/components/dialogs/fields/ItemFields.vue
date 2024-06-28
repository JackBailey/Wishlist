<template>
    <v-text-field
        label="Title"
        v-model="item.title"
        maxlength="64"
        counter
    />
    <v-textarea
        label="Description"
        v-model="item.description"
        maxlength="256"
        counter
    />
    <v-text-field
        type="url"
        label="Website"
        v-model="item.url"
        :prepend-icon="mdiLink"
    />
    <v-text-field
        type="url"
        label="Image"
        v-model="item.image"
        :prepend-icon="mdiImage"
    />
    <v-text-field
        type="number"
        label="Price"
        step="0.01"
        v-model="item.price"
        :prefix="currencySymbol"
        :prepend-icon="mdiCash"
    />
    <v-switch
        label="Show Price"
        v-model="item.displayPrice"
        color="primary"
        inset
    />
    <v-select
        label="Priority"
        v-model="item.priority"
        :items="Object.entries(priorityMap).map((priority) => ({title: priority[1].text, value: priority[0]}))"
    />
</template>

<script setup>
import { currencySymbol, priorityMap } from "@/utils";
import { mdiCash, mdiImage, mdiLink } from "@mdi/js";

const item = defineModel("item");
</script>