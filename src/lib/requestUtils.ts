import { Request } from "express";

export const checkAdm = (login: string) => {
    const ADMINUSERS: Array<string> = JSON.parse(process.env.ADMIN_USERS!)
    return ADMINUSERS.some(u => u == login);

}