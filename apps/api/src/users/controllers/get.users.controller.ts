import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma";

// GET USER DATA BY ID
const findUserById = async (req: Request, res: Response) => {
    const email = req.params.email;
    try {
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET PARTICIPANT DATA BY ID
const findParticipantById = async (req: Request, res: Response) => {
    const participantId = req.params.id;
    try {
        const participant = await prisma.participants.findUnique({
            where: { id: participantId },
        });

        if (!participant) return res.status(404).json({ error: 'Participant data not found' });

        res.status(200).json(participant);
    } catch (error) {
        console.error('Error fetching participant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET ORGANIZER DATA BY ID
const findOrganizerById = async (req: Request, res: Response) => {
    const organizerId = req.params.id;
    try {
        const organizer = await prisma.organizers.findUnique({
            where: { id: organizerId },
        });

        if (!organizer) return res.status(404).json({ error: 'Organizer not found' });

        res.status(200).json(organizer);
    } catch (error) {
        console.error('Error fetching organizer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default {
    findUserById,
    findParticipantById,
    findOrganizerById
}