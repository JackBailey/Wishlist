import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            redirect: () => {
                return { name: "lists" };
            }
        },
        {
            path: "/dash/lists",
            name: "lists",
            component: () => import("@/views/dash/UserLists.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/dash/list/:id",
            name: "dashlist",
            component: () => import("@/views/WishList.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/list/:id",
            name: "list",
            component: () => import("@/views/WishList.vue")
        },
        {
            path: "/dash/login",
            name: "login",
            component: () => import("@/views/dash/LoginPage.vue")
        },
        {
            path: "/dash/error",
            name: "error",
            component: () => import("@/views/dash/ErrorPage.vue")
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    await authStore.init();
    if (to.meta && to.meta.requiresAuth) {
        if (!authStore.isLoggedIn) {
            next({ name: "login", query: { redirect: to.fullPath } });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
