<template>
    <div class="page-content">
        <h1>Verify</h1>
        <div class="verify">
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
    </div>
</template>

<script>
import { mdiAlert, mdiInformation } from "@mdi/js";
import { account } from "@/appwrite";
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
            loadingVerification: false,
            alert: false
        };
    },
    methods: {
        async verify() {
            this.loadingVerification = true;
            this.alert = false;

            const { userId, secret } = this.$route.query;

            try {
                await account.updateVerification(userId, secret);

                this.alert = {
                    title: "Success",
                    text: "Account successfully verified, redirecting you to the main page.",
                    type: "success",
                    icon: mdiInformation
                };

                await this.auth.init();

                setTimeout(() => {
                    this.$router.push({
                        path: "/dash/lists"
                    });
                }, 2000);
            } catch (error) {
                this.alert = {
                    title: "Error",
                    text: error.message
                };
            }

            this.loadingVerification = false;
        }
    },
    mounted() {
        this.verify();
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
    .verify {
        width: 100%;
    }
    hr {
        width: 100%;
    }
}
</style>
