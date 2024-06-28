import { account, avatars } from "@/appwrite";
import { defineStore } from "pinia";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        user: null,
        avatar: null,
        userPrefs: {
            darkMode: false,
            spoilSurprises: false
        }
    }),
    actions: {
        async init() {
            const localPrefs = localStorage.getItem("userPrefs");
            try {
                this.user = await account.get();

                if (this.user.name) this.avatar = avatars.getInitials(this.user.name);
                if (this.user.prefs) {
                    this.userPrefs = this.user.prefs;
                }
            } catch {
                this.user = null;
            }

            if (!this.user || !this.user.prefs) {
                if (localPrefs) {
                    this.userPrefs = JSON.parse(localPrefs);
                } else {
                    this.userPrefs = {
                        darkMode:
                            window.matchMedia &&
                            window.matchMedia("(prefers-color-scheme: dark)").matches,
                        spoilSurprises: false
                    };
                }
            }
        }
    },
    getters: {
        isLoggedIn() {
            return this.user !== null;
        }
    }
});
