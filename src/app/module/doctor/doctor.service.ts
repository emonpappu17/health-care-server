import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper"
import { doctorSearchableFields } from "./doctor.constant";

const getAllFromDB = async (filter: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filter;

    console.log({ page, limit, skip, sortBy, sortOrder });

    const andCondition: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        OR: doctorSearchableFields.map((field) => ({
            [field]: {
                contains: searchTerm,
                mode: "insensitive"
            }
        }))
    }

    if (Object.keys(filterData).length > 0) {
        const filerCondition = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andCondition.push(...filerCondition)
    }
}

export const DoctorService = {
    getAllFromDB
}