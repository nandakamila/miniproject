import prisma from '../../prisma';
import { Response, Request } from 'express';
import { CategoriesEvent } from '@prisma/client';
import pagination from 'utils/pagination';

// GET ALL EVENTS OR BY PARAMS
const getAllEventsByQuery = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required.' });
        }

        const { page, pageSize } = req.query;
        const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

        const events = await prisma.events.findMany({
            where: {
                OR: [
                    { name: { contains: query as string } },
                    { description: { contains: query as string } },
                    { organizer: { business_name: { contains: query as string } } },
                ],
            },
            skip,
            take,
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events by query:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// GET ALL EVENTS TODAY
const getEventsToday = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const events = await prisma.events.findMany({
            where: {
                createdAt: {
                    gte: today,
                    lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                },
            },
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events happening today:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//GET ALL EVENTS TOMMOROW
const getEventsTommorow = async (req: Request, res: Response) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const { page, pageSize } = req.query;
        const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

        const events = await prisma.events.findMany({
            where: {
                createdAt: {
                    gte: tomorrow,
                    lt: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1),
                },
            },
            skip,
            take,
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events happening tomorrow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET ALL EVENTS THIS WEEK
const getEventsThisWeek = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
        const startOfWeek = new Date(endOfWeek);
        startOfWeek.setDate(endOfWeek.getDate() - 1);

        const { page, pageSize } = req.query;
        const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

        const events = await prisma.events.findMany({
            where: {
                createdAt: {
                    gte: startOfWeek,
                    lt: endOfWeek,
                },
            },
            skip,
            take,
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events happening this weekend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET ALL EVENTS IN CATEGORY
const getEventsByCategory = async (req: Request, res: Response) => {
    try {
        const categoryString: string = req.params.category.toUpperCase();
        const category: CategoriesEvent = CategoriesEvent[categoryString as keyof typeof CategoriesEvent];

        if (!category) {
            return res.status(400).json({ error: `Invalid category: ${categoryString}` });
        }

        if (!Object.values(CategoriesEvent).includes(category)) {
            return res.status(400).json({ error: `Invalid category: ${category}` });
        }

        const { page, pageSize } = req.query;
        const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

        const events = await prisma.events.findMany({
            where: {
                categories: category,
            },
            skip,
            take,
        });

        res.json(events);
    } catch (error) {
        console.error(`Error fetching events in category`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET ALL FREE EVENTS
const getFreeEvents = async (req: Request, res: Response) => {
    try {
        const { page, pageSize } = req.query;
        const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

        const events = await prisma.events.findMany({
            where: {
                ticketType: 'FREE',
            },
            skip,
            take,
        });

        res.json(events);
    } catch (error) {
        console.error('Error fetching free events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET HOT EVENTS
const getHotEvents = async (req: Request, res: Response) => {
    try {
        const { page, pageSize } = req.query;
        const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

        const hotEvents = await prisma.events.findMany({
            orderBy: {
                RSVP: {
                    _count: 'desc'
                }
            },
            skip,
            take,
        });

        res.json(hotEvents);
    } catch (error) {
        console.error('Error fetching hot events:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


export default {
    getAllEventsByQuery, getEventsToday,
    getEventsTommorow, getEventsThisWeek,
    getEventsByCategory, getFreeEvents,
    getHotEvents
}