import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";
import { MetaService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as IJWTPayload);


    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meta data fetched successfully!",
        data: result
    })
});

export const MetaController = {
    fetchDashboardMetaData
}