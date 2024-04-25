
import express from 'express';
import getUserController from './controllers/get.users.controller';
import postUserController from './controllers/post.users.controller';
import patchUserController from './controllers/patch.users.controller';

const router = express.Router();

router.get('/:id', getUserController.findUserById);
router.get('/participant/:id', getUserController.findParticipantById);
router.get('/organizer/:id', getUserController.findOrganizerById);

router.post('/register', postUserController.register);
router.post('/login', postUserController.login);

router.patch('/:id', patchUserController.updateUser);
router.patch('/organizer/:id', patchUserController.updateOrganizer);
router.patch('/participant/:id', patchUserController.updateParticipant);

export { router as userRouter };