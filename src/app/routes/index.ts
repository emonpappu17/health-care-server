import express from 'express';
import { userRoutes } from '../module/user/user.routes';
import { authRoutes } from '../module/auth/auth.routes';
import { ScheduleRoutes } from '../module/schedule/schedule.routes';
import { doctorScheduleRoutes } from '../module/doctorSchedule/doctorSchedule.routes';
import { SpecialtiesRoutes } from '../module/specialities/specialities.routes';
import { DoctorRoutes } from '../module/doctor/doctor.route';
import { AppointmentRoutes } from '../module/appointment/appointment.routes';
import { PrescriptionRoutes } from '../module/prescription/prescription.routes';
import { ReviewRoutes } from '../module/review/review.routes';
import { PatientRoutes } from '../module/patient/patient.routes';
import { MetaRoutes } from '../module/meta/meta.routes';
import { AdminRoutes } from '../module/admin/admin.routes';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/schedule',
        route: ScheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },
    {
        path: '/appointment',
        route: AppointmentRoutes
    },
    {
        path: '/prescription',
        route: PrescriptionRoutes
    },
    {
        path: '/review',
        route: ReviewRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
    {
        path: '/metadata',
        route: MetaRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router; 