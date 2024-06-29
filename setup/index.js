import * as sdk from "node-appwrite";
import fs from "fs";

let apiKey = false;
let endpoint = "https://cloud.appwrite.io/v1";
let project = false;
let overwrite = false;

process.argv.map((arg) => {
    if (arg.startsWith("--key=")) {
        apiKey = arg.replace("--key=", "");
    } else if (arg.startsWith("--endpoint=")) {
        endpoint = arg.replace("--endpoint=", "");
    } else if (arg.startsWith("--project=")) {
        project = arg.replace("--project=", "");
    } else if (arg === "--overwrite") {
        overwrite = true;
    }
});

if (!apiKey) {
    console.log("Please provide your API key");
    process.exit(1);
}

if (!project) {
    console.log("Please provide your project ID");
    process.exit(1);
}

const client = new sdk.Client();

client.setEndpoint(endpoint).setProject(project).setKey(apiKey);

const databases = new sdk.Databases(client);

const prepareDatabases = async () => {
    console.log("Checking databases");

    const existingDatabases = await databases.list();

    if (existingDatabases.total !== 0) {
        if (!overwrite) {
            console.log("Databases already exist. Use --overwrite to delete them");
            process.exit(1);
        } else {
            console.log("Deleting existing databases");
            await Promise.all(
                existingDatabases.databases.map(async (database) => {
                    await databases.delete(database.$id);
                })
            );
            console.log(`${existingDatabases.total} previous databases deleted`);
        }
    }

    console.log("Setting up databases");
    const database = await databases.create(sdk.ID.unique(), "wishlist");

    // ITEMS

    const itemsCollection = await databases.createCollection(
        database.$id,
        sdk.ID.unique(),
        "items",
        [sdk.Permission.read(sdk.Role.any()), sdk.Permission.create(sdk.Role.users())],
        true
    );

    await databases.createStringAttribute(database.$id, itemsCollection.$id, "title", 64, true);

    await databases.createStringAttribute(
        database.$id,
        itemsCollection.$id,
        "description",
        256,
        false,
        null
    );

    await databases.createFloatAttribute(
        database.$id,
        itemsCollection.$id,
        "price",
        false,
        0,
        1000000,
        0
    );

    await databases.createUrlAttribute(database.$id, itemsCollection.$id, "url", false, null);

    await databases.createUrlAttribute(database.$id, itemsCollection.$id, "image", false, null);

    await databases.createStringAttribute(
        database.$id,
        itemsCollection.$id,
        "priority",
        32,
        false,
        "none"
    );

    await databases.createBooleanAttribute(
        database.$id,
        itemsCollection.$id,
        "displayPrice",
        false,
        true
    );

    // LIST

    const listsCollection = await databases.createCollection(
        database.$id,
        sdk.ID.unique(),
        "lists",
        [sdk.Permission.read(sdk.Role.any()), sdk.Permission.create(sdk.Role.users())],
        true
    );

    await databases.createStringAttribute(database.$id, listsCollection.$id, "author", 20, true);

    await databases.createStringAttribute(database.$id, listsCollection.$id, "title", 64, true);

    await databases.createStringAttribute(
        database.$id,
        listsCollection.$id,
        "description",
        4096,
        false,
        null
    );

    await databases.createStringAttribute(
        database.$id,
        listsCollection.$id,
        "currency",
        3,
        false,
        "USD"
    );

    // FULFILLMENTS

    const fulfillmentsCollection = await databases.createCollection(
        database.$id,
        sdk.ID.unique(),
        "fulfillments",
        [sdk.Permission.read(sdk.Role.any()), sdk.Permission.create(sdk.Role.any())]
    );

    await databases.createStringAttribute(
        database.$id,
        fulfillmentsCollection.$id,
        "name",
        32,
        true
    );

    // RELATIONSHIPS

    await databases.createRelationshipAttribute(
        database.$id,
        listsCollection.$id,
        itemsCollection.$id,
        "oneToMany",
        true,
        "items",
        "list",
        "cascade"
    );

    await databases.createRelationshipAttribute(
        database.$id,
        fulfillmentsCollection.$id,
        itemsCollection.$id,
        "oneToOne",
        false,
        "item",
        "fulfillment",
        "setNull"
    );

    console.log("Database setup complete");

    let config = {
        VITE_APPWRITE_ENDPOINT: endpoint,
        VITE_APPWRITE_PROJECT: project,
        VITE_APPWRITE_DB: database.$id,
        VITE_APPWRITE_ITEM_COLLECTION: itemsCollection.$id,
        VITE_APPWRITE_LIST_COLLECTION: listsCollection.$id,
        VITE_APPWRITE_FULFILLMENT_COLLECTION: fulfillmentsCollection.$id,
        VITE_LOGIN_METHODS: "github,password"
    };

    fs.writeFileSync(
        "output.env",
        Object.keys(config)
            .map((key) => `${key}="${config[key]}"`)
            .join("\n")
    );
};

prepareDatabases();