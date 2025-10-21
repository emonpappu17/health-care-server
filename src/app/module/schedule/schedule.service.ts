import { addMinutes, addHours, format } from "date-fns";

const insertIntoDB = async (payload: any) => {
    const { startTime, endTime, startDate, endDate } = payload
    const intervalTime = 30;

    const currentDate = new Date(startDate)
    const lastDate = new Date(endDate)

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-mm-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startDate.split(":")[1])
            )
        )
        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(lastDate, "yyyy-mm-dd")}`,
                    Number(endTime.split(":")[0]) // 11:00
                ),
                Number(endTime.split(":")[1])
            )
        )
    }

    return payload;
}

export const ScheduleService = {
    insertIntoDB
}