<template>
    <v-app :theme="auth.userPrefs.darkMode ? 'dark' : 'light'">
        <DashNav :loading="loading" />
        <RouterView v-if="!loading && (auth.user || $route.meta.requiresAuth !== true)" />
        <LoginPage v-else-if="!loading" />
    </v-app>
</template>

<script>
import DashNav from "@/components/DashNav.vue";
import LoginPage from "@/views/dash/LoginPage.vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCurrencyStore } from "@/stores/currency";
export default {
    components: {
        DashNav,
        RouterView,
        LoginPage
    },
    data() {
        return {
            auth: useAuthStore(),
            currencyStore: useCurrencyStore(),
            loading: true
        };
    },
    async mounted() {
        await this.auth.init();
        await this.currencyStore.init();
        this.loading = false;
    }
};
</script>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
