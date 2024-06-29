<template>
    <v-main>
        <div class="page-content">
            <h1>Error {{ error.code }} - {{ error.type }}</h1>
            <p>{{ error.message }}</p>
            <v-btn to="/dash/login">Try again</v-btn>
        </div>
    </v-main>
</template>


<script>
export default {
    data() {
        return {
            error: JSON.parse(decodeURIComponent(this.$route.query.error))
        };
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
}
</style>