<template>
    <div
        class="page-content"
        v-if="!list"
    >
        <v-skeleton-loader type="card" />
        <v-skeleton-loader type="card" />
        <v-skeleton-loader type="card" />
    </div>
    <div
        class="page-content"
        v-else
    >
        <v-card
            class="list-header"
            variant="tonal"
        >
            <h1>
                {{ list.title }}
                <ListManagementButtons
                    :list="list"
                    :currency="list.currency"
                    :quickCreateQueryURL="quickCreateURL"
                    v-if="wishlistOwner"
                    @newItem="addItem"
                    @updateList="updateList"
                />
            </h1>
            <vue-markdown
                v-if="list.description"
                :source="list.description"
                class="description user-item-markdown"
            />
        </v-card>
        <div class="filters">
            <v-switch
                label="Show Fulfilled"
                v-model="showFulfilled"
                color="primary"
                inset
                v-if="spoilSurprises"
            />
        </div>
        <v-alert
            v-if="!wishlistOwner"
            type="info"
            :icon="mdiInformation"
            elevation="2"
            class="mt-5"
            text="Make sure to mark anything as Fulfilled if you've purchased or plan on purchasing any of the items on the list! This will not be shown to the owner of this list."
            color="primary"
        />
        <div
            class="items"
            v-if="list.items.length"
        >
            <div
                class="item-price-group"
                v-for="priceGroup in itemsByPriceGroups"
                :key="priceGroup.price"
            >
                <h3>{{ priceGroup.title }}</h3>
                <v-divider />
                <div class="item-price-group-items">
                    <ListItem
                        v-for="item in priceGroup.items"
                        :key="item.$id"
                        :item="item"
                        :wishlistOwner="wishlistOwner"
                        :currency="list.currency"
                        @removeItem="removeItem(item.$id)"
                        @editItem="editItem($event)"
                        @fulfillItem="fulfillItem($event)"
                        @unfulfillItem="unfulfillItem($event)"
                    />
                </div>
            </div>
        </div>
        <div
            class="no-items"
            v-else
        >
            <v-spacer height="20" />
            <v-alert
                type="info"
                :icon="mdiInformation"
                elevation="2"
                class="mt-5"
                text="No items currently exist in this list. Add some!"
            />
        </div>
    </div>
</template>

<script>
import { client, databases } from "@/appwrite";
import { mdiInformation, mdiShare } from "@mdi/js";
import ListItem from "@/components/ListItem.vue";
import ListManagementButtons from "@/components/dialogs/ListManagementButtons.vue";
import { useAuthStore } from "@/stores/auth";
import { useCurrencyStore } from "@/stores/currency";
import VueMarkdown from "vue-markdown-render";
export default {
    components: {
        ListManagementButtons,
        ListItem,
        VueMarkdown
    },
    data() {
        return {
            list: false,
            fulfilledItems: [],
            listId: this.$route.params.id,
            auth: useAuthStore(),
            currency: useCurrencyStore(),
            newItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: 0,
                priority: "none"
            },
            sort: "price",
            mdiInformation,
            mdiShare,
            priceGroups: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
            showFulfilled: localStorage.getItem("showFulfilled") !== "false",
            quickCreateURL: this.$route.query.quickcreateurl
        };
    },
    computed: {
        wishlistOwner() {
            return this.auth.isLoggedIn && this.auth.user.$id === this.list.author;
        },
        spoilSurprises() {
            return this.auth.userPrefs.spoilSurprises;
        },
        itemsByPriceGroups() {
            if (!this.list || this.list.items.length === 0) return;

            const priceGroupItems = this.priceGroups
                .map((price, index) => {
                    const lowerBound = index === 0 ? 0 : this.priceGroups[index - 1];
                    const upperBound = price;

                    return {
                        price,
                        title:
                            this.currency
                                .formatter(this.list.currency)
                                .format(lowerBound)
                                .split(".")[0] +
                            " - " +
                            this.currency
                                .formatter(this.list.currency)
                                .format(upperBound)
                                .split(".")[0],
                        items: this.list.items
                            .filter((item) => {
                                if (!this.showFulfilled && item.fulfillment && this.spoilSurprises)
                                    return false;
                                if (item.price >= lowerBound && item.price < upperBound) {
                                    return item;
                                }
                            })
                            .sort((a, b) => {
                                if (!this.wishlistOwner) {
                                    if (a.fulfillment && !b.fulfillment) return 1;
                                    if (!a.fulfillment && b.fulfillment) return -1;
                                }

                                if (this.sort === "price") {
                                    return a.price - b.price;
                                }
                                return a.title.localeCompare(b.title);
                            })
                    };
                })
                .filter((priceGroup) => priceGroup.items.length);
            return priceGroupItems;
        }
    },
    methods: {
        updateList(data) {
            this.list.title = data.list.title;
            this.list.description = data.list.description;
            this.list.currency = data.list.currency;
            this.list.shortUrl = data.list.shortUrl;
        },
        addItem(data) {
            this.list.items.push(data.item);
            this.$nextTick(() => {
                const newItem = this.$el.querySelector(`[data-item-id="${data.item.$id}"]`);
                newItem.scrollIntoView({
                    behavior: "auto",
                    block: "center",
                    inline: "center"
                });
            });
        },
        editItem(data) {
            this.list.items = this.list.items.map((item) => {
                if (item.$id === data.item.$id) {
                    return data.item;
                }
                return item;
            });
        },
        removeItem(id) {
            this.list.items = this.list.items.filter((item) => item.$id !== id);
        },
        fulfillItem(data) {
            this.list.items = this.list.items.map((item) => {
                if (item.$id === data.item.$id) {
                    item.fulfillment = data;
                }
                return item;
            });
        },
        unfulfillItem(itemId) {
            this.list.items = this.list.items.map((item) => {
                if (item.$id === itemId) {
                    item.fulfillment = null;
                }
                return item;
            });
        }
    },
    watch: {
        showFulfilled(val) {
            localStorage.setItem("showFulfilled", val);
        }
    },
    async mounted() {
        let list = await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
            this.listId
        );

        this.fulfilledItems = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_FULFILLMENT_COLLECTION
        );

        list.items = list.items
            .sort((a, b) => {
                if (this.sort === "price") {
                    return a.price - b.price;
                }
                return a.title.localeCompare(b.title);
            })
            .map((item) => {
                item.fulfillment = this.fulfilledItems.documents.find(
                    (fulfillment) => fulfillment.item.$id === item.$id
                );
                return item;
            });

        this.list = list;
    }
};
</script>

<style lang="scss" scoped>
main {
    .page-content {
        width: var(--section-width);
        margin: 0 auto;
        padding: 2rem 0;
        .list-header {
            padding: 1rem;
            h1 {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;

            }
            .description {
                margin-top: 1rem;
            }
        }

        .filters {
            display: flex;
            justify-content: flex-end;
        }

        .items {
            margin-top: 1rem;
            .item-price-group {
                h3 {
                    font-size: 2rem;
                    margin-top: 2rem;
                }
                hr {
                    margin: 0.5rem 0 1rem;
                }
                .item-price-group-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        .page-content {
            .list-header {
                h1 {
                    flex-direction: column;
                    align-items: start;
                }
            }
        }
    }
}
</style>