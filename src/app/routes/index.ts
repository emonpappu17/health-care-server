import express from 'express';
import { userRoutes } from '../module/user/user.routes';
import { authRoutes } from '../module/auth/auth.routes';
import { scheduleRoutes } from '../module/schedule/schedule.routes';
import { doctorScheduleRoutes } from '../middlewares/doctorSchedule/doctorSchedule.routes';


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
        route: scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router; 