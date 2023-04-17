import { RoleProduct as PrismaRoleProduct } from '../../prisma/.prisma/prismaclient'
import { ContextType as Context, ContextType, CreateContext } from "../context"
import { z } from 'zod'


const RoleProductSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3).max(100),
    description: z.string().min(5).max(100),
})

class Product {
    async create(data: z.infer<typeof RoleProductSchema>, ctx: Context): Promise<PrismaRoleProduct> {
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

export default Product;