import express, { Express, Request, Response } from "express";
import { connectToDatabase } from "./Services/database.service.js";
import { todosRouter } from "./Routes/todos.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

connectToDatabase()
    .then(() => {
        app.use("/todos", todosRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });
