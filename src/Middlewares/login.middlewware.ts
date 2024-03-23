import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express';

// dotenv.config();

// interface AuthRequest extends Request {
//     userId?: string;
// }


// export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//     const token = req.headers['authorization'];

//     if (!token) {
//         console.error('Token missing');
//         return res.status(401).send("Unauthorized, token missing");
//     }

//     console.log('Token:', token);

//     jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
//         if (err) {
//             console.error('JWT Verification Error:', err);
//             return res.status(403).send("Forbidden, invalid token");
//         }

//         const jwtPayload = decoded as JwtPayload;

//         if (!jwtPayload || typeof jwtPayload.userId !== 'string') {
//             console.error('Invalid user ID in token');
//             return res.status(403).send("Forbidden, invalid user ID in token");
//         }

//         req.userId = jwtPayload.userId;
//         console.log('Token verified successfully');
//         next();
//     });
// };



export const usersRouter = express.Router();
usersRouter.use(express.json());

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Unauthorized: Missing token');
    }

    jwt.verify(token, process.env.JWT_SECRET || '', (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
        }

        // Attach the decoded token to the request for further processing

        next();
    });
};

