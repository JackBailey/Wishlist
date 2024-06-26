<template>
    <md-elevated-card class="item">
        <div class="item-header">
            <h2>{{ item.title }}</h2>
            <div class="item-actions">
                <md-filled-button has-icon>
                    Fulfill
                    <md-icon slot="icon">featured_seasonal_and_gifts</md-icon>
                </md-filled-button>
                <md-outlined-button
                    has-icon
                    trailing-icon
                    :href="item.url"
                    target="_blank"
                    v-if="item.url"
                >
                    Open Website
                    <md-icon slot="icon">open_in_new</md-icon>
                </md-outlined-button>
                <md-outlined-icon-button v-if="privateView">
                    <md-icon>edit</md-icon>
                </md-outlined-icon-button>
                <md-filled-icon-button v-if="privateView" class="delete-button">
                    <md-icon>delete</md-icon>
                </md-filled-icon-button>
            </div>
        </div>
        <div class="item-main">
            <div class="item-content">
                <vue-markdown v-if="item.description" :source="item.description" />
                <div class="chip-indicators">
                    <div class="chip fulfilled" v-if="item.fulfilledBy && !privateView">
                        <md-icon>featured_seasonal_and_gifts</md-icon>
                        <span> Fulfilled by {{ item.fulfilledBy }} </span>
                        <md-elevation />
                    </div>
                    <div class="chip price" v-if="item.price !== 0">
                        <span>
                            {{ formatCurrency(item.price) }}
                        </span>
                        <md-elevation />
                    </div>
                    <div
                        class="chip priority"
                        :data-priority="item.priority"
                        v-if="item.priority !== 'none'"
                    >
                        <md-icon>{{ convertPriority(item.priority).icon }}</md-icon>
                        <span>
                            {{ convertPriority(item.priority).text }}
                        </span>
                        <md-elevation />
                    </div>
                </div>
            </div>
            <div class="item-image">
                <img v-if="item.image" :src="item.image" alt="" />
                <div v-else class="image-fallback"></div>
            </div>
        </div>
    </md-elevated-card>
</template>

<script>
import "material/iconbutton/outlined-icon-button";
import "material/button/filled-button";
import "material/button/outlined-button";
import "material/icon/icon";
import "material/elevation/elevation";
import { convertPriority } from "@/utils";
import VueMarkdown from "vue-markdown-render";
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    components: {
        VueMarkdown,
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
    color: var(--md-sys-color-on-surface);
    .item-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        h2 {
            color: var(--md-sys-color-primary);
            font-size: 1.8rem;
            margin: 0;
        }
        .item-actions {
            display: flex;
            gap: 0.5rem;
            align-items: start;
            justify-content: flex-end;
            margin-bottom: 1rem;
            md-filled-icon-button.delete-button {
                --md-sys-color-primary: var(--md-sys-color-error);
            }
        }
    }
    .item-main {
        display: grid;
        grid-template-columns: 1fr 12rem;
        gap: 0 2rem;
        .item-content {
            display: flex;
            flex-direction: column;

            .chip-indicators {
                margin-top: auto;
                display: flex;
                gap: 0.5rem;
                .chip {
                    position: relative;
                    border-radius: 8px;
                    width: max-content;
                    padding: 0.5rem 1rem;
                    --md-elevation-level: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--md-sys-color-on-surface-variant);
                    span {
                        color: inherit;
                        font-weight: 500;
                        font-family: var(--md-ref-typeface-plain);
                        font-size: 14px;
                    }
                    &.price {
                        background-color: var(--md-sys-color-primary);
                        color: var(--md-sys-color-on-primary);
                    }
                    &.fulfilled {
                        background-color: var(--md-sys-color-primary-fixed);
                        color: var(--md-sys-color-primary-on-fixed);
                    }
                }
            }
        }
        .item-image {
            img {
                max-width: 100%;
                max-height: 100%;
                object-fit: cover;
                border-radius: 1rem;
                aspect-ratio: 1/1;
            }
        }
    }
}
</style>
