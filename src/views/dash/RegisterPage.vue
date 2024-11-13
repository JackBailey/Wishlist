<template>
    <div class="page-content">
        <h1>Register</h1>
        <div class="password-register">
            <v-form @submit.prevent="register">
                <v-text-field
                    v-model="registrationDetails.name"
                    label="Name"
                    type="text"
                    autofocus
                />
                <v-text-field
                    v-model="registrationDetails.email"
                    label="Email"
                    type="email"
                />
                <v-text-field
                    v-model="registrationDetails.password"
                    label="Password"
                    type="password"
                />
                <v-text-field
                    v-model="registrationDetails.passwordConfirmation"
                    label="Password Confirmation"
                    type="password"
                />
                <v-btn
                    type="submit"
                    color="primary"
                    :loading="loadingRegistration"
                >Register</v-btn>
            </v-form>
            <v-alert
                :type="alert.type || 'error'"
                border="left"
                elevation="2"
                v-if="alert"
                :icon="alert.icon || mdiAlert"
                :title="alert.title"
                :text="alert.text"
                class="mt-4"
            />
        </div>
        <p>
            Already have an account?
            <router-link :to="`/dash/login?redirect=${redirectPath}`">Login here</router-link>
        </p>
    </div>
</template>

<script>
import { mdiAlert, mdiInformation } from "@mdi/js";
import { account } from "@/appwrite";
import { ID } from "appwrite";
import { useAuthStore } from "@/stores/auth";

export default {
    data() {
        const redirectPath = this.$route.query.redirect
            ? this.$route.query.redirect
            : "/dash/lists";
        const successRedirect = window.location.origin + redirectPath;
        return {
            auth: useAuthStore(),
            mdiAlert,
            redirectPath,
            successRedirect,
            registrationDetails: {
                email: "",
                password: ""
            },
            loadingRegistration: false,
            alert: false
        };
    },
    methods: {
        async register() {
            this.alert = false;
            if (!this.registrationDetails.name) {
                this.alert = {
                    title: "Error",
                    message: "Please enter a name."
                };
                return;
            }

            if (!this.registrationDetails.email) {
                this.alert = {
                    title: "Error",
                    message: "Please enter an email address."
                };
                return;
            }

            if (!this.registrationDetails.password) {
                this.alert = {
                    title: "Error",
                    message: "Please enter a password."
                };
                return;
            }

            if (
                this.registrationDetails.password !== this.registrationDetails.passwordConfirmation
            ) {
                this.alert = {
                    title: "Error",
                    message: "Passwords do not match."
                };
                return;
            }

            this.loadingRegistration = true;
            try {
                const accResp = await account.create(
                    ID.unique(),
                    this.registrationDetails.email.trim(),
                    this.registrationDetails.password.trim(),
                    this.registrationDetails.name.trim()
                );

                if (accResp.status === true) {
                    this.alert = {
                        title: "Success",
                        text: "Account created successfully, redirecting you to the login page.",
                        type: "success",
                        icon: mdiInformation
                    };

                    this.loadingRegistration = false;

                    setTimeout(() => {
                        this.$router.push({
                            path: `/dash/login?redirect=${this.redirectPath}`
                        });
                    }, 2000);
                }
            } catch (error) {
                this.alert = {
                    title: "Error",
                    text: error.message
                };

                this.loadingRegistration = false;
                return;
            }
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
    width: 400px;
    max-width: 90%;
    margin: auto;
    .password-register {
        width: 100%;
        form {
            button {
                width: 100%;
            }
        }
    }
    hr {
        width: 100%;
    }
    .buttons {
        width: 100%;
        button {
            width: 100%;
        }
    }
}
</style>
