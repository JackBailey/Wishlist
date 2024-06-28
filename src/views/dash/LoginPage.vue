<template>
    <v-main>
        <div class="page-content">
            <h1>Log In</h1>
            <p>This page requires you to be logged in</p>
            <v-btn
                variant="tonal"
                :prepend-icon="mdiGithub"
                @click="githubLogin"
            >Log In</v-btn>
        </div>
    </v-main>
</template>


<script>
import { account } from "@/appwrite";
import { mdiGithub } from "@mdi/js";
import { OAuthProvider } from "appwrite";

export default {
    data() {
        return {
            mdiGithub
        };
    },
    methods: {
        githubLogin() {
            account.createOAuth2Session(
                OAuthProvider.Github,
                this.$route.meta.requiresAuth ? window.location.href : window.location.origin + "/dash/lists",
                window.location.origin + "/dash/error",
                ["user"]
            );
        }
    }
};
</script>

<style lang="scss" scoped>
.page-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
}
</style>