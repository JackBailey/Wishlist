<template>
    <div
        class="page-content"
        v-if="notFound"
    >
        <h1>404</h1>
        <p>Page not found</p>
        <v-btn to="/">Go Home</v-btn>
    </div>
    <div
        class="page-content"
        v-else
    >
        <v-progress-circular
            indeterminate
            size="64"
        />
    </div>
</template>

<script>
import { databases } from "@/appwrite";
import { Query } from "appwrite";
export default {
    data() {
        return {
            notFound: false
        };
    },
    async mounted() {
        if (this.$route.params.id) {
            try {
                const document = await databases.listDocuments(
                    import.meta.env.VITE_APPWRITE_DB,
                    import.meta.env.VITE_APPWRITE_LIST_COLLECTION,
                    [
                        Query.equal("shortUrl", this.$route.params.id)
                    ]
                );

                if (document.total !== 0) {
                    this.$router.push(`/list/${document.documents[0].$id}`);
                } else {
                    this.notFound = true;
                }
            } catch (error) {
                this.notFound = true;
                this.error = error.code;
            }
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

    h1 {
        font-size: 8rem;
    }

    p {
        font-size: 2rem;
    }
}
</style>
