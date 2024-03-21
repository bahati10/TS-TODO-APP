// External Dependencies
import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ObjectId } from "mongodb";
import { collections } from "../Services/users.database.service.js";
import User from "../Models/users.js";
import { verifyToken } from "../Middlewares/login.middlewware.js";

// Global Config
export const usersRouter = express.Router();
usersRouter.use(express.json());

// GET all users
usersRouter.get("/", verifyToken, async (_req: Request, res: Response) => {
    try {
        const usersFromDb = await collections.users?.find({}).toArray() ?? [];

        const users: User[] = usersFromDb.map((userDoc: any) => {
            return new User(userDoc.names, userDoc.username, userDoc.email, userDoc.password, userDoc.createdAt, userDoc._id.toString());
        });

        res.status(200).send({message: "Succesfully retrieved users", users });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// GET a user by ID
usersRouter.get("/:id", async (req: Request, res: Response) => {
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

        const userObject: User = {
            id: user._id.toString(),
            names: user.names,
            username: user.username,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            hashPassword: function (): Promise<void> {
                throw new Error("Function not implemented.");
            }
        };

        res.status(200).send(userObject);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// POST/REGISTER
usersRouter.post("/register", async (req: Request, res: Response) => {
    try {
        if (!collections.users) {
            throw new Error("users collection is not available");
        }
        

        const { names, username, email, password }: { names: string, username: string, email: string, password: string } = req.body;

        if (!names || !username || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        const existingUser = await collections.users.findOne({ email });

        if (existingUser) {
            return res.status(400).send("User with this email already exists.");
        }

        const newUser = new User(names, username, email, password);
        await newUser.hashPassword();

        const result = await collections.users.insertOne(newUser);

        if (result.insertedId) {
            const insertedUser = await collections.users.findOne({ _id: result.insertedId}, {projection: {names:1, username: 1, email: 1}} );

            if (insertedUser) {
                console.log('User successfully created');
                res.status(201).send({ message: `Successfully created a new user with id ${result.insertedId}`, user: insertedUser });

            } else {
                console.error('Failed to fetch newly created user:', result.insertedId);
                res.status(500).send("Failed to fetch newly created user.");
            }
        } else {
            console.error('Failed to create user:', newUser);
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error: any) {
        console.error('Error creating user:', error);
        res.status(400).send(error.message);
    }
});


// POST/LOGIN
usersRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password }: { email: string, password: string } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const user = await collections.users?.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign({ userId: user._id, email: user.email, username: user.username}, process.env.JWT_SECRET || '', { expiresIn: '1h' });

        res.status(200).send({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send("Internal server error");
    }
});




// PUT update a user by ID
usersRouter.put("/update/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        if (!id) {
            throw new Error("ID parameter is missing");
        }

        if (!collections.users) {
            throw new Error("users collection is not available");
        }

        const query = { _id: new ObjectId(id) };
        const existingUser = await collections.users.findOne(query);

        if (!existingUser) {
            return res.status(404).send(`User with id ${id} not found`);
        }

        const updatedUser: User = req.body as User;
        updatedUser.id = id; // Ensure the ID is set for the updated user

        // Check if the password is provided in the request body
        if (updatedUser.password) {
            const newUser = new User(
                updatedUser.names,
                updatedUser.username,
                updatedUser.email,
                updatedUser.password,
                updatedUser.createdAt,
                updatedUser.id
            );

            await newUser.hashPassword(); // Hash the new password
            updatedUser.password = newUser.password; // Update the password in the updatedUser object
        }

        const result = await collections.users.updateOne(query, { $set: updatedUser });

        result
            ? res.status(200).send(`Successfully updated user with id ${id}`)
            : res.status(304).send(`User with id: ${id} not updated`);
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});


// DELETE a user by ID
usersRouter.delete("/delete/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        if (!collections.users) {
            throw new Error("users collection is not available");
        }

        const query = { _id: new ObjectId(id) };
        const result = await collections.users.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed user with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove user with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`User with id ${id} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
