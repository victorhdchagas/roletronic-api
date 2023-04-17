import { z } from 'zod'


import { Request } from "express";
import { IUserTokenPayload } from "../lib/tokenFactory";
export interface MyRequest extends Request {
    permissions?: string[];
    user?: IUserTokenPayload
}

export const RoleProductSchema = () => z.object({
    id: z.number().optional(),
    name: z.string().min(3).max(100),
    description: z.string().min(5).max(100),
})
