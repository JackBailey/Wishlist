<template>
    <v-card
        :href=" header ? false : `/list/${props.list.$id}${quickCreateURL && ownList ? `?quickcreateurl=${props.quickCreateURL}` : ''}`"
        :title="props.list.title"
        variant="tonal"
        class="mb-4"
    >
        <template v-slot:title>
            <h1 v-if="props.header">{{ props.list.title }}</h1>
            <h3 v-else>{{ props.list.title }}</h3>
        </template>
        <template
            v-slot:subtitle
        >
            <template v-if="!props.ownList">
                <img
                    :src="userAvatar(list.authorName)"
                    alt=""
                    class="avatar"
                />
                Made by {{ list.authorName }}
                |</template>
            Updated: {{ new Date(list.$updatedAt).toLocaleString() }}
        </template>

        <template v-slot:append>
            <ListManagementButtons
                :list="props.list"
                :currency="list.currency"
                :quickCreateQueryURL="props.quickCreateURL"
                :wishlistOwner="ownList"
                :listSaved="props.listSaved"
                @newItem="addItem"
                @updateList="updateList"
                v-if="header && !$vuetify.display.mobile"
            />
        </template>

        <v-card-text v-if="header">
            <VueMarkdown
                v-if="props.list.description"
                :source="props.list.description"
                class="description user-item-markdown mb-4"
            />
            <div class="mobile-list-buttons">
                <ListManagementButtons
                    :list="props.list"
                    :currency="list.currency"
                    :quickCreateQueryURL="props.quickCreateURL"
                    :wishlistOwner="ownList"
                    :listSaved="props.listSaved"
                    @newItem="addItem"
                    @updateList="updateList"
                    v-if="header && $vuetify.display.mobile"
                />
            </div>
        </v-card-text>

    </v-card>
</template>

<script setup>
import { avatars } from "@/appwrite";
import { defineProps } from "vue";
import ListManagementButtons from "@/components/dialogs/ListManagementButtons.vue";
import VueMarkdown from "vue-markdown-render";

const props = defineProps({
    buttonProps: {
        default: () => ({}),
        type: Object
    },
    header: {
        default: false,
        type: Boolean
    },
    list: {
        required: true,
        type: Object
    },
    listSaved: {
        default: false,
        type: Boolean
    },
    ownList: {
        default: false,
        type: Boolean
    },
    quickCreateURL: {
        default: null,
        type: [String, Boolean]
    }
});

const plugins = [
    (tokens, idx, options, env, self) => {
        tokens[idx].attrSet("target", "_blank");

        // Pass the token to the default renderer.
        return defaultRender(tokens, idx, options, env, self);
    }
];

const markdownOptions = {
    
};

const userAvatar = (name) => {
    return avatars.getInitials(name, 24, 24);
};
</script>

<style lang="scss" scoped>
:deep(.v-card-title) {
    h1, h3 {
        word-break: break-word;
        white-space: pre-wrap;
    }
}
:deep(.v-card-subtitle) {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    .avatar {
        display: block;
        border-radius: 50%;
        box-sizing: border-box;
    }
    word-break: break-word;
    white-space: pre-wrap;
}

.mobile-list-buttons {
    text-align: center;
}
</style>