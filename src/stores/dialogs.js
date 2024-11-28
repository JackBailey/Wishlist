import { defineStore } from "pinia";

export const useDialogs = defineStore({
    id: "dialogs",
    state: () => ({
        dialogs: []
    }),
    actions: {
        create(dialog) {
            this.dialogs.push({ open: true, ...dialog });
        },
        close(index) {
            this.dialogs[index].open = false;
        }
    }
});
