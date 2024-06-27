<template>
    <main>
        <p>hi</p>
        <v-icon :icon="mdiPlus"/>
    </main>
</template>

<script>
import { mdiPlus } from "@mdi/js";
export default {
    data() {
        return {
            mdiPlus
        };
    }
}
</script>