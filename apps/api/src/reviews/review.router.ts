
import express from 'express';
import reviewController from './review.controller';

const router = express.Router();

router.post('/', reviewController.addReview);
router.get('/', reviewController.getAllReviews);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export { router as reviewRouter };