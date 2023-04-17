import express, { NextFunction, Request } from 'express'
import Group from '../controllers/group';
import jwt from 'jsonwebtoken';
import User from '../controllers/user';
import { CreateContext } from '../context';
import { TokenFactory } from '../lib/tokenFactory';
import { MailSender } from '../lib/MailSender';
import { hashPassword } from '../context/passwordMiddleware';
import { MyRequest } from '../types/global';
const securityRouter = express.Router();




/**
 * Rota responsável pela criação de Grupos e permissoes.
 */
securityRouter.post("/g", async (req, res) => {
    const ctrl = new Group();
    const group = req.body;
    try {
        const ret = await ctrl.createGroup(group);
        res.send(ret)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

/**
 * Rota responsável pela permissoes.
 */
securityRouter.post("/p", async (req, res) => {
    const ctrl = new Group();
    const group = req.body;
    try {
        const ret = await ctrl.createPermission(group);
        res.send(ret)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

/**
 * Rota responsável pela associação de usuários e permissões.
 */
securityRouter.post("/pg", async (req, res) => {
    const ctrl = new Group();
    const { groupId, permissionId } = req.body;
    try {
        const ret = await ctrl.associatePerms(groupId, permissionId);
        res.send(ret)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
});

securityRouter.get("/", async (req: MyRequest, res) => {
    const ctrl = new User();
    const tokenFactory = new TokenFactory();
    const ctx = CreateContext()
    const auth = req.body;
    try {
        const toReturn = await ctrl.searchOneByParams({ id: req.user!.id }, ctx)
        if (!toReturn) return res.send({ message: "Usuário não encontrado" })
        else return res.send({ status: "ok", data: { ...toReturn, password: undefined } })
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send({ message: error.message, name: error.name, stack: error.stack })
        else
            res.status(500).send(error)
    }
})



securityRouter.post("/auth", async (req, res) => {
    const ctrl = new User();
    const tokenFactory = new TokenFactory();
    const ctx = CreateContext()
    const auth = req.body;
    try {
        const ret = await ctrl.auth(auth, ctx);
        if (ret && ret.result) {
            const tokenPayload = { login: ret.login, name: ret.name, id: ret.id, plan: ret.plan, email: ret.email, avatar: ret.avatar }
            const token = tokenFactory.create(tokenPayload)
            return res.send({ ...tokenPayload, token })
        }
        res.send({ message: "Usuário não encontrado" })
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send({ message: error.message, name: error.name, stack: error.stack })
        else
            res.status(500).send(error)
    }
})


//Recebe Id do Safety
securityRouter.post("/password/reset", async (req, res) => {
    const ctrl = new User();
    const ctx = CreateContext()
    const { id } = req.body;
    //atualizar SafetyID, atualizarSenha, Success
    try {
        const toReturn = await ctrl.updateSafetyRequest(id, ctx);
        res.json({ status: toReturn ? "ok" : "not-ok" })

    } catch (error) {
        res.json({ error, status: "error" })

    }


});
securityRouter.post("/password/recovery", async (req, res) => {
    const ctrl = new User();
    const ctx = CreateContext()
    const user = req.body;
    try {
        const sender = new MailSender();
        const dbUser = await ctrl.searchOneByParams(user, ctx);
        if (!dbUser) return res.status(403).json({ message: "Usuário não encontrado" });
        const safetyRequest = await ctrl.createSafetyRequest(dbUser.id, "email", ctx);

        sender.sendGeneric(dbUser!.email, "Roletronic - Trocar senha", `Um usuário solicitou a troca de senha através do seu e-mail. Clique aqui para recuperar a senha: <a href="http://localhost:3000/recuperar/senha/${safetyRequest.id}">Trocar minha senha!</a>. <br/> Caso não tenha interesse em trocar sua senha, desconsidere essa mensagem.`, dbUser!.name);
        res.json("ok")
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send({ message: error.message, name: error.name, stack: error.stack })
        else
            res.status(500).send(error)
    }
});

securityRouter.post("/password/update", async (req, res) => {
    const ctrl = new User();
    const ctx = CreateContext()
    const { id, password } = req.body;
    try {
        if (!id || !password) res.status(500)
        const newPassword = await hashPassword(password);
        const dbUser = await ctrl.update(id, { password: newPassword }, ctx)

        res.json({ status: dbUser ? "ok" : "not-ok" })
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send({ message: error.message, name: error.name, stack: error.stack })
        else
            res.status(500).send(error)
    }
});

export default securityRouter;