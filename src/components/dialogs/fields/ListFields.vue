<template>
    <v-text-field
        label="Title"
        v-model="list.title"
        maxlength="128"
        counter
        autofocus
    />
    <v-textarea
        label="Description"
        v-model="list.description"
        maxlength="4000"
        counter
        hint="This field supports markdown!"
    />
    <v-select
        label="Currency"
        v-model="list.currency"
        :items="
            currencyStore.currencies.map((currency) => ({
                title: currency.code,
                value: currency.code
            }))
        "
    />
    <v-text-field
        label="Short URL"
        v-model="list.shortUrl"
        maxlength="32"
        counter
        persistent-hint
        @input="shortUrlChanged"
        :hint="
            list.shortUrl ? `Your short URL will be: ${origin}/${list.shortUrl}` : `Set a memorable short URL for your list`
        "
    />
</template>

<script setup>
import { computed } from "vue";
import { useCurrencyStore } from "@/stores/currency";
const list = defineModel("list");
const currencyStore = useCurrencyStore();

const origin = computed(() => window.location.origin);

const shortUrlChanged = () => {
    if (list.value.shortUrl === "") return list.value.shortUrl = null;
    list.value.shortUrl = list.value.shortUrl.toLowerCase().replace(/[^a-z0-9-_]/g, "");
};
</script>
