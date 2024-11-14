<template>
    <v-form
        validate-on="blur"
        @submit.prevent
    >
        <v-text-field
            label="Title"
            v-model="item.title"
            maxlength="64"
            counter
            autofocus
            :rules="[() => !!item.title || 'Title is required']"
        />
        <v-textarea
            label="Description"
            v-model="item.description"
            maxlength="4000"
            counter
            persistent-hint
            hint="This field supports markdown!"
            class="mb-2"
        />
        <v-text-field
            type="url"
            label="Website"
            v-model="item.url"
            :prepend-icon="mdiLink"
            :rules="[validateUrl]"
            :error-messages="errors.url"
        />
        <v-text-field
            type="url"
            label="Image"
            v-model="item.image"
            :prepend-icon="mdiImage"
            persistent-hint
            hint="This should be a direct link to an image."
            class="mb-2"
            :rules="[validateUrl]"
        />
        <v-text-field
            type="number"
            label="Price"
            step="0.01"
            placeholder="0"
            v-model="item.price"
            :prefix="currencyStore.getCurrency(currency).symbol"
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
            :items="
                Object.entries(priorityMap).map((priority) => ({
                    title: priority[1].text,
                    value: priority[0]
                }))
            "
        />
    </v-form>
</template>

<script setup>
import { mdiCash, mdiImage, mdiLink } from "@mdi/js";
import { priorityMap } from "@/utils";
import { useCurrencyStore } from "@/stores/currency";
import validation from "@/utils/validation";

const item = defineModel("item");
const currencyStore = useCurrencyStore();

defineProps({
    currency: {
        type: String,
        required: true
    },
    errors: {
        type: Object,
        default: () => ({})
    }
});

const validateUrl = (url) => url === "" || validation.urlRegex.test(url) ? true : "Invalid URL";
</script>

<style scoped>
.v-input--error {
    margin-bottom: 5px;
}
</style>