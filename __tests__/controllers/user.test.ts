import User from "../../src/controllers/user";
import { MockContext, ContextType as Context, createMockContext } from '../../src/context'
import { z } from 'zod'
import { Prisma, User as ModelUser } from "../../prisma/.prisma/prismaclient";
import bcrypt from 'bcrypt';
let mockCtx: MockContext
let ctx: Context
let data: Partial<ModelUser>

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email().transform((text) => text.toLowerCase()),
  login: z.string().transform((text) => text.toLowerCase()),
  password: z.string(),
  groupId: z.number(),
})
beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
  data = {
    id: undefined,
    name: 'John Doe',
    email: 'john.doe@example.com',
    login: 'johndoe',
    password: 'password123',
    groupId: 1,
  }
})

describe("User Creation", () => {
  const userController = new User();

  it("Should be possible create an user", async () => {
    const parsedData = userSchema.parse(data);
    mockCtx.prisma.user.create.mockResolvedValue(data as ModelUser)
    const newUser = await userController.create(data as ModelUser, ctx);

    expect(newUser).toMatchObject(data);

    expect(newUser).toHaveProperty("id");
    expect(mockCtx.prisma.user.create).toHaveBeenCalledWith({ data: parsedData } as { data: z.infer<typeof userSchema> })
  });

  it("Should remove password from new User Object", async () => {
    const parsedData = userSchema.parse(data);
    mockCtx.prisma.user.create.mockResolvedValue(data as ModelUser)
    const newUser: Partial<ModelUser> = await userController.create(data as ModelUser, ctx);
    expect(newUser).not.toHaveProperty("password")
    expect(mockCtx.prisma.user.create).toHaveBeenCalledWith({ data: parsedData } as { data: z.infer<typeof userSchema> })
  });



  it("should validate unique email with throw exception", async () => {
    const newUser = Object.assign({}, data);
    newUser.name = "Lupicinio Rodrigues"
    mockCtx.prisma.user.findFirst.mockResolvedValue(data as ModelUser)
    await expect(userController.create(newUser as ModelUser, ctx)).rejects.toThrow()
  })

  it("should validate unique login throwing exception", async () => {
    const newUser = Object.assign({}, data);
    newUser.name = "Lupicinio Rodrigues"
    mockCtx.prisma.user.findFirst.mockResolvedValue(data as ModelUser)
    await expect(userController.create(newUser as ModelUser, ctx)).rejects.toThrow()
  })

});