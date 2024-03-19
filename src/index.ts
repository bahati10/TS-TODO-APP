import express, { Express, Request, Response } from "express";
import { connectToTodosDatabase } from "./Services/todos.database.service.js";
import { connectToUsersDatabase } from "./Services/users.database.service.js";
import { todosRouter } from "./Routes/todos.routes.js";
import { usersRouter } from "./Routes/users.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

Promise.all([connectToTodosDatabase(), connectToUsersDatabase()])
    .then(() => {
        app.use("/todos", todosRouter);
        app.use("/users", usersRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

