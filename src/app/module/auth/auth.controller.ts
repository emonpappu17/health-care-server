
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
// import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    // console.log(req.);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User login successfully",
        data: result
    })
})

export const AuthController = {
    login
}