import { account, avatars } from "@/appwrite";
import { defineStore } from "pinia";
import { setUser as setSentryUser } from "@sentry/vue";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        user: null,
        avatar: null,
        previouslyLoggedInUserID: localStorage.getItem("previouslyLoggedInUserID"),
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
                try {
                    this.user = await account.get();
                } catch (error) {
                    if (error.type !== "general_unauthorized_scope") {
                        throw error;
                    }
                }

                if (this.user) {
                    localStorage.setItem("previouslyLoggedInUserID", this.user.$id);
                    if (import.meta.env.VITE_SENTRY_DSN) {
                        setSentryUser({
                            id: this.user.$id,
                            username: this.user.name,
                            email: this.user.email
                        });
                    }
                } else {
                    if (import.meta.env.VITE_SENTRY_DSN) {
                        setSentryUser(null);
                    }
                }

                if (this.user.name) this.avatar = avatars.getInitials(this.user.name);
                if (this.user.prefs) {
                    this.userPrefs = this.user.prefs;
                }
            } catch {
                if (import.meta.env.VITE_SENTRY_DSN) {
                    setSentryUser(null);
                }
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
        },
        removePreviouslyLoggedInUserID() {
            localStorage.removeItem("previouslyLoggedInUserID");
            this.previouslyLoggedInUserID = null;
        },
        setPreviouslyLoggedInUserID(userID) {
            localStorage.setItem("previouslyLoggedInUserID", userID);
            this.previouslyLoggedInUserID = userID;
        }
    },
    getters: {
        isLoggedIn() {
            return this.user !== null;
        }
    }
});
