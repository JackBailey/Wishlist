<template>
    <v-card class="item" :data-fulfilled="!!item.fulfillment && !privateView">
        <h2>{{ item.title }}</h2>
        <v-btn-group
            base-color="primary"
            divided
            rounded="pill"
        >
            <FulfillItem
                v-if="!privateView"
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
        <div class="item-content" v-if="item.description">
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
                >
                    <span> Fulfilled by {{ item.fulfilledBy }} </span>
                </v-chip>
                <v-chip
                    v-if="item.price && item.displayPrice"
                    color="primary"
                >
                    <span>{{ currencyFormatter.format(item.price) }}</span>
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
        <div class="item-image" v-if="item.image">
            <img
                v-if="item.image"
                :src="item.image"
                alt=""
            />
            <div v-else class="image-fallback"></div>
        </div>
    </v-card>
</template>

<script>
import { convertPriority, currencyFormatter } from "@/utils";
import { mdiGift, mdiOpenInNew } from "@mdi/js";
import DeleteItem from "./DeleteItem.vue";
import EditItem from "./EditItem.vue";
import FulfillItem from "./FulfillItem.vue";
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
        FulfillItem,
        VueMarkdown
    },
    data() {
        return {
            convertPriority,
            currencyFormatter,
            mdiGift,
            mdiOpenInNew,
            privateView: this.$route.meta?.requiresAuth || false
        };
    }
};
</script>

<style lang="scss" scoped>
.item {
    padding: 1rem;
    border-radius: 1rem;
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
