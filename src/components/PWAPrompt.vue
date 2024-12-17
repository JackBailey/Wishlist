<template>
    <v-card
        title="Try the app!"
        variant="tonal"
        v-if="pwa.deferredPrompt && auth.userPrefs.hidePWAInstallPrompt !== true"
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
                    @click="dismiss"
                >
                    Dismiss forever
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useDialogs } from "@/stores/dialogs";
import { usePWA } from "@/stores/pwa";

const auth = useAuthStore();
const dialogs = useDialogs();
const pwa = usePWA();

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

const dismiss = async () => {
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
        text: "The PWA install prompt will no longer show. You can still install the app from your browser's menu.",
        title: "Prompt dismissed"
    });
};
</script>