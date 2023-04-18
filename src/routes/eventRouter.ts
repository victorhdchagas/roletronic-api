import express, { NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken';
import User from '../controllers/user';
import { CreateContext } from '../context';
import { TokenFactory } from '../lib/tokenFactory';
import Product from '../controllers/product';
const eventRouter = express.Router();

// eventofromPage'{"title":"Nome do evento","image":"/promosite03.jpg","description":"\\n# FESTA DO JUCÁ\\n\\n--- \\n\\n\\n\\nVocês votaram em um sítio médio, aconchegante, com piscina e chuveiros e nós resgatamos o melhor da cidade para pvts!\\n\\nO bem localizado Recanto Miller, palco de memoráveis festas, será a casa da Terralife em sua primeira edição! \\n\\nPositividade que vem festão aí!\\n\\n🎟 Lote promo - ESGOTADO\\n\\n🎟 1° Lote - ESGOTADO\\n\\n🎟 2° Lote - ESGOTADO\\n\\n🎟 3° Lote - ÚLTIMOS INGRESSOS \\n\\nCompre aqui: (Link na BIO)\\n\\n\\n\\nAcompanhe nossas redes sociais!\\n[Siga-nos no Instagram](https://github.com/remarkjs/react-markdown)!\\n    ","prices":[{"id":"myPrice-0","name":"Ingresso","value":"150","qtd":"500"}],"address":"Rua das pitangas - 21210330 - RJ"}'


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