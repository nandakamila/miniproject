import { Request, Response } from 'express';
import prisma from '../../prisma';


// UPDATE EVENT
const updateEvent = async (req: Request, res: Response) => {
    try {
        const eventId = req.params.id;
        const { name, description, categoriesTicket, ticketType, status } = req.body;

        const updatedEvent = await prisma.events.update({
            where: { id: eventId },
            data: {
                name,
                description,
                categories: categoriesTicket,
                ticketType,
                status,
            }
        });

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
// UPDATE EVENT SCHEDULE
const updateEventSchedule = async (req: Request, res: Response) => {
    try {
        const eventId: string = req.params.id;
        const { start, end, availableTicket, location } = req.body;

        const updatedEventSchedule = await prisma.eventSchedules.update({
            where: { eventId },
            data: {
                start,
                end,
                availableTicket,
                location,
            }
        });

        res.status(200).json(updatedEventSchedule);
    } catch (error) {
        console.error('Error updating event schedule:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
// UPDATE EVENT IMAGES
const updateEventImage = async (req: Request, res: Response) => {
    try {
        const eventId = req.params.id;
        const { images } = req.body;

        const updatedEventImages = await prisma.eventImages.deleteMany({ where: { eventId } });

        await prisma.eventImages.createMany({
            data: images.map((image: string) => ({
                eventId,
                image,
            }))
        });

        res.status(200).json({ message: 'Event images updated successfully.' });
    } catch (error) {
        console.error('Error updating event images:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// UPDATE CATEGORIES TICKET
const updateCategoriesTicket = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const { name, description, price } = req.body;

        const updatedCategoryTicket = await prisma.categoriesTickets.update({
            where: { id: categoryId },
            data: {
                name,
                description,
                price,
            }
        });

        res.status(200).json(updatedCategoryTicket);
    } catch (error) {
        console.error('Error updating category ticket', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export default {
    updateEvent, updateCategoriesTicket, updateEventImage, updateEventSchedule,
}