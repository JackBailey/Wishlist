import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/dash/lists",
            name: "lists",
            component: () => import("../views/dash/lists.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/list/:id",
            name: "list",
            component: () => import("../views/list.vue")
        },
        {
            path: "/dash/login",
            name: "login",
            component: () => import("../views/dash/login.vue")
        }
    ]
});

export default router;
