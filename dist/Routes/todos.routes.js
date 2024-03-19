// External Dependencies
import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../Services/todos.database.service.js";
import Todo from "../Models/todos.js";
// Global Config
export const todosRouter = express.Router();
todosRouter.use(express.json());
// GET
todosRouter.get("/", async (_req, res) => {
    try {
        const todosFromDb = await collections.todos?.find({}).toArray() ?? [];
        const todos = todosFromDb.map((todoDoc) => {
            return new Todo(todoDoc.name, todoDoc.category, todoDoc.description, todoDoc.DateAdded, todoDoc._id.toString());
        });
        res.status(200).send(todos);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
todosRouter.get("/:id", async (req, res) => {
    const id = req?.params?.id;
    try {
        if (!id) {
            throw new Error("ID parameter is missing");
        }
        if (!collections.todos) {
            throw new Error("todos collection is not available");
        }
        const query = { _id: new ObjectId(id) };
        const todo = await collections.todos.findOne(query);
        if (!todo) {
            res.status(404).send(`Unable to find matching document with id: ${id}`);
            return;
        }
        const todoObject = {
            id: todo._id.toString(),
            name: todo.name,
            description: todo.description,
            DateAdded: todo.DateDate,
            category: todo.category,
        };
        res.status(200).send(todoObject);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
// POST
todosRouter.post("/", async (req, res) => {
    try {
        if (!collections.todos) {
            throw new Error("todos collection is not available");
        }
        const newTodo = req.body;
        const result = await collections.todos.insertOne(newTodo);
        if (result.insertedId) {
            // Fetch the newly inserted todo from the database
            const insertedTodo = await collections.todos.findOne({ _id: result.insertedId });
            if (insertedTodo) {
                console.log('Todo successfully created:', insertedTodo);
                res.status(201).send({ message: `Successfully created a new todo with id ${result.insertedId}`, todo: insertedTodo });
            }
            else {
                console.error('Failed to fetch newly created todo:', result.insertedId);
                res.status(500).send("Failed to fetch newly created todo.");
            }
        }
        else {
            console.error('Failed to create todo:', newTodo);
            res.status(500).send("Failed to create a new todo.");
        }
    }
    catch (error) {
        console.error('Error creating todo:', error);
        res.status(400).send(error.message);
    }
});
// PUT
todosRouter.put("/:id", async (req, res) => {
    const id = req?.params?.id;
    try {
        const updatedGame = req.body;
        const query = { _id: new ObjectId(id) };
        if (!collections.todos) {
            throw new Error("todos collection is not available");
        }
        const result = await collections.todos.updateOne(query, { $set: updatedGame });
        result
            ? res.status(200).send(`Successfully updated todo with id ${id}`)
            : res.status(304).send(`Todo with id: ${id} not updated`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
// DELETE
todosRouter.delete("/:id", async (req, res) => {
    const id = req?.params?.id;
    try {
        if (!collections.todos) {
            throw new Error("todos collection is not available");
        }
        const query = { _id: new ObjectId(id) };
        const result = await collections.todos.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed todo with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove todo with id ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Todo with id ${id} does not exist`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
