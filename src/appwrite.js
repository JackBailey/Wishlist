import { Account, Avatars, Client, Databases, Locale } from "appwrite";

const host = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";

const client = new Client().setEndpoint(host).setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const account = new Account(client);

const databases = new Databases(client);

const avatars = new Avatars(client);

const locale = new Locale(client);

export { avatars, client, account, databases, locale };
