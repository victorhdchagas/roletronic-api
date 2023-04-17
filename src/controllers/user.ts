// import { PrismaClient, User as PrismaUser } from '@prisma/client'
// import {PrismaClient, User as PrismaUser} from "../../prisma/.prisma/prismaclient"

import { z } from 'zod'
import type { ContextType as Context } from "../context"
import bcrypt from "bcrypt"
import { SafetyRequestType, UserSafetyRequest } from '../../prisma/.prisma/prismaclient'
import moment from 'moment'

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  avatar: z.string(),
  email: z.string().email().transform((text) => text.toLowerCase()),
  login: z.string().transform((text) => text.toLowerCase()),
  validatedUser: z.boolean().default(false),
  password: z.string(),
})

const userSchemaUpdateData = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  email: z.string().email().transform((text) => text.toLowerCase()).optional(),
  login: z.string().transform((text) => text.toLowerCase()).optional(),
  validatedUser: z.boolean().optional(),
  password: z.string().optional(),
})


function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key]
  }
  return user
}
type userType = z.infer<typeof userSchema>;
type IAuthResponse = {
  id: string;
  result: boolean;
  name: string,
  email: string,
  login: string,
  avatar: string,
  plan: boolean | null
}
class User {

  async auth(data: z.infer<typeof userSchema>, ctx: Context): Promise<IAuthResponse | null> {

    const where = {
      // password:data.password,
      ...(data.email && { email: data.email }),
      ...(data.login && { login: data.login }),
    }
    try {
      const user = await ctx.prisma.user.findFirstOrThrow({
        where
      });
      if (await bcrypt.compareSync(data.password, user.password)) {
        // await ctx.prisma.$disconnect()
        return { login: user.login, name: user.name, result: true, id: user.id, plan: user.plan, email: data.email, avatar: data.avatar }
      }
      else return null;

    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async create(data: z.infer<typeof userSchema>, ctx: Context): Promise<Partial<userType>> {
    const validatedData = userSchema.parse(data);
    const someoneFound = await ctx.prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { login: validatedData.login }
        ]
      }
    });

    if (someoneFound) {
      throw Error("Alguém ja esta utilizando esse e-mail ou Login.")
    }

    let toReturn: Partial<userType> = await ctx.prisma.user.create({
      data: validatedData,
    });
    exclude(toReturn, ['password'])
    return toReturn;

  }

  async searchOneByParams(where: z.infer<typeof userSchemaUpdateData>, ctx: Context) {
    return await ctx.prisma.user.findFirst({
      where
    });
  }


  async searchAll(ctx: Context): Promise<userType[]> {
    return await ctx.prisma.user.findMany();
  }

  async update(
    id: string,
    data: z.infer<typeof userSchemaUpdateData>,
    ctx: Context
  ): Promise<userType | null> {
    const validatedData = userSchemaUpdateData.parse(data)
    const usuario = await ctx.prisma.user.update({
      where: { id },
      data: validatedData,
    })
    return usuario
  }

  async updateByEmail(
    email: string,
    data: z.infer<typeof userSchemaUpdateData>,
    ctx: Context
  ): Promise<userType | null> {
    const validatedData = userSchema.parse(data)
    const usuario = await ctx.prisma.user.update({
      where: { email },
      data: validatedData,
    })
    return usuario
  }

  async createSafetyRequest(userId: string, type: SafetyRequestType, { prisma }: Context) {
    const today = moment();
    const tomorrow = today.clone().add(30, 'minutes');
    return prisma.userSafetyRequest.create({
      data: {
        userId: userId,
        endAt: tomorrow.toDate(),
        RequestType: type
      }
    })
  }

  async updateSafetyRequest(id: string, { prisma }: Context) {
    const safetyRequest = await prisma.userSafetyRequest.findFirst({ where: { id, confirm: false } });
    if (!safetyRequest) return null;
    if (new Date() < safetyRequest.endAt) {
      return prisma.userSafetyRequest.update({
        where: { id },
        data: {
          confirm: true
        }
      })
    } return false
  }

  async checkUserInPlan({ id: userId, planId }: { id: string, planId: number }, { prisma }: Context) {
    return await prisma.userPlan.findFirst({
      where: {
        userId, planId
      }
    })
  }

  async associatePlan({ id, planId }: { id: string, planId: number }, { prisma }: Context) {
    const userInPlan = await this.checkUserInPlan({ id, planId }, { prisma });
    if (!!userInPlan) {
      throw { status: "notOK", message: "User already registered on this plan." }
    }
    return prisma.userPlan.create({
      data: {
        userId: id,
        planId,
      }
    })

  }
}

export default User;