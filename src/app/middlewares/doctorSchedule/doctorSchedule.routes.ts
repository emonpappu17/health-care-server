import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB
)


export const doctorScheduleRoutes = router;