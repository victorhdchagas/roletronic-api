import express, { Request } from 'express'
import User from '../controllers/user';
import { CreateContext } from '../context';
import Payment from '../controllers/payment';
import { IUserTokenPayload } from '../lib/tokenFactory';
import httpStatus from 'http-status';
import { checkAdm } from '../lib/requestUtils';
const userRouter = express.Router();


/**
 * Rota responsável pela criação de usuários.
 */
userRouter.post("/", async (req, res) => {
    const ctrl = new User();
    const ctx = CreateContext()
    const user = req.body;
    try {
        const ret = await ctrl.create(user, ctx);
        res.send(ret)
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send({ message: error.message, name: error.name, stack: error.stack })
        else
            res.status(500).send(error)
    }
});
//update user


interface MyRequest extends Request<{}, any, any, any, Record<string, any>> {
    permissions?: string[];
    user?: IUserTokenPayload
}
userRouter.put("/", async (req: MyRequest, res) => {
    const ctrl = new User();
    const ctx = CreateContext()
    const user = req.body;
    try {
        console.log('updating user', user)
        const ret = await ctrl.update(req.user!.id, user, ctx);
        res.send({ status: "ok" })
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send({ message: error.message, name: error.name, stack: error.stack })
        else
            res.status(500).send(error)
    }
});

userRouter.put("/plan", async ({ user, body: { planId } }: MyRequest, res) => {
    try {
        const ctrl = new User();
        if (!user || !planId) throw { error: "notOk", message: "You sent a wrong query." }
        const ctx = CreateContext();
        await ctrl.associatePlan({ id: user.id, planId }, ctx)
        res.json({ status: "ok" })
    } catch (error) {
        res.status(500).send(error)
    }
})



//O usuário escolhera 2 planos, pago e gratuito.
//Caso tenha escolhido pago, teremos de persistir no banco uma cobrança do usuário e enviar uma requisição ao mercadopago para gerenciar o pagamento da mesma.
// O retorno do Mercado pago será através da rota /pagamento/mp.
userRouter.post("/plan", async (req, res) => {
    const plan = req.body;
    plan.reference = `${req.body.userId}!${req.body.roleproduct}`;
    const ctx = CreateContext();
    const ctrl = new Payment();
    const toReturn = await ctrl.create(plan, ctx)
    res.send(toReturn)

})

userRouter.post("/validate/:email", async (req, res) => {
    const ctrl = new User();
    const ctx = CreateContext()
    const email = req.body;
    try {
        const ret = await ctrl.updateByEmail(email, { validatedUser: true }, ctx);
        res.send(ret)
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send({ message: error.message, name: error.name, stack: error.stack })
        else
            res.status(500).send(error)
    }
});

userRouter.get("/", async (req, res) => {
    const ctrl = new User();
    const ctx = CreateContext()
    try {

        const ret = await ctrl.searchAll(ctx);
        res.send(ret.map(a => ({ ...a, password: undefined })))
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

userRouter.get("/check", (req, res) => {
    try {
        return res.status(200).json({ status: "ok", data: checkAdm(req.user?.login) })
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send()
    }
})


export default userRouter;