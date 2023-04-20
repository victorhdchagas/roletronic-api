import express, { NextFunction, Request } from 'express'
import { CreateContext } from '../context';
import { ViaCep } from '../lib/zipApi';
import Address from '../controllers/address';
import { cepSchema } from '../types/global';
import { Postmon } from '../lib/Postmon';
const addressRouter = express.Router();


addressRouter.post("/cep", async (req, res) => {

    try {
        if (!req.body.cep || !cepSchema.parse(req.body.cep)) throw "Cep inválido"
        const ctx = CreateContext();
        const ctrl = new Address()
        const dbCep = await ctrl.streetFind({ zip: req.body.cep }, ctx)
        if (dbCep) return res.json({ status: "ok", data: dbCep })
        const apiResponse = await new Postmon().find(req.body.cep)
        if (apiResponse.data) {
            const toReturn = await ctrl.createStreet(apiResponse.data, ctx);
            return res.json({ status: "ok", data: toReturn })
        } else {
            const apiResponse = await new ViaCep().find(req.body.cep);
            if (apiResponse.data) {
                const toReturn = await ctrl.createStreet(apiResponse.data, ctx);
                return res.json({ status: "ok", data: toReturn })
            }
        }

        res.json({ status: "notOk", message: "Cep não encontrado" })

    } catch (error) {
        console.log(error)
        if (error instanceof Error)
            if (error.name === "ZodError") {
                res.status(500).json({ message: "Cép inválido", })
            } else
                res.status(500).json({ message: error.message, name: error.name })
        else {
            console.log("a", error)
            res.status(500).send(error)
        }
    }
})

export default addressRouter;