import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../helper/fileUploader';
import { SpecialtiesController } from './specialities.controller';
import { SpecialtiesValidation } from './specialities.validation';

const router = express.Router();

router.get(
    '/',
    SpecialtiesController.getAllFromDB
);

router.post(
    '/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data))
        return SpecialtiesController.insertIntoDB(req, res, next)
    }
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.ADMIN),
    SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;