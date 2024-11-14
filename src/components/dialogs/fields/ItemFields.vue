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

const item = defineModel("item");
const currencyStore = useCurrencyStore();

defineProps({
    currency: {
        type: String,
        required: true
    }
});

const urlRegex = new RegExp(
    "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
        // TLD may end with dot
        "\\.?" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
        "$",
    "i"
);

const validateUrl = (url) => url === "" || urlRegex.test(url) ? true : "Invalid URL";
</script>

<style scoped>
.v-input--error {
    margin-bottom: 5px;
}
</style>