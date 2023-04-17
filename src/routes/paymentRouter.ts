import express, { NextFunction, Request } from 'express'
import Group from '../controllers/group';
import jwt from 'jsonwebtoken';
import User from '../controllers/user';
import { CreateContext } from '../context';
import { TokenFactory } from '../lib/tokenFactory';
const paymentRouter = express.Router();




/**
 * Rota responsável pela criação de Grupos e permissoes.
 */
paymentRouter.post("/mp", async (req, res) => {
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


export default paymentRouter;