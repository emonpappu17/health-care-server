import { Doctor, Prisma, UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { extractJsonFromMessage } from "../../helper/extractJsonFromMessage";
import { openai } from "../../helper/open-router";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorFilterRequest, IDoctorUpdate } from "./doctor.interface";
import { IPaginationOptions } from "../../types/pagination";

// const getAllFromDB = async (filters: any, options: IOptions) => {
//     const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
//     const { searchTerm, specialties, ...filterData } = filters;

//     // console.log({ page, limit, skip, sortBy, sortOrder });
//     // console.log({ filters });

//     const andCondition: Prisma.DoctorWhereInput[] = [];

//     if (searchTerm) {
//         andCondition.push({
//             OR: doctorSearchableFields.map((field) => ({
//                 [field]: {
//                     contains: searchTerm,
//                     mode: "insensitive"
//                 }
//             }))
//         })
//     }

//     // "", "medicine"
//     if (specialties && specialties.length > 0) {
//         const specialtiesArray = Array.isArray(specialties) ? specialties : [specialties];

//         andCondition.push({
//             doctorSpecialties: {
//                 some: {
//                     specialities: {
//                         title: {
//                             in: specialtiesArray,
//                             mode: "insensitive"
//                         }
//                     }
//                 }
//             }
//         })
//     }

//     if (Object.keys(filterData).length > 0) {
//         const filerCondition = Object.keys(filterData).map((key) => ({
//             [key]: {
//                 equals: (filterData as any)[key]
//             }
//         }))

//         andCondition.push(...filerCondition)
//     }

//     andCondition.push({
//         isDeleted: false
//     })

//     const whereConditions: Prisma.DoctorWhereInput = andCondition.length > 0 ? { AND: andCondition } : {};

//     const result = await prisma.doctor.findMany({
//         where: whereConditions,
//         skip,
//         take: limit,
//         orderBy:
//             options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { averageRating: "desc" }
//         ,
//         include: {
//             doctorSpecialties: {
//                 include: {
//                     specialities: {
//                         select: {
//                             title: true
//                         }
//                     }
//                 }
//             },
//             reviews: {
//                 select: {
//                     rating: true
//                 }
//             }
//         }
//     })

//     const total = await prisma.doctor.count({
//         where: whereConditions
//     })

//     return {
//         meta: {
//             total,
//             page,
//             limit
//         },
//         data: result
//     }
// };

// const updateIntoDB = async (id: string, payload: Partial<any>) => {
//     const { specialties, removeSpecialties, ...doctorData } = payload;

//     const doctorInfo = await prisma.doctor.findUniqueOrThrow({
//         where: {
//             id,
//             isDeleted: false
//         }
//     })

//     // const { specialties, ...doctorData } = payload;
//     // console.log(payload);

//     return await prisma.$transaction(async (tnx) => {
//         if (Object.keys(doctorData).length > 0) {
//             await tnx.doctor.update({
//                 where: {
//                     id
//                 },
//                 data: doctorData
//             })
//         }

//         if (removeSpecialties && Array.isArray(removeSpecialties) && removeSpecialties.length > 0) {
//             const existingDoctorSpecialties = await tnx.doctorSpecialties.findMany({
//                 where: {
//                     doctorId: doctorInfo.id,
//                     specialitiesId: {
//                         in: removeSpecialties
//                     }
//                 }
//             });

//             if (existingDoctorSpecialties.length !== removeSpecialties.length) {
//                 const foundIds = existingDoctorSpecialties.map(
//                     (ds) => ds.specialitiesId
//                 );

//                 const notFound = removeSpecialties.filter(
//                     (id) => !foundIds.includes(id)
//                 );

//                 throw new Error(`Can not remove non-existing specialties IDs: ${notFound.join(", ")}`);
//             }

//             await tnx.doctorSpecialties.deleteMany({
//                 where: {
//                     doctorId: doctorInfo.id,
//                     specialitiesId: {
//                         in: removeSpecialties
//                     }
//                 }
//             })
//         }

//         if (specialties && Array.isArray(specialties) && specialties.length > 0) {
//             const existingSpecialties = await tnx.specialties.findMany({
//                 where: {
//                     id: {
//                         in: specialties
//                     }
//                 },
//                 select: {
//                     id: true
//                 }
//             });

//             const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
//             const invalidSpecialties = specialties.filter((id) => !existingSpecialtyIds.includes(id));

//             if(invalidSpecialties.length > 0) {
//                 throw new Error(`Invalid specialties IDs: ${invalidSpecialties.join(", ")}`);
//         }

//         // if (specialties && specialties.length > 0) {
//         //     const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

//         //     for (const specialty of deleteSpecialtyIds) {
//         //         await tnx.doctorSpecialties.deleteMany({
//         //             where: {
//         //                 doctorId: id,
//         //                 specialitiesId: specialty.specialtyId
//         //             }
//         //         })
//         //     }

//         //     const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

//         //     console.log({ createSpecialtyIds });

//         //     for (const specialty of createSpecialtyIds) {
//         //         await tnx.doctorSpecialties.create({
//         //             data: {
//         //                 doctorId: id,
//         //                 specialitiesId: specialty.specialtyId
//         //             }
//         //         })
//         //     }
//         // }

//         const updatedData = await tnx.doctor.update({
//             where: {
//                 id: doctorInfo.id
//             },
//             data: doctorData,
//             include: {
//                 doctorSpecialties: {
//                     include: {
//                         specialities: true
//                     }
//                 }
//             }
//         })

//         // doctor -> doctorSpecialties -> specialties

//         return updatedData
//     })
// };

const getAllFromDB = async (
    filters: IDoctorFilterRequest,
    options: IPaginationOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // doctor > doctorSpecialties > specialties -> title
    // Handle multiple specialties: ?specialties=Cardiology&specialties=Neurology
    if (specialties && specialties.length > 0) {
        // Convert to array if single string
        const specialtiesArray = Array.isArray(specialties) ? specialties : [specialties];

        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            in: specialtiesArray,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { averageRating: "desc" },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: {
                        select: {
                            title: true,
                        }
                    },
                },
            },
            reviews: {
                select: {
                    rating: true,
                },
            },
        },
    });

    // console.log(result[0].doctorSpecialties);

    const total = await prisma.doctor.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

// const updateIntoDB = async (id: string, payload: IDoctorUpdate) => {
//     const { specialties, removeSpecialties, ...doctorData } = payload;

//     const doctorInfo = await prisma.doctor.findUniqueOrThrow({
//         where: {
//             id,
//             isDeleted: false,
//         },
//     });

//     await prisma.$transaction(async (transactionClient) => {
//         // Step 1: Update doctor basic data
//         if (Object.keys(doctorData).length > 0) {
//             await transactionClient.doctor.update({
//                 where: {
//                     id,
//                 },
//                 data: doctorData,
//             });
//         }

//         // Step 2: Remove specialties if provided
//         if (
//             removeSpecialties &&
//             Array.isArray(removeSpecialties) &&
//             removeSpecialties.length > 0
//         ) {
//             // Validate that specialties to remove exist for this doctor
//             const existingDoctorSpecialties =
//                 await transactionClient.doctorSpecialties.findMany({
//                     where: {
//                         doctorId: doctorInfo.id,
//                         specialitiesId: {
//                             in: removeSpecialties,
//                         },
//                     },
//                 });

//             if (existingDoctorSpecialties.length !== removeSpecialties.length) {
//                 const foundIds = existingDoctorSpecialties.map(
//                     (ds) => ds.specialitiesId
//                 );
//                 const notFound = removeSpecialties.filter(
//                     (id) => !foundIds.includes(id)
//                 );
//                 throw new Error(
//                     `Cannot remove non-existent specialties: ${notFound.join(", ")}`
//                 );
//             }

//             // Delete the specialties
//             await transactionClient.doctorSpecialties.deleteMany({
//                 where: {
//                     doctorId: doctorInfo.id,
//                     specialitiesId: {
//                         in: removeSpecialties,
//                     },
//                 },
//             });
//         }

//         // Step 3: Add new specialties if provided
//         if (specialties && Array.isArray(specialties) && specialties.length > 0) {
//             // Verify all specialties exist in Specialties table
//             const existingSpecialties = await transactionClient.specialties.findMany({
//                 where: {
//                     id: {
//                         in: specialties,
//                     },
//                 },
//                 select: {
//                     id: true,
//                 },
//             });

//             const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
//             const invalidSpecialties = specialties.filter(
//                 (id) => !existingSpecialtyIds.includes(id)
//             );

//             if (invalidSpecialties.length > 0) {
//                 throw new Error(
//                     `Invalid specialty IDs: ${invalidSpecialties.join(", ")}`
//                 );
//             }

//             // Check for duplicates - don't add specialties that already exist
//             const currentDoctorSpecialties =
//                 await transactionClient.doctorSpecialties.findMany({
//                     where: {
//                         doctorId: doctorInfo.id,
//                         specialitiesId: {
//                             in: specialties,
//                         },
//                     },
//                     select: {
//                         specialitiesId: true,
//                     },
//                 });

//             const currentSpecialtyIds = currentDoctorSpecialties.map(
//                 (ds) => ds.specialitiesId
//             );
//             const newSpecialties = specialties.filter(
//                 (id) => !currentSpecialtyIds.includes(id)
//             );

//             // Only create new specialties that don't already exist
//             if (newSpecialties.length > 0) {
//                 const doctorSpecialtiesData = newSpecialties.map((specialtyId) => ({
//                     doctorId: doctorInfo.id,
//                     specialitiesId: specialtyId,
//                 }));

//                 await transactionClient.doctorSpecialties.createMany({
//                     data: doctorSpecialtiesData,
//                 });
//             }
//         }
//     });

//     // Step 4: Return updated doctor with specialties
//     const result = await prisma.doctor.findUnique({
//         where: {
//             id: doctorInfo.id,
//         },
//         include: {
//             doctorSpecialties: {
//                 include: {
//                     specialities: true,
//                 },
//             },
//         },
//     });

//     return result;
// };



const updateIntoDB = async (id: string, payload: IDoctorUpdate) => {
    const { specialties, removeSpecialties, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });

    await prisma.$transaction(async (transactionClient) => {
        // Step 1: Update doctor basic data
        if (Object.keys(doctorData).length > 0) {
            await transactionClient.doctor.update({
                where: {
                    id,
                },
                data: doctorData,
            });
        }

        // Step 2: Remove specialties if provided
        if (
            removeSpecialties &&
            Array.isArray(removeSpecialties) &&
            removeSpecialties.length > 0
        ) {
            // Validate that specialties to remove exist for this doctor
            const existingDoctorSpecialties =
                await transactionClient.doctorSpecialties.findMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: {
                            in: removeSpecialties,
                        },
                    },
                });

            if (existingDoctorSpecialties.length !== removeSpecialties.length) {
                const foundIds = existingDoctorSpecialties.map(
                    (ds) => ds.specialitiesId
                );
                const notFound = removeSpecialties.filter(
                    (id) => !foundIds.includes(id)
                );
                throw new Error(
                    `Cannot remove non-existent specialties: ${notFound.join(", ")}`
                );
            }

            // Delete the specialties
            await transactionClient.doctorSpecialties.deleteMany({
                where: {
                    doctorId: doctorInfo.id,
                    specialitiesId: {
                        in: removeSpecialties,
                    },
                },
            });
        }

        // Step 3: Add new specialties if provided
        if (specialties && Array.isArray(specialties) && specialties.length > 0) {
            // Verify all specialties exist in Specialties table
            const existingSpecialties = await transactionClient.specialties.findMany({
                where: {
                    id: {
                        in: specialties,
                    },
                },
                select: {
                    id: true,
                },
            });

            const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
            const invalidSpecialties = specialties.filter(
                (id) => !existingSpecialtyIds.includes(id)
            );

            if (invalidSpecialties.length > 0) {
                throw new Error(
                    `Invalid specialty IDs: ${invalidSpecialties.join(", ")}`
                );
            }

            // Check for duplicates - don't add specialties that already exist
            const currentDoctorSpecialties =
                await transactionClient.doctorSpecialties.findMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: {
                            in: specialties,
                        },
                    },
                    select: {
                        specialitiesId: true,
                    },
                });

            const currentSpecialtyIds = currentDoctorSpecialties.map(
                (ds) => ds.specialitiesId
            );
            const newSpecialties = specialties.filter(
                (id) => !currentSpecialtyIds.includes(id)
            );

            // Only create new specialties that don't already exist
            if (newSpecialties.length > 0) {
                const doctorSpecialtiesData = newSpecialties.map((specialtyId) => ({
                    doctorId: doctorInfo.id,
                    specialitiesId: specialtyId,
                }));

                await transactionClient.doctorSpecialties.createMany({
                    data: doctorSpecialtiesData,
                });
            }
        }
    });

    // Step 4: Return updated doctor with specialties
    const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
        },
    });

    return result;
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            reviews: true
        },
    });
    return result;
};

const getAISuggestions = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "symptoms is required!")
    };

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    console.log("doctors data loaded.......\n");
    const prompt = `
You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data. 
`;

    console.log("analyzing......\n")
    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful AI medical assistant that provides doctor suggestions.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const result = await extractJsonFromMessage(completion.choices[0].message)
    return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });

        return deleteDoctor;
    });
};

const softDelete = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deleteDoctor;
    });
};

export const DoctorService = {
    getAllFromDB,
    updateIntoDB,
    getAISuggestions,
    getByIdFromDB,
    deleteFromDB,
    softDelete
}