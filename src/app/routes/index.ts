import express from 'express';
import { userRoutes } from '../module/user/user.routes';


const router = express.Router();

const moduleRoutes = [
    // {
    //     path: '/',
    //     route: router
    // },
    {
        path: '/user',
        route: userRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router; 