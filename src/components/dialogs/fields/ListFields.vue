<template>
    <v-text-field
        label="Title"
        v-model="list.title"
        maxlength="64"
        counter
    />
    <v-textarea
        label="Description"
        v-model="list.description"
        maxlength="4096"
        counter
    />
</template>

<script setup>
const list = defineModel("list");
</script>