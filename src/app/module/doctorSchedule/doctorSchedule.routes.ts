import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
// import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequeset";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleValidation),
    DoctorScheduleController.insertIntoDB
)


export const doctorScheduleRoutes = router;