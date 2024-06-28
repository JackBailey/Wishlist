import "./assets/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

import App from "./App.vue";
import router from "./router";

import vuetify from "../plugins/vuetify";

const app = createApp(App);
app.use(createPinia());

const auth = useAuthStore();

auth.init().then(() => {
    app.use(router);
    app.use(vuetify);
    app.mount("#app");
});
