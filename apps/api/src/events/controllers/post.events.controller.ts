import prisma from '../../prisma';
import { Request, Response } from 'express';

// CREATE EVENT
const createEvent = async (req: Request, res: Response) => {
    try {
        const { organizerId, name, description, CategoriesEvent, ticketType, status } = req.body;

        const newEvent = await prisma.events.create({
            data: {
                organizerId,
                name,
                description,
                categories: CategoriesEvent,
                ticketType,
                status,
            }
        });

        const eventImages = await createEventImages(newEvent.id, req.body.eventImages);
        const eventSchedule = await createEventSchedule(newEvent.id, req.body.eventSchedule.start, req.body.eventSchedule.end, req.body.eventSchedule.availableTicket, req.body.eventSchedule.location);
        const categoriesTicket = await createCategoriesTicket(req.body.categoriesTicket.name, req.body.categoriesTicket.description, req.body.categoriesTicket.price);
        res.status(201).json({ event: newEvent, eventImages, eventSchedule, categoriesTicket });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
// CREATE EVENT IMAGES
const createEventImages = async (eventId: string, images: string[]) => {
    try {

        const eventImages = await prisma.eventImages.createMany({
            data: images.map((image: string) => ({
                eventId,
                image,
            }))
        });

        return eventImages;
    } catch (error) {
        console.error('Error creating event images:', error);
        throw new Error('Failed to create event images.');
    }
};
// CREATE EVENT SCHEDULE
const createEventSchedule = async (eventId: string, start: Date, end: Date, availableTicket: number, location: string) => {
    try {
        const eventSchedule = await prisma.eventSchedules.create({
            data: {
                eventId,
                start,
                end,
                availableTicket,
                location,
            }
        });

        return eventSchedule;
    } catch (error) {
        console.error('Error creating event schedule:', error);
        throw new Error('Failed to create event schedule.');
    }
};
// CREATE CATEGORIES TICKET
const createCategoriesTicket = async (name: string, description: string, price: number) => {
    try {
        const newCategoryTicket = await prisma.categoriesTickets.create({
            data: {
                name,
                description,
                price,
            }
        });

        return newCategoryTicket;
    } catch (error) {
        console.error('Error creating category ticket:', error);
        throw new Error('Failed to create category ticket.');
    }
};

export default {
    createEvent,
    createCategoriesTicket,
    createEventImages,
    createEventSchedule,
}