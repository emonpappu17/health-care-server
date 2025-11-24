
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
// import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import config from "../../../config";

// const login = catchAsync(async (req: Request, res: Response) => {
//     const result = await AuthService.login(req.body);
//     // console.log(req.);
//     const { accessToken, refreshToken, needPasswordChange } = result;

//     res.cookie("accessToken", accessToken, {
//         secure: true,
//         httpOnly: true,
//         sameSite: "none",
//         maxAge: 60 * 60 * 1000 // 1 hour
//     })

//     res.cookie("refreshToken", refreshToken, {
//         secure: true,
//         httpOnly: true,
//         sameSite: "none",
//         maxAge: 60 * 60 * 1000 * 24 * 90 // 90 days
//     })

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "User login successfully",
//         data: {
//             needPasswordChange
//         }
//     })
// })

// const refreshToken = catchAsync(async (req: Request, res: Response) => {
//     const { refreshToken } = req.cookies;

//     const result = await AuthService.refreshToken(refreshToken);
//     res.cookie("accessToken", result.accessToken, {
//         secure: true,
//         httpOnly: true,
//         sameSite: "none",
//         maxAge: 1000 * 60 * 60,
//     });

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Access token generated successfully!",
//         data: {
//             message: "Access token generated successfully!",
//         },
//     });
// });

const login = catchAsync(async (req: Request, res: Response) => {
    const accessTokenExpiresIn = config.jwt.access_token_expires as string;
    const refreshTokenExpiresIn = config.jwt.refresh_token_expires as string;

    // convert accessTokenExpiresIn to milliseconds
    let accessTokenMaxAge = 0;
    const accessTokenUnit = accessTokenExpiresIn.slice(-1);
    const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
    if (accessTokenUnit === "y") {
        accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
    }
    else if (accessTokenUnit === "M") {
        accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
    }
    else if (accessTokenUnit === "w") {
        accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
    }
    else if (accessTokenUnit === "d") {
        accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "h") {
        accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
    } else if (accessTokenUnit === "m") {
        accessTokenMaxAge = accessTokenValue * 60 * 1000;
    } else if (accessTokenUnit === "s") {
        accessTokenMaxAge = accessTokenValue * 1000;
    } else {
        accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
    }

    // convert refreshTokenExpiresIn to milliseconds
    let refreshTokenMaxAge = 0;
    const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
    const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
    if (refreshTokenUnit === "y") {
        refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
    }
    else if (refreshTokenUnit === "M") {
        refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
    }
    else if (refreshTokenUnit === "w") {
        refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
    }
    else if (refreshTokenUnit === "d") {
        refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "h") {
        refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "m") {
        refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
    } else if (refreshTokenUnit === "s") {
        refreshTokenMaxAge = refreshTokenValue * 1000;
    } else {
        refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
    }
    const result = await AuthService.login(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: accessTokenMaxAge,
    });
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: refreshTokenMaxAge,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            needPasswordChange: result.needPasswordChange,
        }
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    /*
    EXPIRES_IN=7d 
  
  REFRESH_TOKEN_EXPIRES_IN=1y 
    */
    const accessTokenExpiresIn = config.jwt.access_token_expires as string;
    const refreshTokenExpiresIn = config.jwt.refresh_token_expires as string;

    // convert accessTokenExpiresIn to milliseconds
    let accessTokenMaxAge = 0;
    const accessTokenUnit = accessTokenExpiresIn.slice(-1);
    const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
    if (accessTokenUnit === "y") {
        accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
    }
    else if (accessTokenUnit === "M") {
        accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
    }
    else if (accessTokenUnit === "w") {
        accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
    }
    else if (accessTokenUnit === "d") {
        accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "h") {
        accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
    } else if (accessTokenUnit === "m") {
        accessTokenMaxAge = accessTokenValue * 60 * 1000;
    } else if (accessTokenUnit === "s") {
        accessTokenMaxAge = accessTokenValue * 1000;
    } else {
        accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
    }

    // convert refreshTokenExpiresIn to milliseconds
    let refreshTokenMaxAge = 0;
    const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
    const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
    if (refreshTokenUnit === "y") {
        refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
    }
    else if (refreshTokenUnit === "M") {
        refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
    }
    else if (refreshTokenUnit === "w") {
        refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
    }
    else if (refreshTokenUnit === "d") {
        refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "h") {
        refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "m") {
        refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
    } else if (refreshTokenUnit === "s") {
        refreshTokenMaxAge = refreshTokenValue * 1000;
    } else {
        refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
    }


    const result = await AuthService.refreshToken(refreshToken);
    res.cookie("accessToken", result.accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: accessTokenMaxAge,
    });

    res.cookie("refreshToken", result.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: refreshTokenMaxAge,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token genereated successfully!",
        data: {
            message: "Access token genereated successfully!",
        },
    });
});

const changePassword = catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
        const user = req.user;

        const result = await AuthService.changePassword(user, req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password Changed successfully",
            data: result,
        });
    }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    await AuthService.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check your email!",
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";

    await AuthService.resetPassword(token, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Reset!",
        data: null,
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const userSession = req.cookies;
    const result = await AuthService.getMe(userSession);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrive successfully!",
        data: result,
    });
});

export const AuthController = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    getMe
}