import { PrismaClient, Group as PrismaGroup, Permission as PrismaPermission } from '../../prisma/.prisma/prismaclient'
import { z } from 'zod'

const prisma = new PrismaClient()

const groupSchema = z.object({
  name: z.string()
})
const permissionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3).max(100),
  description: z.string().min(5).max(100),
})

class Group {
  async createGroup(data: z.infer<typeof groupSchema>): Promise<PrismaGroup> {
    const validatedData = groupSchema.parse(data)
    const group = await prisma.group.create({
      data: validatedData,
    })
    return group
  }

  async createPermission(data: z.infer<typeof permissionSchema>): Promise<PrismaPermission> {
    const validatedData = permissionSchema.parse(data)
    const Permission = await prisma.permission.create({
      data: validatedData,
    })
    return Permission
  }

  async associatePerms(groupId: number, permissionId: number): Promise<any> {
    const Permission = await prisma.group.update({
      where: { id: groupId },
      data: {
        permissions: {
          connect: {
            id: permissionId
          }
        }
      }
    });
    return Permission
  }
}

export default Group;