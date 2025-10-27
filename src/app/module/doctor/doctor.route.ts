import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get(
    "/",
    DoctorController.getAllFromDB
)
router.post(
    "/suggestion",
    DoctorController.getAISuggestions
);
router.patch(
    "/:id",
    DoctorController.updateIntoDB
)

export const DoctorRoutes = router;