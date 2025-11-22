import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AdminController } from "./admin.controller";

const router = Router();

router.get(
    "/",
    auth(UserRole.ADMIN),
    AdminController.getAllFromDB
)


export const AdminRoutes = router;