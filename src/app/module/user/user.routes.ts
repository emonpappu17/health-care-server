import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
// import { UserValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";

const router = Router();

router.get(
    "/",
    auth(UserRole.ADMIN),
    UserController.getAllFromDB
)

router.get(
    "/me",
    auth(UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
    UserController.getMyProfile
)

router.post(
    "/create-patient",
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction,) => {
        req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
        return UserController.createPatient(req, res, next)
    },
)

router.post(
    "/create-admin",
    auth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    }
);

router.post(
    "/create-doctor",
    auth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        // console.log(JSON.parse(req.body.data))
        req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
        return UserController.createDoctor(req, res, next)
    }
);

router.patch(
    '/:id/status',
    auth(UserRole.ADMIN),
    UserController.changeProfileStatus
);

router.patch(
    "/update-my-profile",
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return UserController.updateMyProfile(req, res, next)
    }
);


export const userRoutes = router