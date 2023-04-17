import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
export interface IUserTokenPayload {
    id: string,
    name: string

}
export class TokenFactory {

    create(payload: IUserTokenPayload): string {
        const token = jwt.sign(
            payload,
            process.env.JWT as string,
            {
                expiresIn: "8H",
                algorithm: "HS512"
            }
        );
        return token
    }

    validate(password: string, hash: string) {
        return bcrypt.compareSync(password, hash)
    }
}