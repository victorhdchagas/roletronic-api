import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express"
import securityRouter from "./routes/security";
import paymentRouter from "./routes/paymentRouter";
import productRouter from "./routes/productRouter";
import eventRouter from "./routes/eventRouter";
import userRouter from "./routes/user";
import jwt from 'jsonwebtoken';
import cors from 'cors'
import { IUserTokenPayload } from "./lib/tokenFactory";
import { MyRequest } from "./types/global";
import systemRouter from "./routes/systemRouter";
const port = process.env.NODE_DOCKER_PORT || 3000
const app = express();



function middlewareRequest(req: MyRequest, res: Response, next: NextFunction) {
    var token = req.headers['authorization'] as string;

    if (!token) return next()
    token = token.toString();
    jwt.verify(token.split(" ")[1], process.env.JWT as string, function (err, decoded) {
        if (err) next()
        // req.permissions = decoded as string[];
        req.user = decoded as IUserTokenPayload;
        return next();
    })
};
app.use(cors())
// app.use("/*", express.static('src/www'))

app.use(bodyParser.json())
app.use(middlewareRequest)


app.get("/start", (req, res) => {
    res.send("start")
})

app.use("/u", userRouter)
app.use("/security", securityRouter)
app.use("/pagamento", paymentRouter)
app.use("/system", systemRouter)
app.use("/produto", productRouter)
app.use("/evento", eventRouter)

app.get("*", (req, res) => {
    res.send({ error: "Not found" });
})
app.listen(port, () => {
    console.log(`Server is up at http://localhost:${process.env.NODE_LOCAL_PORT}`)
})