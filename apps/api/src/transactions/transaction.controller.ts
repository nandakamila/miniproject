import { Request, Response } from 'express';
import prisma from '../prisma';
import pagination from '../../utils/pagination';

const addTransaction = async (req: Request, res: Response) => {
  try {
    const { participantId, eventId, price, couponId, pointId, categoriesTicketId } = req.body;

    if (!participantId || !eventId || !price) {
      return res.status(400).json({ error: 'Data are invalid.' });
    }

    const transaction = await prisma.transactions.create({
      data: {
        participantId,
        eventId,
        price,
        ...(couponId && { couponId }),
        ...(pointId && { pointId })
      }
    });

    const ticket = await prisma.tickets.create({
      data: {
        eventId,
        categoriesTicketId
      }
    });

    const rsvp = await prisma.rSVP.create({
      data: {
        participantId,
        eventId
      }
    });
    res.status(201).json({ transaction, ticket, rsvp });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getAllTransactionsParticipant = async (req: Request, res: Response) => {
  try {
    const { participantId, sortBy } = req.query;

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required.' });
    }

    let orderBy: any = {};
    if (sortBy === 'oldest') {
      orderBy.createdAt = 'asc';
    } else if (sortBy === 'newest') {
      orderBy.createdAt = 'desc';
    } else if (sortBy === 'highestPrice') {
      orderBy.price = 'desc';
    } else if (sortBy === 'lowestPrice') {
      orderBy.price = 'asc';
    }

    const { page, pageSize } = req.query;
    const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

    const transactions = await prisma.transactions.findMany({
      where: {
        participantId: participantId as string
      },
      orderBy,
      skip,
      take,
    });

    res.json(transactions);

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getAllTransactionsOrganizer = async (req: Request, res: Response) => {
  try {
    const { organizerId, sortBy } = req.query;

    if (!organizerId) {
      return res.status(400).json({ error: 'organizer ID is required.' });
    }

    let orderBy: any = {};

    if (sortBy === 'oldest') {
      orderBy.createdAt = 'asc';
    } else if (sortBy === 'newest') {
      orderBy.createdAt = 'desc';
    } else if (sortBy === 'highestPrice') {
      orderBy.price = 'desc';
    } else if (sortBy === 'lowestPrice') {
      orderBy.price = 'asc';
    }

    const { page, pageSize } = req.query;
    const { skip, take } = pagination(parseInt(page as string), parseInt(pageSize as string));

    const transactions = await prisma.transactions.findMany({
      where: {
        event: {
          organizerId: organizerId as string
        }
      },
      orderBy,
      skip,
      take,
    });
    res.json(transactions);

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Transaction ID is required.' });
    }

    await prisma.transactions.delete({
      where: {
        id: id as string
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export default {
  addTransaction,
  getAllTransactionsParticipant,
  getAllTransactionsOrganizer,
  deleteTransaction
};