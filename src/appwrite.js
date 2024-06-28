import { Account, Avatars, Client, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const account = new Account(client);

const databases = new Databases(client);

const avatars = new Avatars(client);

export { avatars, client, account, databases };
