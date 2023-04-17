import { RoleProduct as PrismaRoleProduct } from '../../prisma/.prisma/prismaclient'
import { ContextType as Context, ContextType, CreateContext } from "../context"
import { z } from 'zod'
import { RoleProductSchema as Schema } from '../types/global'

const RoleProductSchema = Schema()

class System {
    async createProduct(data: z.infer<typeof RoleProductSchema>, ctx: Context): Promise<PrismaRoleProduct> {
        const validatedData = RoleProductSchema.parse(data)
        const createdProduct = ctx.prisma.roleProduct.create({
            data: validatedData
        })
        return await createdProduct;
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