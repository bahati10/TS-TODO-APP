import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
    userId?: string;
}


export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
        console.error('Token missing');
        return res.status(401).send("Unauthorized, token missing");
    }

    console.log('Token:', token);

    jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.status(403).send("Forbidden, invalid token");
        }

        const jwtPayload = decoded as JwtPayload;

        if (!jwtPayload || typeof jwtPayload.userId !== 'string') {
            console.error('Invalid user ID in token');
            return res.status(403).send("Forbidden, invalid user ID in token");
        }

        req.userId = jwtPayload.userId;
        console.log('Token verified successfully');
        next();
    });
};
