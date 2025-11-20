import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequeset";
import { DoctorValidation } from "./doctor.validation";

const router = Router();

router.get(
    "/",
    DoctorController.getAllFromDB
);

router.get(
    '/:id',
    DoctorController.getByIdFromDB
);

router.post(
    "/suggestion",
    DoctorController.getAISuggestions
);

router.patch(
    "/:id",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    validateRequest(DoctorValidation.update),
    DoctorController.updateIntoDB
)


router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    DoctorController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN),
    DoctorController.softDelete);

export const DoctorRoutes = router;