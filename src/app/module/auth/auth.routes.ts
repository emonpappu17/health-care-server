import { Router } from "express";
import { AuthController } from "./auth.controller";
// import { UserController } from "./user.controller";
// import { UserValidation } from "./user.validation";

const router = Router();

router.post(
    "/login",
    AuthController.login
)

export const authRoutes = router