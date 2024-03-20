// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
// Global Variables
export const collections = {};
// Initialize Connection
export async function connectToUsersDatabase() {
    dotenv.config();
    const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING ?? '');
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME ?? '');
    collections.users = usersCollection;
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
}
