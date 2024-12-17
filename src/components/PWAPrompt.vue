<template>
    <v-card
        title="Try the app!"
        variant="tonal"
        v-if="!locallyDismissed && pwa.deferredPrompt && auth.userPrefs.hidePWAInstallPrompt !== true"
    >
        <v-card-text pt="4">
            <p>
                Add this website as an app to your home screen for a better experience.
            </p>
            <p>
                It even allows for sharing links directly to the app to add them to your wishlist!
            </p>
            <div
                class="buttons mt-5 d-flex flex-wrap ga-3"
            >
                <v-btn
                    variant="elevated"
                    color="primary"
                    ref="pwaPromptButton"
                    @click="installPWA"
                >
                    Install
                </v-btn>
                <v-btn
                    variant="tonal"
                    :append-icon="mdiMenuDown"
                    v-bind="menuOpen"
                >
                    Dismiss

                    <v-menu
                        activator="parent"
                        location="bottom start"
                        transition="fade-transition"
                        v-model="menuOpen"
                    >
                        <v-list
                            density="compact"
                            rounded="lg"
                            slim
                        >
                            <v-list-item @click="dismissForDevice">
                                For this device
                            </v-list-item>
                            <v-list-item @click="dismissForever">
                                For all devices
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { mdiMenuDown } from "@mdi/js";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useDialogs } from "@/stores/dialogs";
import { usePWA } from "@/stores/pwa";

const auth = useAuthStore();
const dialogs = useDialogs();
const pwa = usePWA();

let locallyDismissed = ref(localStorage.getItem("hidePWAInstallPrompt") === "true");
let menuOpen = ref(false);

const installPWA = () => {
    console.log("installing PWA");
    pwa.deferredPrompt.prompt();
    pwa.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
            pwa.setAppInstalled(true);
        }
        pwa.setDeferredPrompt(null);
    });
};

const dismissForever = async () => {
    auth.userPrefs.hidePWAInstallPrompt = true;
    await auth.updatePrefs(auth.userPrefs);
    dialogs.create({
        actions: [
            {
                action: "close",
                color: "primary",
                text: "OK"
            }
        ],
        text: "The PWA install prompt will no longer show for this account. You can still install the app from your browser's menu.",
        title: "Prompt dismissed"
    });
    menuOpen.value = false;
};

const dismissForDevice = () => {
    localStorage.setItem("hidePWAInstallPrompt", true);
    locallyDismissed.value = true;
    dialogs.create({
        actions: [
            {
                action: "close",
                color: "primary",
                text: "OK"
            }
        ],
        text: "The PWA install prompt will no longer show for this device. You can still install the app from your browser's menu.",
        title: "Prompt dismissed"
    });
    menuOpen.value = false;
};
</script>