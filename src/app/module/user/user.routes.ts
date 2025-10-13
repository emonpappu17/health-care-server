import { NextFunction, Request, Response, Router } from "express";
import { filUploader } from "../../helper/fileUploader";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

router.post(
    "/create-patient",
    filUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction,) => {
        req.body = UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data));
        return UserController.createPatient(req, res, next)
    },
)

export const userRoutes = router