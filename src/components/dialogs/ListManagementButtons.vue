<template>
    <v-btn-group
        base-color="primary"
        divided
        rounded="pill"
        density="comfortable"
        size="small"
        :class="props.class"
    >
        <ModifyItem
            :list="list"
            :variant="variant"
            :currency="currency"
            :quickCreateURL="quickCreateURL"
            @unsetQuickCreateURL="resetQuickCreateURL"
            @newItem="(data) => $emit('newItem', data)"
            v-if="wishlistOwner"
        />

        <v-btn
            size="small"
            icon
            variant="outlined"
            v-if="wishlistOwner"
        >
            <v-icon :icon="mdiMenuDown" />

            <v-menu
                activator="parent"
                location="bottom end"
                transition="fade-transition"
            >
                <v-list
                    density="compact"
                    min-width="250"
                    rounded="lg"
                    slim
                >
                    <EditList
                        :list="list"
                        @updateList="$emit('updateList', $event)"
                    />
                    <DeleteList :list="list" />
                </v-list>
            </v-menu>
        </v-btn>

        <v-dialog
            :max-width="$vuetify.display.mobile ? '100%' : '500px'"
            v-model="quickcreateDialogOpen"
            v-if="wishlistOwner"
        >
            <template v-slot:activator>
                <v-btn
                    :icon="mdiClipboard"
                    variant="outlined"
                    @click="quickCreate"
                    v-if="$vuetify.display.mobile"
                />
                <v-btn
                    :prepend-icon="mdiClipboard"
                    variant="outlined"
                    @click="quickCreate"
                    v-else
                > 
                    <template v-if="!$vuetify.display.mobile">
                        Quickcreate
                    </template>
                </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card :title="quickCreateError.title">
                    <v-card-text>
                        {{ quickCreateError.text }}
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            text="OK"
                            @click="isActive.value = false"
                        />
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>

        <v-btn
            variant="outlined"
            :icon="mdiShare"
            @click="copyListURL"
            v-if="$vuetify.display.mobile && wishlistOwner"
        />

        <v-btn
            variant="outlined"
            :prepend-icon="mdiShare"
            @click="copyListURL"
            v-else
        >
            Share
        </v-btn>

        <v-btn
            :prepend-icon="listSaved ? mdiStarOff : mdiStar"
            :variant="listSaved ? 'tonal' : 'outlined'"
            v-if="!wishlistOwner"
            @click="saveList"
            :loading="listSaveLoading"
        >
            {{ listSaved ? "Unsave" : "Save" }}
        </v-btn>

        <v-snackbar
            v-model="shareButtonSnackbarOpen"
            :timeout="2000"
            color="primary"
            rounded="pill"
            timer
            text="Link copied to clipboard"
        />
    </v-btn-group>
</template>

<script setup>
import { mdiClipboard, mdiMenuDown, mdiShare, mdiStar, mdiStarOff } from "@mdi/js";
import { useRoute, useRouter } from "vue-router";
import { account } from "@/appwrite";
import DeleteList from "./DeleteList.vue";
import EditList from "./EditList.vue";
import ModifyItem from "./ModifyItem.vue";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useDialogs } from "@/stores/dialogs";
import validation from "@/utils/validation";

const auth = useAuthStore();
const dialogs = useDialogs();

const shareButtonSnackbarOpen = ref(false);

defineEmits(["newItem", "updateList"]);

const props = defineProps({
    list: {
        type: Object,
        default: () => ({})
    },
    variant: {
        type: String,
        default: "elevated"
    },
    currency: {
        type: String,
        required: true
    },
    quickCreateQueryURL: {
        type: String,
        default: ""
    },
    class: {
        type: String,
        default: ""
    },
    wishlistOwner: {
        type: Boolean,
        default: false
    },
    listSaved: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();
const route = useRoute();

let quickCreateURL = ref("");
let quickCreateError = ref({
    title: "",
    text: ""
});

let quickcreateDialogOpen = ref(false);
let listSaveLoading = ref(false);


const copyListURL = () => {
    const listURL = `${window.location.origin}/${props.list.shortUrl ? props.list.shortUrl : "list/" + props.list.$id}`;
    navigator.clipboard.writeText(listURL);
    shareButtonSnackbarOpen.value = true;
};

const saveList = async () => {
    listSaveLoading.value = true;
    if (!auth.user) {
        listSaveLoading.value = false;
        dialogs.create({
            title: "Log In Required",
            text: "Log In to save this list for later, as well as to create your own lists!",
            variant: "info",
            actions: [
                {
                    text: "Log In",
                    action: "close",
                    color: "primary",
                    to: "/dash/login?redirect=" + encodeURIComponent(route.fullPath)
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
    if (auth.userPrefs.savedLists && auth.userPrefs.savedLists.includes(props.list.$id)) {
        auth.newUserPrefs.savedLists = auth.newUserPrefs.savedLists.filter((listId) => listId !== props.list.$id);
        try {
            const accountResp = await account.updatePrefs(auth.newUserPrefs);
            auth.userPrefs = accountResp.prefs;
            listSaveLoading.value = false;
        } catch (error) {
            listSaveLoading.value = false;
            dialogs.create({
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
        auth.newUserPrefs.savedLists = [...auth.newUserPrefs.savedLists, props.list.$id];
        try {
            const accountResp = await account.updatePrefs(auth.newUserPrefs);
            auth.userPrefs = accountResp.prefs;
            listSaveLoading.value = false;
        } catch (error) {
            listSaveLoading.value = false;
            dialogs.create({
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
};

const quickCreate = async () => {
    const result = await navigator.permissions.query({ name: "clipboard-read" });
    if (result.state !== "denied") {
        const clipboardContents = await navigator.clipboard.readText();

        const validURLs = clipboardContents.match(validation.urlRegexGlobal);

        if (!validURLs || validURLs.length === 0) {
            quickCreateError.value = {
                title: "Invalid URL",
                text: "The clipboard does not contain any valid URLs."
            };
            quickcreateDialogOpen.value = true;
        } else {
            quickCreateURL.value = validURLs[0];
        }
    } else {
        quickCreateError.value = {
            title: "Error",
            text: "Clipboard read permission denied"
        };
        quickcreateDialogOpen.value = true;
    }
};

const resetQuickCreateURL = () => {
    quickCreateURL.value = "";
    if (route.query.quickcreateurl) {
        const { quickcreateurl, ...remainingQueries } = route.query;
        router.replace({ query: remainingQueries });
    }
};

if (props.quickCreateQueryURL) {
    quickCreateURL.value = props.quickCreateQueryURL;
}
</script>
