<template>
    <main>
        <dialog ref="newListDialog">
            <h2>Create new item</h2>
            <form @submit.prevent="createItem">
                <label for="title">Title</label>
                <input type="text"
                       id="title"
                       name="title"
                       required
                       v-model="newItem.title" />
                <label for="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    v-model="newItem.description"
                ></textarea>
                <label for="url">URL</label>
                <input type="url"
                       id="url"
                       name="url"
                       v-model="newItem.url" />
                <label for="image">Image</label>
                <input type="url"
                       id="image"
                       name="image"
                       v-model="newItem.image" />
                <label for="price">Price</label>
                <input type="number"
                       id="price"
                       name="price"
                       v-model="newItem.price"
                       min="0" />
                <label for="priority">Priority</label>
                <select name="priority" id="priority" v-model="newItem.priority">
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button type="submit">Create</button>
            </form>
        </dialog>
        <md-elevated-card class="list-header">
            <h1>
                {{ list.title }}
                <md-filled-icon-button @click="openDialog">
                    <md-icon>add</md-icon>
                </md-filled-icon-button>
            </h1>
            <vue-markdown v-if="list.description" :source="list.description" class="description" />
        </md-elevated-card>
        <md-divider style="margin: 1rem 0" />
        <div class="items">
            <md-elevated-card class="item" v-for="item in list.items" :key="item.$id">
                <div class="item-header">
                    <h2>{{ item.title }}</h2>
                    <div class="item-actions">
                        <md-filled-button has-icon>
                            Fulfill
                            <template v-slot:icon>
                                <md-icon>featured_seasonal_and_gifts</md-icon>
                            </template>
                        </md-filled-button>
                        <md-outlined-button
                            has-icon
                            trailing-icon
                            :href="item.url"
                            target="_blank"
                            v-if="item.url"
                        >
                            Open Website
                            <template v-slot:icon>
                                <md-icon>open_in_new</md-icon>
                            </template>
                        </md-outlined-button>
                        <md-outlined-icon-button>
                            <md-icon>edit</md-icon>
                        </md-outlined-icon-button>
                    </div>
                </div>
                <div class="item-main">
                    <div class="item-content">
                        <vue-markdown v-if="item.description" :source="item.description" />
                        <div class="chip-indicators">
                            <div class="chip fulfilled" v-if="item.fulfilledBy">
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
        </div>
    </main>
</template>

<script>
import "material/button/filled-button.js";
import "material/card/elevated-card";
import "material/iconbutton/filled-icon-button";
import "material/iconbutton/icon-button";
import "material/iconbutton/outlined-icon-button";
import "material/button/outlined-button";
import "material/button/filled-tonal-button";
import "material/icon/icon";
import "material/divider/divider";
import "material/chips/chip-set";
import "material/chips/suggestion-chip";
import "material/chips/assist-chip";
import "material/elevation/elevation";
import { convertPriority } from "@/utils";
import { databases } from "@/appwrite";
import { ID } from "appwrite";
import { useAuthStore } from "@/stores/auth";
import VueMarkdown from "vue-markdown-render";
export default {
    components: {
        VueMarkdown
    },
    data() {
        return {
            auth: useAuthStore(),
            list: [],
            listId: this.$route.params.id,
            convertPriority: convertPriority,
            newItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: 0,
                priority: "none"
            }
        };
    },
    methods: {
        formatCurrency(value) {
            let formatter = new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: import.meta.env.VITE_CURRENCY
            });

            return formatter.format(value);
        },
        openDialog() {
            this.$refs.newListDialog.showModal();
        },
        async createItem() {
            console.log({ ...this.newItem, list: this.listId });
            const document = await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_ITEM_COLLECTION,
                ID.unique(),
                {
                    ...this.newItem,
                    list: this.listId,
                    url: this.newItem.url || null
                }
            );

            this.$refs.newListDialog.close();
        }
    },
    async mounted() {
        this.list = await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
            this.listId,
            []
        );
    }
};
</script>

<style lang="scss" scoped>
main {
    width: var(--section-width);
    margin: 0 auto;
    dialog {
        form {
            display: flex;
            flex-direction: column;
        }
    }

    .list-header {
        padding: 1rem;
        h1 {
            md-filled-icon-button {
                margin-left: 1rem;
            }
        }
    }

    .items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
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
    }
}
</style>
