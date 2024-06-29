<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-list>
                <v-list-item
                    :prepend-icon="mdiGift"
                    to="/dash/lists"
                    v-if="auth.user"
                >
                    Wishlists
                </v-list-item>
            </v-list>
        </template>

        <v-btn
            href="https://github.com/JackBailey/Wishlist"
            target="_blank"
            :icon="mdiGithub"
        />
        <v-menu :close-on-content-click="false" v-model="menu">
            <template v-slot:activator="{props}">
                <v-btn
                    :prepend-icon="mdiAccountCircle"
                    v-bind="props"
                    v-if="auth.user"
                >
                    {{ auth.user.name || auth.user.email }}
                </v-btn>
                <v-btn
                    :prepend-icon="mdiCog"
                    v-bind="props"
                    v-else
                >
                    Settings
                </v-btn>
            </template>
            <v-card>
                <v-list v-if="auth.user">
                    <v-list-item
                        :prepend-avatar="auth.user.name ? auth.avatar.href : null"
                        :subtitle="auth.user.name ? auth.user.email : null"
                        :title="auth.user.name || auth.user.email"
                    />
                </v-list>
                <v-divider v-if="auth.user" />
                <v-list>
                    <v-list-item>
                        <v-switch
                            v-model="auth.newUserPrefs.darkMode"
                            label="Dark Mode"
                            hide-details
                            inset
                            color="primary"
                        />
                    </v-list-item>
                    <v-list-item v-if="!!auth.user">
                        <v-switch
                            v-model="auth.newUserPrefs.spoilSurprises"
                            label="Spoil Surprises"
                            hide-details
                            inset
                            color="primary"
                        />
                    </v-list-item>
                </v-list>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                        @click="logIn"
                        color="primary"
                        v-if="!auth.user"
                        :loading="loadingLoginLogout"
                    > Log In</v-btn>

                    <v-btn
                        @click="logout"
                        color="error"
                        :loading="loadingLoginLogout"
                        v-else
                    >Logout</v-btn>
                    <v-btn @click="menu = false">Cancel</v-btn>
                        
                    <v-btn
                        @click="updatePrefs"
                        color="primary"
                        variant="elevated"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
        <v-progress-linear
            :active="loading"
            indeterminate
            color="primary"
            absolute
            bottom
        />
    </v-app-bar>
</template>

<script>
import { mdiAccountCircle, mdiCog, mdiGift, mdiGithub, mdiMenu } from "@mdi/js";
import { account } from "@/appwrite";
import { useAuthStore } from "@/stores/auth";
export default {
    props: {
        loading: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            mdiMenu,
            mdiAccountCircle,
            mdiCog,
            mdiGift,
            mdiGithub,
            auth: useAuthStore(),
            menu: false,
            loadingLoginLogout: false
        };
    },
    methods: {
        async updatePrefs() {
            if (this.auth.user) {
                await account.updatePrefs(this.auth.newUserPrefs);
            } else {
                localStorage.setItem("userPrefs", JSON.stringify(this.auth.newUserPrefs));
            }

            this.auth.userPrefs = { ...this.auth.newUserPrefs };

            this.menu = false;
        },
        logIn() {
            this.loadingLoginLogout = true;
            this.menu = false;
            this.$router.push({
                path: "/dash/login",
                query: {
                    redirect: this.$route.fullPath
                }
            });
            this.loadingLoginLogout = false;
        },
        async logout() {
            this.loadingLoginLogout = true;
            await account.deleteSession("current");
            this.auth.user = null;
            this.menu = false;
            await this.auth.init();
            if (this.$route.meta && this.$route.meta.requiresAuth) {
                this.logIn();
            } else {
                this.loadingLoginLogout = false;
            }
        }
    }
};
</script>