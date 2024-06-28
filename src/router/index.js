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
            component: () => import("../views/dash/UserLists.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/dash/list/:id",
            name: "dashlist",
            component: () => import("../views/WishList.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/list/:id",
            name: "list",
            component: () => import("../views/WishList.vue")
        },
        {
            path: "/dash/login",
            name: "login",
            component: () => import("../views/dash/LoginPage.vue")
        }
    ]
});

export default router;
