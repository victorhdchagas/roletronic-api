import express, { NextFunction, Request } from 'express'
import { CreateContext } from '../context';
import Product from '../controllers/product';
import { ViaCep } from '../lib/zipApi';
import Address from '../controllers/address';
import { cepSchema } from '../types/global';
const addressRouter = express.Router();




addressRouter.post("/cep", async (req, res) => {
    try {
        if (!req.body.cep || !cepSchema.parse(req.body.cep)) throw "Cep inválido"
        const ctx = CreateContext();
        const ctrl = new Address()
        const dbCep = await ctrl.streetFind({ zip: req.body.cep }, ctx)
        if (dbCep.id) return res.json({ status: "ok", data: dbCep })
        const viaCepResponse = await new ViaCep().find(req.body.cep)
        if (viaCepResponse.data) {
            const toReturn = await ctrl.createStreetViaCep(viaCepResponse.data, ctx);
            return res.json(toReturn)
        }
        res.json({ status: "notOk", message: "Cep não encontrado" })

    } catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message, name: error.name, stack: error.stack })
        else
            res.status(500).send(error)
    }
})

export default addressRouter;