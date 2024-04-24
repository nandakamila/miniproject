import { JWT_ACCESS } from '../config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401);
        throw new Error('🚫 Un-Authorized 🚫');
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, JWT_ACCESS) as {
            jtId: string;
            userId: string;
        };
        return next(payload);
    } catch (err: any) {
        res.status(401);
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }
        throw new Error('🚫 Un-Authorized 🚫');
    }
}