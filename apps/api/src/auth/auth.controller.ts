
import prisma from "../prisma";
import jwt from 'jsonwebtoken';
import { uuid } from 'uuidv4';
import { findUserById, generateHashToken, generateJwtToken } from "../../utils/auth";
import { NextFunction, Request, Response } from "express";
import { JWT_REFRESH } from "../config";

export async function addRefreshToken(jtId: string, refreshToken: string, userId: string) {
    try {
        const hashedToken = await generateHashToken(refreshToken);
        const result = await prisma.refreshToken.create({
            data: {
                id: jtId,
                hashedToken,
                userId
            },
        });
        return result;
    } catch (error) {
        console.error('Error adding refresh token:', error);
        throw new Error('Failed to add refresh token');
    }
}

export function findRefreshTokenById(id: string) {
    return prisma.refreshToken.findUnique({
        where: { id },
    });
}

export function deleteRefreshToken(id: string) {
    return prisma.refreshToken.update({
        where: { id },
        data: { revoked: true }
    });
}

export function revokeRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true }
    });
}


// TOKEN LOGIN
export const getRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error('Missing refresh token.');
        }
        const payload = jwt.verify(refreshToken, JWT_REFRESH) as {
            jtId: string;
            userId: string;
        };

        const savedRefreshToken = await findRefreshTokenById(payload.jtId);

        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        const hashedToken = await generateHashToken(refreshToken);
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        const user = await findUserById(payload.userId);
        if (!user) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        await deleteRefreshToken(savedRefreshToken.id);
        const jtId = uuid();
        const { accessToken, refreshToken: newRefreshToken } = generateJwtToken(user, jtId);
        await addRefreshToken(jtId, newRefreshToken, user.id);

        res.status(200).json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        next(err);
    }
}
// REVOKE REFRESH TOKEN FOR RECHECK PURPOSE
export const revokeRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        await revokeRefreshTokens(userId);
        res.status(200).json({ message: `Tokens revoked for user with id #${userId}` });
    } catch (err) {
        next(err);
    }
};


