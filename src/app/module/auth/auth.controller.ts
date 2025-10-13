
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
// import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    // console.log(req.);
    const { accessToken, refreshToken, needPasswordChange } = result;

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000 // 1 hour
    })

    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000 * 24 * 90 // 90 days
    })

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User login successfully",
        data: {
            needPasswordChange
        }
    })
})

export const AuthController = {
    login
}