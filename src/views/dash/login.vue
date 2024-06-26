<template>
    <button @click="githubLogin">Login with GitHub</button>
</template>


<script>
import { OAuthProvider } from "appwrite";
import {account} from "@/appwrite";

export default {
    methods: {
        githubLogin() {
            account.createOAuth2Session(
                OAuthProvider.Github,
                "http://localhost:5173/dash",
                "http://localhost:5173/dash/error",
                ["user"]
            )
        }
    }
}
</script>