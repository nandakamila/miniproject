import { Request, Response } from "express";
import prisma from "../../prisma";

// UPDATE DATA USER
const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { firstName, lastName, password } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { firstName, lastName, password }
        });
        res.status(200).send(`User data updated successfully ${updatedUser}`);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send('Internal server error');
    }
};

// UPDATE DATA PARTICIPANT
const updateParticipant = async (req: Request, res: Response) => {
    try {
        const participantId = req.params.id;
        const { avatar, gender, location } = req.body;

        if (!participantId) return res.status(400).json({ error: 'Participant ID is required.' });
        const updatedParticipant = await prisma.participants.update({
            where: { id: participantId },
            data: { avatar, gender, location }
        });

        res.json(updatedParticipant);
    } catch (error) {
        console.error('Error updating Data :', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// UPDATE DATA ORGANIZER
const updateOrganizer = async (req: Request, res: Response) => {
    try {
        const organizerId = req.params.id;
        const { business_name, business_type, address, about, twitter, instagram, facebook } = req.body;

        if (!organizerId) return res.status(400).json({ error: 'Organizer ID is required.' });
        const updatedOrganizer = await prisma.organizers.update({
            where: { id: organizerId },
            data: { business_name, business_type, address, about, twitter, instagram, facebook }
        });

        res.status(200).json(updatedOrganizer);
    } catch (error) {
        console.error('Error updating Data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export default {
    updateUser,
    updateParticipant,
    updateOrganizer
}