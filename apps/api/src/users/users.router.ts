
import express from 'express'
import userController from './users.controller';
const router = express.Router();

router.get('/register', userController.register);
router.get('/login', userController.login);

router.post('/refresh-token', userController.getRefreshToken);
router.get('/revoke-token', userController.revokeRefreshToken);

router.patch('/organizer', userController.updateOrganizer);
router.patch('/participant', userController.updateParticipant);
router.patch('/', userController.updateUser);

export { router as userRouter };