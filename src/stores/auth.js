import { defineStore } from "pinia";
import { account } from "@/appwrite";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        user: null
    }),
    actions: {
        async init() {
            try {
                this.user = await account.get();
            } catch (error) {
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
