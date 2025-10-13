import bcrypt from "bcryptjs";
import { Request } from "express";
import { filUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";

const createPatient = async (req: Request) => {
    if (req.file) {
        const uploadedResult = await filUploader.uploadToCloudinary(req.file)

        console.log({ uploadedResult });
        req.body.patient.profilePhoto = uploadedResult?.secure_url
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashedPassword
            }
        });

        return await tnx.patient.create({
            data: req.body.patient
        })
    })

    return result
}

export const UserService = {
    createPatient
}