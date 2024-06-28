<template>
    <v-main>
        <p>hi</p>
        <v-icon :icon="mdiPlus"/>
    </v-main>
</template>

<script>
import { mdiPlus } from "@mdi/js";
export default {
    data() {
        return {
            mdiPlus
        };
    }
};
</script>