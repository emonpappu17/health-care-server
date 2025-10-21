import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";

// const insertIntoDB = async (payload: any) => {
//     const { startTime, endTime, startDate, endDate } = payload;
//     console.log({ startTime, endTime, startDate, endDate });

//     const intervalTime = 30;

//     const schedules = [];

//     const currentDate = new Date(startDate)
//     const lastDate = new Date(endDate)

//     while (currentDate <= lastDate) {
//         const startDateTime = new Date(
//             addMinutes(
//                 addHours(
//                     `${format(currentDate, "yyyy-MM-dd")}`,
//                     Number(startTime.split(":")[0]) // 11:00
//                 ),
//                 Number(startDate.split(":")[1])
//             )
//         )
//         const endDateTime = new Date(
//             addMinutes(
//                 addHours(
//                     `${format(currentDate, "yyyy-MM-dd")}`,
//                     Number(endTime.split(":")[0]) // 11:00
//                 ),
//                 Number(endTime.split(":")[1])
//             )
//         )

//         console.log({ startDateTime, endDateTime });

//         while (startDateTime < endDateTime) {
//             const slotStartDateTime = startDateTime; // 10:00
//             const slotEndDateTime = addMinutes(startDateTime, intervalTime); // 10:30

//             const scheduleData = {
//                 startDateTime: slotStartDateTime,
//                 endDateTime: slotEndDateTime
//             }

//             console.log({ scheduleData });

//             const existingSchedule = await prisma.schedule.findFirst({
//                 where: scheduleData
//                 //  {
//                 //     startDateTime: scheduleData.startDateTime,
//                 //     endDateTime: scheduleData.endDateTime
//                 // }
//             })

//             if (!existingSchedule) {
//                 const result = await prisma.schedule.create({
//                     data: scheduleData
//                 });
//                 schedules.push(result)
//             }

//             slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime)
//         }

//         currentDate.setDate(currentDate.getDate() + 1)
//     }

//     return schedules;
// }


const insertIntoDB = async (payload: any) => {

    const { startTime, endTime, startDate, endDate } = payload;

    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startTime.split(":")[1])
            )
        )

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]) // 11:00
                ),
                Number(endTime.split(":")[1])
            )
        )

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; // 10:30
            const slotEndDateTime = addMinutes(startDateTime, intervalTime); // 11:00

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            })

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result)
            }

            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }

        currentDate.setDate(currentDate.getDate() + 1)
    }

    return schedules;
}


export const ScheduleService = {
    insertIntoDB
}