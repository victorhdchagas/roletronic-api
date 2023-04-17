import express, { NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken';
import User from '../controllers/user';
import { CreateContext } from '../context';
import { TokenFactory } from '../lib/tokenFactory';
import Product from '../controllers/product';
const eventRouter = express.Router();




eventRouter.post("/image", async (req, res) => {
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

export default eventRouter;