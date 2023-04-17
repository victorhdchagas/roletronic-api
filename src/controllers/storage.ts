

import { z } from 'zod'
import { PrismaClient } from '../../prisma/.prisma/prismaclient';
import { ContextType as Context, ContextType, CreateContext } from "../context"

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email().transform((text) => text.toLowerCase()),
  login: z.string().transform((text) => text.toLowerCase()),
  password: z.string(),
  groupId: z.number(),
})

const productSearchParams = z.object({
  id: z.number().optional(),
  name: z.string().optional()
})
const productCreateParams = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number().min(0),
  price: z.number().min(0),
  image: z.string(),
  categoryId: z.number(),
  createdById: z.number(),
  updatedById: z.number()
})


type productSearchParams = z.infer<typeof productSearchParams>;
type productCreateParams = z.infer<typeof productCreateParams>;
class Storage {
  permissions: number[] = [];
  ctx: ContextType | null = null

  /**
   *
   */
  constructor(permissions: number[], ctx = null) {
    this.permissions = permissions;
    this.ctx = ctx;

  }

  searchCategories(categories: string[]) {

  }

  async getProductDetails(productParams: productSearchParams) {
    if (this.ctx == null) this.ctx = CreateContext();
    return this.ctx.prisma.product.findFirst({
      where: productParams
    });
  }

  async createProduct(product: productCreateParams, _ctx: ContextType | undefined) {
    const ctx = _ctx || this.ctx;
    const validatedData = productCreateParams.parse(product);
    await ctx?.prisma.product.create(
      { data: validatedData }
    )
  }

  editProduct() {

  }

}

export default Storage;