<template>
    <v-card class="item">
        <div class="item-header">
            <h2>{{ item.title }}</h2>
            <v-btn-group
                base-color="primary"
                divided
                rounded="pill"
            >
                <v-btn prepend-icon="card_giftcard"> Fulfill </v-btn>
                <v-btn
                    append-icon="open_in_new"
                    :href="item.url"
                    target="_blank"
                    v-if="item.url"
                    variant="outlined"
                    size="small"
                >Open Website</v-btn>
                <EditItem
                    variant="outlined"
                    :item="item"
                    @editItem="$emit('editItem', $event)"
                    v-if="privateView"
                />
                <DeleteItem
                    variant="outlined"
                    :item="item"
                    @removeItem="$emit('removeItem', $event)"
                    v-if="privateView"
                />
            </v-btn-group>
        </div>
        <div class="item-main">
            <div class="item-content">
                <vue-markdown
                    v-if="item.description"
                    :source="item.description"
                    class="item-description"
                />
                <div class="chips">
                    <v-chip
                        prepend-icon="card_giftcard"
                        v-if="item.fulfilledBy"
                        color="primary"
                    >
                        <span> Fulfilled by {{ item.fulfilledBy }} </span>
                    </v-chip>
                    <v-chip
                        v-if="item.price"
                        color="primary"
                    >
                        <span>{{ formatCurrency(item.price) }}</span>
                    </v-chip>
                    <v-chip
                        v-if="item.priority !== 'none' && item.priority"
                        :prepend-icon="convertPriority(item.priority).icon"
                        color="primary"
                    >
                        {{ convertPriority(item.priority).text }}
                    </v-chip>
                </div>
            </div>
            <div class="item-image">
                <img
                    v-if="item.image"
                    :src="item.image"
                    alt=""
                />
                <div v-else class="image-fallback"></div>
            </div>
        </div>
    </v-card>
</template>

<script>
import { convertPriority } from "@/utils";
import DeleteItem from "./DeleteItem.vue";
import EditItem from "./EditItem.vue";
import VueMarkdown from "vue-markdown-render";
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    components: {
        DeleteItem,
        EditItem,
        VueMarkdown
    },
    data() {
        return {
            convertPriority,
            privateView: this.$route.meta?.requiresAuth || false
        };
    },
    methods: {
        formatCurrency(value) {
            let formatter = new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: import.meta.env.VITE_CURRENCY
            });

            return formatter.format(value);
        }
    }
};
</script>

<style lang="scss" scoped>
.item {
    padding: 1rem;
    border-radius: 1rem;
    .item-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        h2 {
            color: rgb(var(--v-theme-primary));
            font-size: 1.8rem;
            margin: 0;
        }
        margin-bottom: 1rem;
    }
    .item-main {
        display: grid;
        grid-template-columns: 1fr 12rem;
        gap: 0 2rem;
        .item-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .chips {
                margin-top: auto;
                display: flex;
                gap: 0.5rem;
            }
        }
        .item-image {
            img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 1rem;
                aspect-ratio: 1/1;
            }
        }
    }
}
</style>
