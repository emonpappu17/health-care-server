import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.get("/", ScheduleController.schedulesForDoctor)
router.post("/", ScheduleController.insertIntoDB)

export const scheduleRoutes = router;