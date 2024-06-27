import "./assets/main.scss";
// import "./assets/dark.css";
// import "./assets/light.css";
// import "material/typography/md-typescale-styles.js";

// import "material-symbols";

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
    router.beforeEach((to, from, next) => {
        if (to.meta.requiresAuth && !auth.isLoggedIn) {
            next({ name: "login" });
        } else {
            next();
        }
    });
    app.use(router);
    app.use(vuetify);
    app.mount("#app");
});
