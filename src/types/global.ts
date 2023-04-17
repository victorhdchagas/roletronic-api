import { z } from 'zod'


import { Request } from "express";
import { IUserTokenPayload } from "../lib/tokenFactory";
import { PlanDuration } from '../../prisma/.prisma/prismaclient';
export interface MyRequest extends Request {
    permissions?: string[];
    user?: IUserTokenPayload
}
const RoleProductZodObject = z.object({
    id: z.number().optional(),
    name: z.string().min(3).max(100),
    description: z.string().min(5).max(1000),
})

const PlanRuleZodObject = z.object({
    id: z.number().optional(),
    description: z.string().min(5).max(200),
    planId: z.number().gte(0, "ID inválido"),
})

const PlanZodObject = z.object({
    id: z.number().optional(),
    name: z.string().min(3).max(100),
    description: z.string().min(5).max(1000),
    roleProductId: z.number().gte(0, "ID inválido"),
    duration: z.nativeEnum(PlanDuration).optional(),
    deativateAt: z.date().optional()
})


export const RolePlanSchema = () => PlanZodObject
export const RoleProductSchema = () => RoleProductZodObject
export const RolePlanRuleSchema = () => PlanRuleZodObject

export type RolePlanType = z.infer<typeof PlanZodObject>
export type RoleProductType = z.infer<typeof RoleProductZodObject>
export type RolePlanRuleType = z.infer<typeof PlanRuleZodObject>