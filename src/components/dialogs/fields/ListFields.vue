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
</template>

<script setup>
import { useCurrencyStore } from "@/stores/currency";
const list = defineModel("list");
const currencyStore = useCurrencyStore();
</script>
