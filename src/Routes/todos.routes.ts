// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../Services/todos.database.service.js";
import Todo from "../Models/todos.js";
// Global Config
export const todosRouter = express.Router();
todosRouter.use(express.json());

// GET
todosRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const todosFromDb = await collections.todos?.find({}).toArray() ?? [];

        const todos: Todo[] = todosFromDb.map((todoDoc: any) => {
            return new Todo(todoDoc.title, todoDoc.category, todoDoc.done, todoDoc.description, todoDoc.DateAdded, todoDoc._id.toString());
        });
        res.status(200).send(todos);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});


// GET by ID
todosRouter.get("/:id", async (req: Request, res: Response) => {
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

        const todoObject: Todo = {
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description,
            category: todo.category,
            done: todo.done,
            DateAdded: todo.DateDate,
        };

        res.status(200).send(todoObject);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// POST
todosRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.todos) {
            throw new Error("todos collection is not available");
        }

        const newTodo = req.body as Todo;
        const result = await collections.todos.insertOne(newTodo);

        if (result.insertedId) {
            const insertedTodo = await collections.todos.findOne({ _id: result.insertedId }, { projection:{ title: 1, category: 1, done: 1, description: 1} });
            
            if (insertedTodo) {
                console.log('Todo successfully created:', insertedTodo);
                res.status(201).send({ message: `Successfully created a new todo with id ${result.insertedId}`, todo: insertedTodo });
            } else {
                console.error('Failed to fetch newly created todo:', result.insertedId);
                res.status(500).send("Failed to fetch newly created todo.");
            }
        } else {
            console.error('Failed to create todo:', newTodo);
            res.status(500).send("Failed to create a new todo.");
        }
    } catch (error: any) {
        console.error('Error creating todo:', error);
        res.status(400).send(error.message);
    }
});




// PUT
todosRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedGame: Todo = req.body as Todo;
        const query = { _id: new ObjectId(id) };

        if (!collections.todos) {
            throw new Error("todos collection is not available");
        }
      
        const result = await collections.todos.updateOne(query, { $set: updatedGame });

        result
            ? res.status(200).send(`Successfully updated todo with id ${id}`)
            : res.status(304).send(`Todo with id: ${id} not updated`);
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// DELETE

todosRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {

        if (!collections.todos) {
            throw new Error("todos collection is not available");
        }

        const query = { _id: new ObjectId(id) };
        const result = await collections.todos.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed todo with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove todo with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Todo with id ${id} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});