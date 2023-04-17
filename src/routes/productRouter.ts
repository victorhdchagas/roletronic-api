import express, { NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken';
import User from '../controllers/user';
import { CreateContext } from '../context';
import { TokenFactory } from '../lib/tokenFactory';
import Product from '../controllers/product';
const productRouter = express.Router();




/**
 * Rota responsável pela criação de Grupos e permissoes.
 */
productRouter.get("/roletronic/:id", async (req, res) => {
    const ctrl = new Product();
    const ctx = CreateContext();
    console.log(req.body, req.params.id)
    try {
        const ret = await ctrl.get(parseInt(req.params.id), ctx);
        res.send(ret)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

/**
 * Rota responsável pela criação de Grupos e permissoes.
 */
productRouter.post("/roletronic", async (req, res) => {
    const ctrl = new Product();
    const ctx = CreateContext();
    try {
        const ret = await ctrl.create(req.body, ctx);
        res.send(ret)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

export default productRouter;