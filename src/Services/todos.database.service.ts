// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
// Global Variables
export const collections: { todos?: mongoDB.Collection } = {}
// Initialize Connection

export async function connectToTodosDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING ?? '');
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

  //   await db.command({
  //     "collMod": process.env.TODOS_COLLECTION_NAME,
  //     "validator": {
  //         $jsonSchema: {
  //             bsonType: "object",
  //             required: ["name", "description", "category"],
  //             additionalProperties: false,
  //             properties: {
  //             _id: {},
  //             name: {
  //                 bsonType: "string",
  //                 description: "'name' is required and is a string"
  //             },
  //             desscription: {
  //                 bsonType: "string",
  //                 description: "'Description' is required and is a string"
  //             },
  //             category: {
  //                 bsonType: "string",
  //                 description: "'category' is required and is a string"
  //             }
  //             }
  //         }
  //      }
  // });
   
  const todosCollection: mongoDB.Collection = db.collection(process.env.TODOS_COLLECTION_NAME ?? '');
 
  collections.todos = todosCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${todosCollection.collectionName}`);
 }