import { ContextType as Context } from './src/context'
import { z } from 'zod'

const CreateUser = z.object({
    name: z.string(),
    email: z.string().email().transform((text) => text.toLowerCase()),
    login: z.string().transform((text) => text.toLowerCase()),
    password: z.string(),
    groupId: z.number(),
})

export async function createUser(user: z.infer<typeof CreateUser>, ctx: Context) {

    return await ctx.prisma.user.create({
        data: user,
    })

}

interface UpdateUser {
    id: number
    name: string
    email: string
}

export async function updateUsername(user: UpdateUser, ctx: Context) {
    return await ctx.prisma.user.update({
        where: { id: user.id },
        data: user,
    })
}