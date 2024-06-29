import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import dotenv from "dotenv";
import vuetify from "vite-plugin-vuetify";

dotenv.config();

const requiredEnvVars = [
    "VITE_APPWRITE_PROJECT",
    "VITE_APPWRITE_DB",
    "VITE_APPWRITE_ITEM_COLLECTION",
    "VITE_APPWRITE_LIST_COLLECTION",
    "VITE_APPWRITE_FULFILLMENT_COLLECTION"
];

let missingEnvVars = [];

missingEnvVars = requiredEnvVars.filter((envVar) => {
    return !process.env[envVar];
});

if (missingEnvVars.length > 0) {
    console.error("Missing environment variables:", missingEnvVars);
    throw new Error();
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vuetify()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
});
