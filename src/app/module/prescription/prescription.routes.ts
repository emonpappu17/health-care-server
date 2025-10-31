import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { PrescriptionController } from "./prescription.controller";

const router = Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    PrescriptionController.createPrescription
)


export const PrescriptionRoutes = router;