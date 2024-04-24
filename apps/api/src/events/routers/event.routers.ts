
import express from 'express'
import postEventsController from '../controllers/post.events.controller';
import getEventsController from '../controllers/get.events.controller';
import deleteEventsController from '../controllers/delete.events.controller';
import patchEventsController from '../controllers/patch.events.controller'
const router = express.Router();

// ROUTER MASIH BELUM YA YG METHOD POST /PATCH EVENT
router.post('/event', postEventsController.createEvent);
// router.post('/:id', postEventsController.createEventImages);
// router.post('/schedule', postEventsController.createEventSchedule);
// router.post('/categories', postEventsController.createCategoriesTicket);

router.get('/search', getEventsController.getAllEventsByQuery);
router.get('/category', getEventsController.getEventsByCategory);
router.get('/today', getEventsController.getEventsToday);
router.get('/tommorow', getEventsController.getEventsTommorow);
router.get('/thisWeek', getEventsController.getEventsThisWeek);
router.get('/free', getEventsController.getFreeEvents);
router.get('/hot', getEventsController.getHotEvents);

router.patch('/:eventId/', patchEventsController.updateEvent);
router.patch('/:category/:Id', patchEventsController.updateCategoriesTicket);
router.patch('/:imageId', patchEventsController.updateEventImage);
router.patch('/schedule/:scheduleId', patchEventsController.updateEventSchedule);

router.delete('/images/:eventId/:imageId', deleteEventsController.deleteEventImage);
router.delete('/categories/:id', deleteEventsController.deleteCategoriesTicket);
router.delete('/schedules/:id', deleteEventsController.deleteEventSchedule);
router.delete('/:id', deleteEventsController.deleteEvent);

export { router as eventRouter };