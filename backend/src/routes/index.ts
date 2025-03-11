import { Router } from 'express';
import appointmentRoutes from './appointmentRoutes';
import queueRoutes from './queueRoutes';

const router = Router();

router.use('/appointments', appointmentRoutes);
router.use('/queue', queueRoutes);

export default router; 