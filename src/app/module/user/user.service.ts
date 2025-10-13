import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcryptjs";

const createPatient = async (payload: createPatientInput) => {
    const hashedPassword = await bcrypt.hash(payload.password, 10)
    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashedPassword
            }
        });

        return await tnx.patient.create({
            data: {
                email: payload.email,
                name: payload.name
            }
        })
    })

    return result
}

export const UserService = {
    createPatient
}