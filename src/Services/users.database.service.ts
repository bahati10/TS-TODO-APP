// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
// Global Variables
export const collections: { users?: mongoDB.Collection } = {}
// Initialize Connection

export async function connectToUsersDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING ?? '');
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    // await db.command({
    //     "collMod": process.env.USERS_COLLECTION_NAME,
    //     "validator": {
    //         $jsonSchema: {
    //             bsonType: "object",
    //             required: ["names", "username", "email", "password"],
    //             additionalProperties: false,
    //             properties: {
    //             _id: {},
    //             names: {
    //                 bsonType: "string",
    //                 description: "'name' is required and is a string"
    //             },
    //             username: {
    //                 bsonType: "string",
    //                 description: "'Description' is required and is a string"
    //             },
    //             email: {
    //                 bsonType: "string",
    //                 description: "'category' is required and is a string"
    //             },
    //             password: {
    //                 bsonType: "string",
    //                 description: "'category' is required and is a string"
    //             }
    //             }
    //         }
    //      }
    // });
   
    const usersCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME ?? '');
 
  collections.users = usersCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
 }