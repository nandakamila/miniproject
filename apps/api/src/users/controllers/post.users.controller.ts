import prisma from '../../prisma';
import { uuid } from 'uuidv4';
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from 'express';
import { generateHashPassword, generateJwtToken, findUserByEmail } from '../../../utils/auth';
import { generateRefferal } from '../../../utils/refferalCode';
import { addRefreshToken } from '../../auth/auth.controller';

// HANDLER REGISTER
const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        if (!firstName || !lastName || !email || !password || !role) {
            res.status(400);
            throw new Error("Please fill in all the fields");
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            res.status(400);
            throw new Error("Email already in use");
        }

        const hashPassword = await generateHashPassword(password);
        let accessToken, refreshToken;

        await prisma.$transaction(async (prisma) => {
            const user = await prisma.users.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashPassword,
                    role
                },
            });

            await prisma.participants.create({
                data: {
                    userId: user.id,
                    refferalCode: generateRefferal(),
                },
            });

            await prisma.organizers.create({
                data: { userId: user.id },
            });

            const jtId = uuid();
            const tokens = generateJwtToken(user, jtId);
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
            await addRefreshToken(jtId, refreshToken, user.id);
        });

        res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
};

// HANDLER LOGIN
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('You must provide an email and a password.');
        }

        const existingUser = await findUserByEmail(email);

        if (!existingUser) {
            res.status(403);
            throw new Error('Invalid login credentials.');
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(403);
            throw new Error('Invalid login credentials.');
        }

        const jtId = uuid();
        const tokens = generateJwtToken(existingUser, jtId);
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;
        await addRefreshToken(jtId, refreshToken, existingUser.id);

        res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
};

export default {
    register,
    login
}