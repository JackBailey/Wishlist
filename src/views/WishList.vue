<template>
    <v-main v-if="!list">
        <div class="page-content">
            <v-skeleton-loader type="card" />
            <v-skeleton-loader type="card" />
            <v-skeleton-loader type="card" />
        </div>
    </v-main>
    <v-main v-else>
        <div class="page-content">
            <v-card class="list-header" variant="tonal">
                <h1>
                    {{ list.title }}
                    <v-btn-group
                        base-color="primary"
                        divided
                        rounded="pill"
                        v-if="wishlistOwner"
                    >
                        <CreateItem :list="list" @newItem="addItem" />
                        <EditList
                            :list="list"
                            @updateList="updateList"
                            variant="outlined"
                        />
                        <DeleteList :list="list" variant="outlined" />
                    </v-btn-group>
                </h1>
                <vue-markdown
                    v-if="list.description"
                    :source="list.description"
                    class="description user-item-markdown"
                />
            </v-card>
            <v-alert
                v-if="!wishlistOwner"
                type="info"
                :icon="mdiInformation"
                elevation="2"
                class="mt-5"
                text="Make sure to mark anything as Fulfilled if you've purchased or plan on purchasing any of the items on the list!"
                color="primary"
            />
            <div class="items" v-if="list.items.length">
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
            <div class="no-items" v-else>
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
    </v-main>
</template>

<script>
import CreateItem from "@/components/dialogs/CreateItem.vue";
import { databases } from "@/appwrite";
import DeleteList from "@/components/dialogs/DeleteList.vue";
import EditList from "@/components/dialogs/EditList.vue";
import ListItem from "@/components/ListItem.vue";
import { mdiInformation } from "@mdi/js";
import { useAuthStore } from "@/stores/auth";
import { useCurrencyStore } from "@/stores/currency";
import VueMarkdown from "vue-markdown-render";
export default {
    components: {
        CreateItem,
        EditList,
        DeleteList,
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
            priceGroups: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
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
                            this.currency.formatter(this.list.currency).format(lowerBound).split(".")[0] +
                            " - " +
                            this.currency.formatter(this.list.currency).format(upperBound).split(".")[0],
                        items: this.list.items
                            .filter((item) => {
                                if (item.price >= lowerBound && item.price < upperBound) {
                                    return item;
                                }
                            })
                            .sort((a, b) => {
                                if (!this.wishlistOwner) {
                                    if (a.fulfillment && !b.fulfillment) return 1;
                                    if (!a.fulfillment && b.fulfillment) return -1;
                                }

                                return true;
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
        },
        addItem(data) {
            this.list.items.push(data.item);
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
                gap: 1rem;
            }
            .description {
                margin-top: 1rem;
            }
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

    @media screen and (max-width: 768px){
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
