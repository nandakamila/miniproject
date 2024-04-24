import prisma from "@/prisma";
import { Request, Response } from "express";
import pagination from "utils/pagination";

// CREATE REVIEW
const addReview = async (req: Request, res: Response) => {
    try {
        const { rating, review, eventId } = req.body;

        if (!rating || !review || !eventId) {
            return res.status(400).json({ error: 'Rating, review, and event ID are required.' });
        }

        const validRatings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
        if (!validRatings.includes(rating)) {
            return res.status(400).json({ error: 'Invalid rating value. Rating must be between 0.5 and 5 in increments of 0.5.' });
        }

        const newReview = await prisma.reviews.create({
            data: {
                rating,
                review,
                eventId
            }
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// DISPLAY ALL REVIEWS/BY PARAMS
const getAllReviews = async (req: Request, res: Response) => {
    try {
        const { eventId, userId, rating, sortBy } = req.query;

        let reviewsQuery = {};

        if (eventId) {
            reviewsQuery = {
                ...reviewsQuery,
                eventId: eventId as string
            };
        }

        if (userId) {
            reviewsQuery = {
                ...reviewsQuery,
                userId: userId as string
            };
        }

        if (rating) {
            reviewsQuery = {
                ...reviewsQuery,
                rating: parseFloat(rating as string)
            };
        }

        let orderBy = {};
        if (sortBy === 'oldest') {
            orderBy = {
                createdAt: 'asc'
            };
        } else {
            orderBy = {
                createdAt: 'desc'
            };
        }

        const { page, pageSize } = req.query;
        const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

        const reviews = await prisma.reviews.findMany({
            where: reviewsQuery,
            orderBy: orderBy,

            skip,
            take,
        });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// UPDATE REVIEW
const updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;
        const { rating, review } = req.body;

        if (!reviewId) {
            return res.status(400).json({ error: 'Review ID is required.' });
        }

        const dataToUpdate: any = {};
        if (rating !== undefined) {
            dataToUpdate.rating = rating;
        }
        if (review !== undefined) {
            dataToUpdate.review = review;
        }

        const updatedReview = await prisma.reviews.update({
            where: {
                id: reviewId
            },
            data: dataToUpdate
        });

        res.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// DELETE REVIEW
const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;

        if (!reviewId) {
            return res.status(400).json({ error: 'Review ID is required.' });
        }

        await prisma.reviews.delete({
            where: {
                id: reviewId
            }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export default { addReview, getAllReviews, updateReview, deleteReview }