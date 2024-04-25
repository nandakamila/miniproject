
import express from 'express';
import reviewController from './review.controller';

const router = express.Router();

router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.addReview);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export { router as reviewRouter };