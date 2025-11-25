import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { DoctorScheduleController } from './doctorSchedule.controller';
import { DoctorScheduleValidation } from './doctorSchedule.validation';
import validateRequest from '../../middlewares/validateRequeset';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    DoctorScheduleController.getAllFromDB
);

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
)

router.post(
    '/',
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.create),
    DoctorScheduleController.insertIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteFromDB
);


export const DoctorScheduleRoutes = router;