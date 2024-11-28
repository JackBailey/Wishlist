<template>
    <v-dialog
        v-for="(dialog, index) in dialogs.dialogs"
        :key="dialog.id"
        v-model="dialog.open"
        :max-width="dialog.maxWidth || $vuetify.display.mobile ? '100%' : '500px'"
    >
        <v-card :title="dialog.title">
            <v-card-text>
                {{ dialog.text }}
            </v-card-text>
            <v-card-actions>
                <v-btn
                    v-for="action in dialog.actions"
                    :key="action.text"
                    @click="actionHandler(action, index)"
                >
                    {{ action.text }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script setup>
import { useDialogs } from "@/stores/dialogs";

const dialogs = useDialogs();

const actionHandler = (action, index) => {
    if (action.action === "close") {
        dialogs.close(index);
    } else {
        action.action();
    }
};

</script>