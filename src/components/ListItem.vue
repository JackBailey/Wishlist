<template>
    <v-card
        class="item"
        :data-fulfilled="!!item.fulfillment && (!loggedIn || (loggedIn && spoilSurprises))"
        variant="tonal"
    >
        <h2>{{ item.title }}</h2>
        <v-btn-group
            base-color="primary"
            divided
            rounded="pill"
        >
            <FulfillItem
                v-if="!loggedIn || (loggedIn && spoilSurprises && item.fulfillment)"
                :item="item"
                @fulfillItem="$emit('fulfillItem', $event)"
                @unfulfillItem="$emit('unfulfillItem', item.$id)"
            />
            <v-btn
                :append-icon="mdiOpenInNew"
                :href="item.url"
                target="_blank"
                v-if="item.url"
                variant="outlined"
                size="small"
            >Open Website</v-btn>
            <EditItem
                variant="outlined"
                :item="item"
                :currency="currency"
                @editItem="$emit('editItem', $event)"
                v-if="loggedIn"
            />
            <DeleteItem
                variant="outlined"
                :item="item"
                @removeItem="$emit('removeItem', $event)"
                v-if="loggedIn"
            />
        </v-btn-group>
        <div class="item-content">
            <vue-markdown
                v-if="item.description"
                :source="item.description"
                class="item-description"
            />
            <div class="chips">
                <v-chip
                    :prepend-icon="mdiGift"
                    v-if="item.fulfilledBy"
                    color="primary"
                    variant="elevated"
                >
                    <span> Fulfilled by {{ item.fulfilledBy }} </span>
                </v-chip>
                <v-chip
                    v-if="item.price && item.displayPrice"
                    color="primary"
                    variant="elevated"
                >
                    <span>{{ currencyStore.formatter(this.currency).format(item.price) }}</span>
                </v-chip>
                <v-chip
                    v-if="item.priority !== 'none' && item.priority"
                    :prepend-icon="convertPriority(item.priority).icon"
                    color="primary"
                    variant="elevated"
                >
                    {{ convertPriority(item.priority).text }}
                </v-chip>
                <v-chip
                    :prepend-icon="mdiWeb"
                    v-if="item.url"
                    :href="item.url"
                    target="_blank"
                >
                    {{ getWebsiteHostname(item.url) }}
                </v-chip>
            </div>
        </div>
        <div class="item-image" v-if="item.image">
            <v-img
                :src="item.image"
                alt=""
                width="200"
            />
        </div>
    </v-card>
</template>

<script>
import { mdiGift, mdiOpenInNew, mdiWeb } from "@mdi/js";
import { convertPriority } from "@/utils";
import DeleteItem from "@/components/dialogs/DeleteItem.vue";
import EditItem from "@/components/dialogs/EditItem.vue";
import FulfillItem from "@/components/dialogs/FulfillItem.vue";
import { useAuthStore } from "@/stores/auth";
import { useCurrencyStore } from "@/stores/currency";
import VueMarkdown from "vue-markdown-render";
export default {
    props: {
        item: {
            type: Object,
            required: true
        },
        currency: {
            type: String,
            required: true
        }
    },
    components: {
        DeleteItem,
        EditItem,
        FulfillItem,
        VueMarkdown
    },
    data() {
        return {
            convertPriority,
            mdiGift,
            mdiOpenInNew,
            mdiWeb,
            auth: useAuthStore(),
            currencyStore: useCurrencyStore()
        };
    },
    computed: {
        loggedIn() {
            return !!this.auth.user;
        },
        spoilSurprises() {
            return this.auth.userPrefs.spoilSurprises;
        }
    },
    methods: {
        getWebsiteHostname(url) {
            const toTitleCase = (str) => {
                return str.replace(
                    /\w\S*/g,
                    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
                );
            };
            const { hostname } = new URL(url);
            const parts = hostname.split(".");
            const website = (parts.length === 2) ? parts[0] : parts[1];
            return toTitleCase(website);
        }
    }
};
</script>

<style lang="scss" scoped>
.item {
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 1rem;
    justify-content: space-between;

    h2 {
        color: rgb(var(--v-theme-primary));
        font-size: 1.8rem;
        margin: 0;
        align-self: center;
    }

    .v-btn-group {
        justify-self: end;
        align-self: center;
    }

    .item-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .chips {
            margin-top: auto;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
    }
    .item-image {
        justify-self: end;
        img {
            max-width: 12rem;
            max-height: 12rem;
            object-fit: contain;
            border-radius: 1rem;
        }
    }
    &[data-fulfilled="true"] {
        opacity: 0.5;
    }

    @media screen and (max-width: 768px){
        .v-btn-group {
            justify-self: start;
        }
        .item-image {
            grid-column: 2;
            grid-row: 1/4;
            img {
                max-height: 100%;
                max-width: 10rem;
            }
        }
    }

    @media screen and (max-width: 480px) {
        grid-template-columns: 1fr;
        .v-btn-group {
            justify-self: center;
        }
        .item-content {
            grid-row: 2;    
        }
        .item-image {
            grid-row: 3;
            grid-column: 1;
            justify-self: center;
        }        
    }
}
</style>
