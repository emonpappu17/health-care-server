import { ca } from "zod/v4/locales";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, doctorFilterableFields)

    const result = await DoctorService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully",
        meta: result.meta,
        data: result.data
    })
})

export const DoctorController = {
    getAllFromDB
}