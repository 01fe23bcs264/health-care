import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';

const router = Router();
const appointmentController = new AppointmentController();

router.post('/', appointmentController.createAppointment.bind(appointmentController));
router.put('/:appointmentId/queue-status', appointmentController.updateQueueStatus.bind(appointmentController));
router.get('/available-slots', appointmentController.getAvailableSlots.bind(appointmentController));
router.get('/patient', appointmentController.getPatientAppointments.bind(appointmentController));

export default router; 