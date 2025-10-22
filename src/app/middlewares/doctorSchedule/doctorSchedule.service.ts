import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";

const insertIntoDB = async (user: IJWTPayload, payload: {
    scheduleIds: string[]
}) => {
    // console.log({ user, payload });
    const doctorData = await prisma.doctor.findFirstOrThrow({
        where: {
            email: user.email
        }
    })

    const doctorScheduleData = payload?.scheduleIds?.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }))

    // console.log(doctorScheduleData);

    return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })

    // return { user, payload };
}

export const DoctorScheduleService = {
    insertIntoDB
} 