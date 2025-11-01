import ApiError from "../../errors/ApiError";
import { IOptions } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";
import httpStatus from "http-status"

const insertIntoDB = async (user: IJWTPayload, payload: any) => {

    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });


    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    });

    if (patientData.id !== appointmentData.patientId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment")
    }

};


const getAllFromDB = async (
    filters: any,
    options: IOptions,
) => {

};

export const ReviewService = {
    insertIntoDB,
    getAllFromDB
}