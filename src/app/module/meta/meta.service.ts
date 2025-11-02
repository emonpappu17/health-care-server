import { UserRole } from "@prisma/client";
import { IJWTPayload } from "../../types/common"
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status"

const fetchDashboardMetaData = async (user: IJWTPayload) => {
    let metadata;
    switch (user.role) {
        case UserRole.ADMIN:
            metadata = "Admin metadata"
            break;
        case UserRole.PATIENT:
            metadata = "Patient metadata"
            break;
        case UserRole.DOCTOR:
            metadata = "Doctor metadata"
            break
        default:
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user role!");
    }

    return metadata
}

export const MetaService = {
    fetchDashboardMetaData
}