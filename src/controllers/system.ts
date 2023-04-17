import { Plan, PlanRule, RoleProduct as PrismaRoleProduct } from '../../prisma/.prisma/prismaclient'
import { ContextType as Context, ContextType, CreateContext } from "../context"
import { RolePlanSchema as PlanSchema, RolePlanRuleType, RolePlanType, RoleProductType, RoleProductSchema as Schema } from '../types/global'

// const RoleProductSchema = Schema()

class System {
    async createProduct(data: RoleProductType, ctx: Context): Promise<PrismaRoleProduct> {
        const createdProduct = ctx.prisma.roleProduct.create({
            data: data
        })
        return await createdProduct;
    }
    async createPlan(data: RolePlanType, ctx: Context): Promise<Plan> {
        const createdPlan = ctx.prisma.plan.create({
            data: data
        })
        return await createdPlan;
    }
    async createRule(data: RolePlanRuleType, ctx: Context): Promise<PlanRule> {
        const createdRule = ctx.prisma.planRule.create({
            data: data
        })
        return await createdRule;
    }

    async get(id: number, ctx: Context) {
        return await ctx.prisma.roleProduct.findFirst({
            where: {
                id
            }
        })
    }
}

export default System;