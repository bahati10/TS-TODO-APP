import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (req, res, next) => {
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
        const jwtPayload = decoded;
        if (!jwtPayload || typeof jwtPayload.userId !== 'string') {
            console.error('Invalid user ID in token');
            return res.status(403).send("Forbidden, invalid user ID in token");
        }
        req.userId = jwtPayload.userId;
        console.log('Token verified successfully');
        next();
    });
};
