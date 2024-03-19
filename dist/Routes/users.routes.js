// External Dependencies
import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../Services/users.database.service.js";
import User from "../Models/users.js";
// Global Config
export const usersRouter = express.Router();
usersRouter.use(express.json());
// GET all users
usersRouter.get("/", async (_req, res) => {
    try {
        const usersFromDb = await collections.users?.find({}).toArray() ?? [];
        const users = usersFromDb.map((userDoc) => {
            return new User(userDoc.name, userDoc.username, userDoc.email, userDoc.createdAt);
        });
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
// GET a user by ID
usersRouter.get("/:id", async (req, res) => {
    const id = req?.params?.id;
    try {
        if (!id) {
            throw new Error("ID parameter is missing");
        }
        if (!collections.users) {
            throw new Error("users collection is not available");
        }
        const query = { _id: new ObjectId(id) };
        const user = await collections.users.findOne(query);
        if (!user) {
            res.status(404).send(`Unable to find matching user with id: ${id}`);
            return;
        }
        const userObject = {
            id: user._id.toString(),
            names: user.names,
            username: user.username,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            hashPassword: function () {
                throw new Error("Function not implemented.");
            }
        };
        res.status(200).send(userObject);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
// POST a new user
usersRouter.post("/", async (req, res) => {
    try {
        if (!collections.users) {
            throw new Error("users collection is not available");
        }
        const { names, username, email, password } = req.body;
        const existingUser = await collections.users.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User with this email already exists.");
        }
        const newUser = new User(names, username, email, password);
        await newUser.hashPassword();
        const result = await collections.users.insertOne(newUser);
        if (result.insertedId) {
            const insertedUser = await collections.users.findOne({ _id: result.insertedId });
            if (insertedUser) {
                console.log('User successfully created');
                res.status(201).send({ message: `Successfully created a new user with id ${result.insertedId}`, user: insertedUser });
            }
            else {
                console.error('Failed to fetch newly created user:', result.insertedId);
                res.status(500).send("Failed to fetch newly created user.");
            }
        }
        else {
            console.error('Failed to create user:', newUser);
            res.status(500).send("Failed to create a new user.");
        }
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(400).send(error.message);
    }
});
// PUT update a user by ID
usersRouter.put("/:id", async (req, res) => {
    const id = req?.params?.id;
    try {
        const updatedUser = req.body;
        await updatedUser.hashPassword();
        const query = { _id: new ObjectId(id) };
        if (!collections.users) {
            throw new Error("users collection is not available");
        }
        const result = await collections.users.updateOne(query, { $set: updatedUser });
        result
            ? res.status(200).send(`Successfully updated user with id ${id}`)
            : res.status(304).send(`User with id: ${id} not updated`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
// DELETE a user by ID
usersRouter.delete("/:id", async (req, res) => {
    const id = req?.params?.id;
    try {
        if (!collections.users) {
            throw new Error("users collection is not available");
        }
        const query = { _id: new ObjectId(id) };
        const result = await collections.users.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed user with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove user with id ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`User with id ${id} does not exist`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
