import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_ACCESS, JWT_REFRESH } from '../src/config';

export const generateHashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 12);
    return hash;
};

export const matchPassword = async (password: string, hashPassword: string) => {
    const hasMatch = await bcrypt.compare(password, hashPassword);
    return hasMatch;
};

export const generateAccessToken = (user: any) => {
    return jwt.sign({ user: user.id }, JWT_ACCESS, { expiresIn: "5m" });
};

export const generateRefreshToken = (user: any, jwId: string) => {
    return jwt.sign({ user: user.id, jwId }, JWT_REFRESH, { expiresIn: "10h" });
}

export const generateJwtToken = (user: any, jwId: string) => {

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jwId);

    return {
        accessToken,
        refreshToken,
    };
};

export const generateHashToken = (token: string) => {
    const hash = bcrypt.hash(token, 12);
    return hash;
};

export const decodeJwtToken = (token: string): string => {
    const { userId } = jwt.verify(token, JWT_ACCESS) as { userId: string };
    return userId;
};