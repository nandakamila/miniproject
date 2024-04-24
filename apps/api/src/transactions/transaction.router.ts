import express from 'express';
import transactionController from './transaction.controller';

const router = express.Router();

router.post('/', transactionController.addTransaction);
router.get('/participant', transactionController.getAllTransactionsParticipant);
router.get('/organizer', transactionController.getAllTransactionsOrganizer);
router.delete('/:id', transactionController.deleteTransaction);

export { router as transactionRouter }