
import express from 'express';
import favoriteController from './favorites.controller';
const router = express.Router();

router.post('/', favoriteController.addFavorite);
router.get('/', favoriteController.getAllFavorite);
router.delete('/:id', favoriteController.deleteFavorite);

export { router as favoriteRouter };