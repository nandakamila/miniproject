
import prisma from "../prisma";
import { generateHashToken } from "utils/auth";

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
        where: {
            id,
        },
    });
}

export function deleteRefreshToken(id: string) {
    return prisma.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true
        }
    });
}

export function revokeRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
        where: {
            userId
        },
        data: {
            revoked: true
        }
    });
}

