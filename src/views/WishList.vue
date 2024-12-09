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
            <template v-slot:title>
                <h1 class="mb-0">{{ list.title }}</h1>
            </template>
            <template v-slot:append>
                <ListManagementButtons
                    :list="list"
                    :currency="list.currency"
                    :quickCreateQueryURL="quickCreateURL"
                    v-if="wishlistOwner"
                    @newItem="addItem"
                    @updateList="updateList"
                />
                <v-btn
                    :prepend-icon="listSaved ? mdiStarOff : mdiStar"
                    variant="tonal"
                    rounded="pill"
                    v-if="!wishlistOwner"
                    @click="saveList"
                    :color="listSaved ? 'primary' : 'default'"
                >
                    {{ listSaved ? "Unsave" : "Save" }}
                </v-btn>
            </template>
            <v-card-text v-if="list.description">
                <vue-markdown
                    :source="list.description"
                    class="description user-item-markdown"
                />
            </v-card-text>
        </v-card>
        <div class="filters">
            <v-switch
                label="Show Fulfilled"
                v-model="showFulfilled"
                color="primary"
                inset
                v-if="!wishlistOwner"
            />
        </div>
        <v-card
            title="Try the app!"
            variant="tonal"
            class="my-5"
            v-if="pwaPromo"
        >
            <v-card-text pt="4">
                <p>
                    Add this website as an app to your home screen for a better experience.
                </p>
                <p>
                    It even allows for sharing links directly to the app to add them to your wishlist!
                </p>
            </v-card-text>
        </v-card>
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
            v-if="itemsByPriceGroups.length"
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
                color="primary"
            >
                <template
                    v-slot:text
                    v-if="list.items.length"
                >
                    Items exist on this list, but they've all been fulfilled. Lucky them!
                </template>
                <template
                    v-slot:text
                    v-else
                >
                    No items currently exist in this list.
                    <template v-if="wishlistOwner"> Add some! </template>
                </template>
            </v-alert>
        </div>
    </div>
</template>

<script>
import { account, databases } from "@/appwrite";
import { mdiInformation, mdiShare, mdiStar, mdiStarOff } from "@mdi/js";
import ListItem from "@/components/ListItem.vue";
import ListManagementButtons from "@/components/dialogs/ListManagementButtons.vue";
import { Query } from "appwrite";
import { useAuthStore } from "@/stores/auth";
import { useCurrencyStore } from "@/stores/currency";
import { useDialogs } from "@/stores/dialogs";
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
            fulfillments: [],
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
            quickCreateURL: this.$route.query.quickcreateurl,
            pwaPromo: false,
            mdiStar,
            mdiStarOff,
            dialogs: useDialogs()
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
            if (!this.list || this.list.items.length === 0) return [];

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
                                if (!this.showFulfilled && !this.wishlistOwner && item.fulfillment)
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
        },
        listSaved() {
            if (!this.auth.userPrefs.savedLists) return false;
            return this.auth.userPrefs.savedLists.includes(this.list.$id);
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
        },
        async saveList() {
            if (!this.auth.user) {
                this.dialogs.create({
                    title: "Log In Required",
                    text: "Log In to save this list for later, as well as to create your own lists!",
                    variant: "info",
                    actions: [
                        {
                            text: "Log In",
                            action: "close",
                            color: "primary",
                            to: "/dash/login?redirect=" + encodeURIComponent(this.$route.fullPath)
                        },
                        {
                            text: "Cancel",
                            action: "close",
                            color: "default"
                        }
                    ]
                });
                return;
            }
            if (this.auth.userPrefs.savedLists && this.auth.userPrefs.savedLists.includes(this.list.$id)) {
                this.auth.newUserPrefs.savedLists = this.auth.newUserPrefs.savedLists.filter((listId) => listId !== this.list.$id);
                try {
                    const accountResp = await account.updatePrefs(this.auth.newUserPrefs);
                    this.auth.userPrefs = accountResp.prefs;
                } catch (error) {
                    this.dialogs.create({
                        title: "Error",
                        text: "An error occurred while trying to unsave this list. Please try again later. " + error.message,
                        variant: "error",
                        actions: [
                            {
                                text: "OK",
                                action: "close",
                                color: "primary"
                            }
                        ]
                    });
                }
            } else {
                this.auth.newUserPrefs.savedLists = [...this.auth.newUserPrefs.savedLists, this.list.$id];
                try {
                    const accountResp = await account.updatePrefs(this.auth.newUserPrefs);
                    this.auth.userPrefs = accountResp.prefs;
                } catch (error) {
                    this.dialogs.create({
                        title: "Error",
                        text: "An error occurred while trying to save this list. Please try again later. " + error.message,
                        variant: "error",
                        actions: [
                            {
                                text: "OK",
                                action: "close",
                                color: "primary"
                            }
                        ]
                    });
                }
            }   
        },
        async createAvoidSpoilersDialog(list) {
            if (!this.auth.user && this.auth.previouslyLoggedInUserID && list.author === this.auth.previouslyLoggedInUserID) {
                const dialogResponse = await this.dialogs.create({
                    title: "Warning",
                    text: "It appears you may have created this list. Would you like to log in, to avoid spoilers?",
                    variant: "warning",
                    opaque: true,
                    persistent: true,
                    async: true,
                    actions: [
                        {
                            text: "Continue Anyway",
                            action: () => {
                                this.auth.removePreviouslyLoggedInUserID();
                            },
                            closeAfterAction: true,
                            color: "error",
                            variant: "text"
                        },
                        {
                            text: "Log In",
                            to: "/dash/login?redirect=" + encodeURIComponent(this.$route.fullPath),
                            closeAfterAction: true,
                            color: "primary",
                            variant: "elevated"
                        }
                    ]
                });

                return dialogResponse === "No";
            }
        }
    },
    watch: {
        showFulfilled(val) {
            localStorage.setItem("showFulfilled", val);
        },
        
    },
    async mounted() {
        try {
            let list = await databases.getDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                this.listId
            );

            let loadedAsAuthor = this.auth.user && list.author === this.auth.user.$id;

            const redirectingToLoginPage = await this.createAvoidSpoilersDialog(list);

            if (redirectingToLoginPage) return;

            window.document.title = list.title + " - Readyto.gift";
            
            this.fulfillments = [];

            if (list.items.length) {
                this.fulfillments = (await databases.listDocuments(
                    import.meta.env.VITE_APPWRITE_DB,
                    import.meta.env.VITE_APPWRITE_FULFILLMENT_COLLECTION,
                    [
                        Query.equal("item", list.items.map((item) => item.$id))
                    ]
                )).documents;
            }

            list.items = list.items
                .sort((a, b) => {
                    if (this.sort === "price") {
                        return a.price - b.price;
                    }
                    return a.title.localeCompare(b.title);
                })
                .map((item) => {
                    item.fulfillment = this.fulfillments.find(
                        (fulfillment) => {
                            return fulfillment.item.$id === item.$id;
                        }
                    );

                    return item;
                });
    
            this.list = list;
            window.addEventListener("appinstalled", () => {
                this.pwaPromo = false;
            });

            this.auth.$subscribe((mutation, state) => {
                if (!state.user && loadedAsAuthor) {
                    this.createAvoidSpoilersDialog(this.list);
                    loadedAsAuthor = false;
                }
            });
        } catch (error) {
            this.dialogs.create({
                title: "Error",
                text: "An error occurred while trying to load this list. Please try again later. " + error.message,
                variant: "error",
                actions: [
                    {
                        text: "OK",
                        action: "close",
                        color: "primary"
                    }
                ]
            });
        }
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
                word-break: break-word;
                white-space: pre-wrap;
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