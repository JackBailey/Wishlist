<template>
    <v-app :theme="auth.userPrefs.darkMode ? 'dark' : 'light'">
        <DashNav :loading="loading" />
        <v-main>
            <RouterView v-if="!loading" />
            <SiteFooter />
        </v-main>
    </v-app>
</template>

<script>
import DashNav from "@/components/DashNav.vue";
import { RouterView } from "vue-router";
import SiteFooter from "./components/SiteFooter.vue";
import { useAuthStore } from "@/stores/auth";
import { useCurrencyStore } from "@/stores/currency";
export default {
    components: {
        DashNav,
        RouterView,
        SiteFooter
    },
    data() {
        return {
            auth: useAuthStore(),
            currencyStore: useCurrencyStore(),
            loading: true
        };
    },
    async mounted() {
        await this.currencyStore.init();
        this.loading = false;

        const {
            VITE_UMAMI_URL: umamiURL,
            VITE_UMAMI_ID: umamiID,
            VITE_UMAMI_DOMAINS: umamiDomains
        } = import.meta.env;

        if (umamiURL && umamiID) {
            const script = document.createElement("script");
            script.src = `${umamiURL}`;
            script.setAttribute("data-website-id", umamiID);
            if (umamiDomains) {
                script.setAttribute("data-domains", umamiDomains);
            }
            document.head.appendChild(script);
        }
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

.v-main {
    display: flex;
    flex-direction: column;
}

.page-content {
    height: 100%;
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
