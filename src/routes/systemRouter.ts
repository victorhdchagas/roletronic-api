import express, { NextFunction, Request } from 'express'
import System from '../controllers/system';
import { CreateContext } from '../context';
import { RolePlanRuleSchema, RolePlanSchema, RoleProductSchema } from '../types/global';
const systemRouter = express.Router();

//TODO: Should do a really hard way to get off invasor attack. (probably intranet acces for these routes.)
systemRouter.post('/rule', async (request, response) => {
    const ctrl = new System();
    try {
        const Schema = RolePlanRuleSchema();
        const planRule = Schema.parse(request.body);

        const ctx = CreateContext()
        const ret = await ctrl.createRule(planRule, ctx);
        response.send(ret)
    } catch (error) {
        console.error(error)
        response.status(500).send(error)
    }
})
//TODO: Should do a really hard way to get off invasor attack. (probably intranet acces for these routes.)
systemRouter.post('/plan', async (request, response) => {
    const ctrl = new System();
    try {
        const Schema = RolePlanSchema();
        const product = Schema.parse(request.body);

        const ctx = CreateContext()
        const ret = await ctrl.createPlan(product, ctx);
        response.send(ret)
    } catch (error) {
        console.error(error)
        response.status(500).send(error)
    }
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