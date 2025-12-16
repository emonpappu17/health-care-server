// import { Router } from "express";
// import { AppointmentController } from "./appointment.controller";
// import auth from "../../middlewares/auth";
// import { UserRole } from "@prisma/client";
// import validateRequest from "../../middlewares/validateRequeset";
// import { AppointmentValidation } from "./appointment.validation";

// const router = Router();

// router.get(
//     '/',
//     auth(UserRole.ADMIN),
//     AppointmentController.getAllFromDB
// );

// router.get(
//     "/my-appointments",
//     auth(UserRole.PATIENT, UserRole.DOCTOR),
//     AppointmentController.getMyAppointment
// )


// router.post(
//     "/",
//     auth(UserRole.PATIENT),
//     validateRequest(AppointmentValidation.createAppointment),
//     AppointmentController.createAppointment,
// )

// router.patch(
//     "/status/:id",
//     auth(UserRole.ADMIN, UserRole.DOCTOR),
//     AppointmentController.updateAppointmentStatus,
// )

// export const AppointmentRoutes = router;



import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
// import { paymentLimiter } from '../../middlewares/rateLimiter';
// import validateRequest from '../../middlewares/validateRequest';
import { AppointmentController } from './appointment.controller';
import { AppointmentValidation } from './appointment.validation';
import validateRequest from '../../middlewares/validateRequeset';

const router = express.Router();

/**
 * ENDPOINT: /appointment/
 * 
 * Get all appointment with filtering
 * Only accessable for Admin & Super Admin
 */
router.get(
    '/',
    auth(UserRole.ADMIN),
    AppointmentController.getAllFromDB
);

router.get(
    '/my-appointment',
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
)

router.post(
    '/',
    auth(UserRole.PATIENT),
    // paymentLimiter,
    validateRequest(AppointmentValidation.createAppointment),
    AppointmentController.createAppointment
);

// router.post(
//     '/pay-later',
//     auth(UserRole.PATIENT),
//     validateRequest(AppointmentValidation.createAppointment),
//     AppointmentController.createAppointmentWithPayLater
// );

router.post(
    '/:id/initiate-payment',
    auth(UserRole.PATIENT),
    // paymentLimiter,
    AppointmentController.initiatePayment
);

// router.patch(
//     '/status/:id',
//     auth(UserRole.ADMIN, UserRole.DOCTOR),
//     AppointmentController.changeAppointmentStatus
// );

// router.post(
//     '/pay-later',
//     auth(UserRole.PATIENT),
//     AppointmentController.createAppointmentWithPayLater
// );


export const AppointmentRoutes = router;