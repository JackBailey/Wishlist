import "./assets/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

import App from "./App.vue";
import router from "./router";

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
    app.mount("#app");
});
