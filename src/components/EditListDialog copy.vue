<template>
    <md-dialog open>
        <div slot="headline">
            {{ title }}
        </div>

        <form method="dialog" slot="content">
            <md-outlined-text-field
                id="title"
                name="title"
                required
                v-model="newItem.title"
            />
            <label for="description">Description</label>
            <md-outlined-text-field
                type="textarea"
                id="description"
                name="description"
                v-model="newItem.description"
            ></md-outlined-text-field>
            <label for="url">URL</label>
            <md-outlined-text-field
                type="url"
                id="url"
                name="url"
                v-model="newItem.url"
            ></md-outlined-text-field>
            <label for="image">Image</label>
            <md-outlined-text-field
                type="url"
                id="image"
                name="image"
                v-model="newItem.image"
            ></md-outlined-text-field>
            <label for="price">Price</label>
            <md-outlined-text-field
                type="number"
                id="price"
                name="price"
                v-model="newItem.price"
                min="0"
            ></md-outlined-text-field>
            <label for="priority">Priority</label>
            <md-outlined-select name="priority" id="priority" v-model="newItem.priority">
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </md-outlined-select>
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
        title: {
            type: String,
            default: "yes"
        },
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