<template>
    <md-dialog open>
        <div slot="headline">
            Edit List
        </div>

        <form method="dialog" slot="content">
            <label for="title">Title</label>
            <md-outlined-text-field
                id="title"
                name="title"
                required
                v-model="list.title"
            />
            <label for="description">Description</label>
            <md-outlined-text-field
                type="textarea"
                id="description"
                name="description"
                v-model="list.description"
            ></md-outlined-text-field>
            <md-filled-button type="submit">Create</md-filled-button>
        </form>
    </md-dialog>
</template>

<script>
import "material/dialog/dialog";
import "material/textfield/outlined-text-field";
import "material/select/outlined-select";
import "material/button/filled-button";
export default {
    title: "ListDialog",
    props: {
        list: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            newItem: {}
        };
    }
}
</script>

<style lang="scss" scoped>
md-dialog {
    max-width: 80%;
    width: 100%;
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}

</style>