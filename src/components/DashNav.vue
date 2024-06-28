<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-list>
                <v-list-item
                    :prepend-icon="mdiGift"
                    href="https://github.com/JackBailey/Wishlist"
                    target="_blank"
                >
                    Wishlist
                </v-list-item>
            </v-list>
        </template>

        <v-btn to="/dash/lists" v-if="auth.user">Wishlists</v-btn>
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
                        :prepend-avatar="auth.avatar.href"
                        :subtitle="auth.user.name ? auth.user.email : false"
                        :title="auth.user.name || auth.user.email"
                    />
                </v-list>
                <v-divider v-if="auth.user" />
                <v-list>
                    <v-list-item>
                        <v-switch
                            v-model="userPrefs.darkMode"
                            label="Dark Mode"
                            hide-details
                            inset
                            color="primary"
                        />
                    </v-list-item>
                    <v-list-item v-if="!!auth.user">
                        <v-switch
                            v-model="userPrefs.spoilSurprises"
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
                    > Log In</v-btn>

                    <v-btn
                        @click="logout"
                        color="error"
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
    </v-app-bar>
</template>

<script>
import { mdiAccountCircle, mdiCog, mdiGift, mdiMenu } from "@mdi/js";
import { account } from "@/appwrite";
import { OAuthProvider } from "appwrite";
import { useAuthStore } from "@/stores/auth";
export default {
    data() {
        return {
            mdiMenu,
            mdiAccountCircle,
            mdiCog,
            mdiGift,
            auth: useAuthStore(),
            menu: false,
            userPrefs: {
                darkMode: false,
                spoilSurprises: false
            }
        };
    },
    methods: {
        async updatePrefs() {
            if (this.auth.user) {
                await account.updatePrefs(this.userPrefs);
            } else {
                localStorage.setItem("userPrefs", JSON.stringify(this.userPrefs));
            }

            this.auth.userPrefs = { ...this.userPrefs };

            this.menu = false;
        },
        logIn() {
            this.menu = false;
            account.createOAuth2Session(
                OAuthProvider.Github,
                window.location.href,
                "http://localhost:5173/dash/error",
                ["user"]
            );
        },
        logout() {
            account.deleteSession("current");
            this.auth.user = null;
        }
    },
    mounted() {
        this.userPrefs = { ...this.auth.userPrefs };
    }
};
</script>