import { Request, Response } from 'express';
import prisma from '../prisma';
import pagination from 'utils/pagination';

// CREATE FAVORITE
const addFavorite = async (req: Request, res: Response) => {
    try {
        const { eventId, participantId } = req.body;

        if (!eventId || !participantId) {
            return res.status(400).json({ error: 'Event ID and participant ID are required.' });
        }

        const existingFavorite = await prisma.favorites.findFirst({
            where: {
                eventId: eventId as string,
                participantId: participantId as string
            }
        });

        if (existingFavorite) {
            return res.status(400).json({ error: 'Favorite already exists.' });
        }

        const newFavorite = await prisma.favorites.create({
            data: {
                eventId: eventId as string,
                participantId: participantId as string
            }
        });

        res.status(201).json(newFavorite);
    } catch (error) {
        console.error('Error adding favorite event:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// DELETE FAVORITE
const deleteFavorite = async (req: Request, res: Response) => {
    try {
        const favoriteId = req.params.id;

        if (!favoriteId) {
            return res.status(400).json({ error: 'Favorite ID is required.' });
        }

        await prisma.favorites.delete({
            where: {
                id: favoriteId
            }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// GET ALL FAVORITE
const getAllFavorite = async (req: Request, res: Response) => {
    try {
        const { participantId } = req.query;

        if (!participantId) {
            return res.status(400).json({ error: 'Participant ID is required.' });
        }

        const { page, pageSize } = req.query;
        const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

        const favoriteEvents = await prisma.favorites.findMany({
            where: {
                participantId: participantId as string
            },
            include: {
                events: true
            },

            skip,
            take,
        });

        res.json(favoriteEvents.map(favorite => favorite.events));
    } catch (error) {
        console.error('Error fetching favorite events:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export default { addFavorite, getAllFavorite, deleteFavorite };
