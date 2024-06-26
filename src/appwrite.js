import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const account = new Account(client);

const databases = new Databases(client);

export { client, account, databases };
