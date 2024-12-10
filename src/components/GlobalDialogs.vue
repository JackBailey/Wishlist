<template>
    <v-overlay
        v-for="(dialog, index) in dialogs.dialogs"
        :key="dialog.id"
        :activator="dialog.activator"
        :scrim="dialog.opaque ? 'background' : true"
        :opacity="dialog.opaque ? 1 : undefined"
        v-model="dialog.open"
    >
        <v-dialog
            v-model="dialog.open"
            :max-width="dialog.maxWidth || $vuetify.display.mobile ? '100%' : '500px'"
            :fullscreen="dialog.fullscreen !== undefined ? dialog.fullscreen : $vuetify.display.mobile ? true : false"
            hide-overlay
            :persistent="dialog.persistent"
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
                        :color="action.color || 'primary'"
                        :variant="action.variant || 'text'"
                        :to="action.to"
                    >
                        {{ action.text }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-overlay>
</template>


<script setup>
import { useDialogs } from "@/stores/dialogs";

const dialogs = useDialogs();

const actionHandler = (action, index) => {
    if (typeof action.action === "function") {
        action.action();
    }

    if (action.action === "close" || action.closeAfterAction) {
        dialogs.close(index, action.text);
    }
};

</script>