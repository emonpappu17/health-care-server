import { Doctor, Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper"
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    console.log({ page, limit, skip, sortBy, sortOrder });
    console.log({ filters });

    const andCondition: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andCondition.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filerCondition = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andCondition.push(...filerCondition)
    }

    const whereConditions: Prisma.DoctorWhereInput = andCondition.length > 0 ? { AND: andCondition } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.doctor.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const updateIntoDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    })

    const { specialties, ...doctorData } = payload;

    if (specialties && specialties.length > 0) {

    }

    const updatedData = await prisma.doctor.update({
        where: {
            id: doctorInfo.id
        },
        data: doctorData
    })

    return updatedData
}

export const DoctorService = {
    getAllFromDB,
    updateIntoDB
}