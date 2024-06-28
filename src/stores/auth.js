import { account } from "@/appwrite";
import { defineStore } from "pinia";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        user: null
    }),
    actions: {
        async init() {
            try {
                this.user = await account.get();
            } catch {
                this.user = null;
            }
        }
    },
    getters: {
        isLoggedIn() {
            return this.user !== null;
        }
    }
});
