import { Prisma } from "../../prisma/.prisma/prismaclient";
import bcrypt from 'bcrypt'
export async function hashPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash
}
export async function hashPasswordMiddleware(params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) {

    if (params.model === "User" && params.action === "create") {
        const hash = await hashPassword(params.args.data.password)
        params.args.data.password = hash;
    }
    const result = await next(params)

    return result
}