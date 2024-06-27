<template>
    <main>
        <v-card class="list-header">
            <h1>
                {{ list.title }}
                <v-btn-group
                    base-color="primary"
                    divided
                    rounded="pill"
                    v-if="privateView"
                >
                    <CreateItem
                        :list="list"    
                        @newItem="addItem"
                    />
                    <EditList
                        :list="list"
                        @updateList="updateList"
                        variant="outlined"
                    />
                </v-btn-group>
            </h1>
            <vue-markdown
                v-if="list.description"
                :source="list.description"
                class="description user-item-markdown"
            />
        </v-card>
        <v-divider style="margin: 1rem 0;"/>
        <div class="items">
            <ListItem
                v-for="item in list.items"
                :key="item.$id"
                :item="item"
                @removeItem="removeItem(item.$id)"
                @editItem="editItem($event)"
                @fulfillItem="fulfillItem($event)"
                @unfulfillItem="unfulfillItem($event)"
            />
        </div>
    </main>
</template>

<script>
import CreateItem from "@/components/CreateItem.vue";
import { databases } from "@/appwrite";
import EditList from "@/components/EditList.vue";
import ListItem from "@/components/ListItem.vue";
import VueMarkdown from "vue-markdown-render";
export default {
    components: {
        CreateItem,
        EditList,
        ListItem,
        VueMarkdown
    },
    data() {
        return {
            list: [],
            listId: this.$route.params.id,
            newItem: {
                title: "",
                description: "",
                url: "",
                image: "",
                price: 0,
                priority: "none"
            },
            privateView: this.$route.meta?.requiresAuth || false
        };
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
        },
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
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .description {
            margin-top: 1rem;
        }
    }

    .items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
