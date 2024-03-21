// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
// Global Variables
export const collections = {};
// Initialize Connection
export async function connectToTodosDatabase() {
    dotenv.config();
    const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING ?? '');
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const todosCollection = db.collection(process.env.TODOS_COLLECTION_NAME ?? '');
    collections.todos = todosCollection;
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${todosCollection.collectionName}`);
}
