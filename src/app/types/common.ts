import { UserRole } from "@prisma/client"

export type IJWTPayload = {
    email: string,
    role: UserRole
}

// import { UserRole } from "@prisma/client";

export type IAuthUser = {
    email: string;
    role: UserRole
} | null;