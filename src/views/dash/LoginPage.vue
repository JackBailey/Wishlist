<template>
    <v-main>
        <div class="page-content">
            <h1>Log In</h1>
            <div class="password-login" v-if="methods.includes('password')">
                <v-form @submit.prevent="passwordLogin">
                    <v-text-field
                        v-model="passwordLoginDetails.email"
                        label="Email"
                        type="email"
                    />
                    <v-text-field
                        v-model="passwordLoginDetails.password"
                        label="Password"
                        type="password"
                    />
                    <v-btn
                        type="submit"
                        color="primary"
                        :loading="loadingLogin"
                    >Login</v-btn>
                </v-form>
            </div>
            <div class="buttons">
                <v-btn
                    variant="tonal"
                    :prepend-icon="methodsData[method].icon"
                    @click="methodsData[method].login()"
                    v-for="method in methods.filter((method) => method !== 'password')"
                    :key=method
                >Login with {{methodsData[method].name}}</v-btn>
            </div>
        </div>
    </v-main>
</template>

<script>
import { account } from "@/appwrite";
import { mdiGithub } from "@mdi/js";
import { OAuthProvider } from "appwrite";
import { useAuthStore } from "@/stores/auth";

export default {
    data() {
        const redirectPath = this.$route.query.redirect ? this.$route.query.redirect : "/dash/lists";
        const errorRedirect = window.location.origin + "/dash/error";
        const successRedirect =  window.location.origin + redirectPath;
        return {
            auth: useAuthStore(),
            mdiGithub,
            methods: import.meta.env.VITE_LOGIN_METHODS ? import.meta.env.VITE_LOGIN_METHODS.split(",") : [],
            redirectPath,
            successRedirect,
            passwordLoginDetails: {
                email: "",
                password: ""
            },
            methodsData: {
                github: {
                    name: "Github",
                    icon: mdiGithub,
                    login: () => {
                        account.createOAuth2Session(
                            OAuthProvider.Github,
                            successRedirect,
                            errorRedirect,
                            ["user"]
                        );
                    }
                }
            },
            loadingLogin: false
        };
    },
    methods: {
        async passwordLogin() {
            this.loadingLogin = true;
            try {
                await account.createEmailPasswordSession(
                    this.passwordLoginDetails.email,
                    this.passwordLoginDetails.password
                );
            } catch (error) {
                alert(error);

                this.loadingLogin = false;
                return;
            }

            await this.auth.init();
            this.$router.push({
                path: this.redirectPath
            });
        }
    },
    mounted() {
        if (this.auth.user) {
            account.deleteSession("current");
            this.auth.user = null;
            this.auth.init();
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
    text-align: center;
    min-width: 400px;
    width: max-content;
    margin: auto;
    .password-login {
        border-bottom: 1px solid rgba(var(--v-border-color), 0.5);
        padding-bottom: 1rem;
        width: 100%;
        form {
            button {
                width: 100%;
            }
        }
    }
    .buttons {
        width: 100%;
        button {
            width: 100%;
        }
    }
}
</style>
