import { Gender } from "@prisma/client";

export type IDoctorUpdateInput = {
    name: string;
    email: string;
    profilePhoto: string | null;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experience: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    specialties: {
        specialtyId: string,
        isDeleted?: boolean
    }[]
}