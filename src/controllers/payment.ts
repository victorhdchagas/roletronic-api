import { PrismaClient, Payment as PrismaPayment } from '../../prisma/.prisma/prismaclient'
import { ContextType as Context, ContextType, CreateContext } from "../context"
import { z } from 'zod'

const prisma = new PrismaClient()

const paymentSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3).max(100),
    description: z.string().min(5).max(100),
})

class Payment {
    async create(payment: z.infer<typeof paymentSchema>, ctx: Context): Promise<PrismaPayment> {
        const validatedData = paymentSchema.parse(payment);
        ctx.prisma.payment.create({ data: validatedData })
        return await { id: 1 };
    }
}

export default Payment;