import express from 'express';

import technicianRoutes from '../modules/technicianManagement/routes/technician.routes';

const router = express.Router();

router.use('/technicians', technicianRoutes);

export default router;
