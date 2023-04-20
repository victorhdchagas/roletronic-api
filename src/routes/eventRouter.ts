import express, { NextFunction, Request } from 'express'
import { CreateContext } from '../context';
import { EventCreateDTOSchema } from '../types/modelSchema';
import httpStatus from 'http-status';
import Event from '../controllers/event';
const eventRouter = express.Router();



eventRouter.post("/image", async (req, res) => {
    const ctrl = new Event();
    const ctx = CreateContext();
    try {
        // const ret = await ctrl.create(req.body, ctx);
        // res.send(ret)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

eventRouter.post("/", async (req, res) => {
    try {
        const ctrl = new Event();
        const ctx = CreateContext();
        //@ts-ignore
        if (!req.user) return res.status(httpStatus.UNAUTHORIZED).json({ status: "notOk", message: "Authentication required" })
        const isValid = EventCreateDTOSchema.safeParse(req.body);
        if (!isValid.success)
            return res.status(500).json({ status: "notOk", message: isValid.error.issues })
        //@ts-ignore
        const toReturn = await ctrl.create(req.body, req.user.id, ctx);
        return res.status(200).json({ status: "ok", data: toReturn, message: "Evento criado com sucesso, nosssa equipe ira publicar em breve." })
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})
eventRouter.get("/", async (req, res) => {
    try {
        const ctrl = new Event();
        const ctx = CreateContext();
        //@ts-ignore
        if (!req.user) return res.status(httpStatus.UNAUTHORIZED).json({ status: "notOk", message: "Authentication required" })

        const toReturn = await ctrl.getAll(ctx);
        return res.status(200).json({ status: "ok", data: toReturn })
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

export default eventRouter;