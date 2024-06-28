<template>
    <button @click="githubLogin">Login with GitHub</button>
</template>


<script>
import { account } from "@/appwrite";
import { OAuthProvider } from "appwrite";

export default {
    methods: {
        githubLogin() {
            account.createOAuth2Session(
                OAuthProvider.Github,
                "http://localhost:5173/dash",
                "http://localhost:5173/dash/error",
                ["user"]
            );
        }
    }
};
</script>