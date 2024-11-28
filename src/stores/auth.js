import { account, avatars } from "@/appwrite";
import { defineStore } from "pinia";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        user: null,
        avatar: null,
        userPrefs: {
            darkMode: false,
            spoilSurprises: false,
            savedLists: []
        },
        newUserPrefs: {
            darkMode: false,
            spoilSurprises: false,
            savedLists: []
        }
    }),
    actions: {
        async init() {
            try {
                this.user = await account.get();

                if (this.user.name) this.avatar = avatars.getInitials(this.user.name);
                if (this.user.prefs) {
                    this.userPrefs = this.user.prefs;
                }
            } catch {
                this.user = null;
                const localPrefs = localStorage.getItem("userPrefs");
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

            this.newUserPrefs = { ...this.newUserPrefs, ...this.userPrefs };
        }
    },
    getters: {
        isLoggedIn() {
            return this.user !== null;
        }
    }
});
