import express, { NextFunction, Request } from 'express'
import System from '../controllers/system';
import { CreateContext } from '../context';
import { RoleProductSchema } from '../types/global';
const systemRouter = express.Router();

systemRouter.post('/plan', (request, response) => {

})
systemRouter.post('/product', async (request, response) => {

    const ctrl = new System();
    const Schema = RoleProductSchema();
    const product = Schema.parse(request.body);

    const ctx = CreateContext()
    try {
        const ret = await ctrl.createProduct(product, ctx);
        response.send(ret)
    } catch (error) {
        console.error(error)
        response.status(500).send(error)
    }
})



export default systemRouter;