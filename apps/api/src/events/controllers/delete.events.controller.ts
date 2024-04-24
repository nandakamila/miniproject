import { Request, Response } from 'express';
import prisma from '../../prisma';


// DELETE EVENT IMAGES
const deleteEventImage = async (req: Request, res: Response) => {
    try {
        const imageId: string = req.params.imageId;
        const eventId: string = req.params.eventId;

        await prisma.eventImages.delete({
            where: { id: imageId, eventId: eventId }
        });

        res.status(200).json({ message: 'Event image deleted successfully.' });
    } catch (error) {
        console.error('Error deleting event image:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
// DELETE CATEGORIES TICKET
const deleteCategoriesTicket = async (req: Request, res: Response) => {
    try {
        const categoryId: string = req.params.id;

        await prisma.categoriesTickets.delete({
            where: { id: categoryId }
        });

        res.status(200).json({ message: 'Category ticket deleted successfully.' });
    } catch (error) {
        console.error('Error deleting category ticket:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
// DELETE EVENT SCHEDULE
const deleteEventSchedule = async (req: Request, res: Response) => {
    try {
        const scheduleId: string = req.params.id; // Assuming the parameter is named 'id'

        await prisma.eventSchedules.delete({
            where: { id: scheduleId }
        });

        res.status(200).json({ message: 'Event schedule deleted successfully.' });
    } catch (error) {
        console.error('Error deleting event schedule:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// DELETE EVENT
const deleteEvent = async (req: Request, res: Response) => {
    try {
        const eventId: string = req.params.id;

        await prisma.events.delete({
            where: { id: eventId }
        });

        res.status(200).json({ message: 'Event and associated data deleted successfully.' });
    } catch (error) {
        console.error('Error deleting event and associated data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export default {
    deleteEvent, deleteCategoriesTicket, deleteEventImage, deleteEventSchedule
};
