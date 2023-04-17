import fetch from 'node-fetch';

export type IViaCepDTO = {
    "cep": string,
    "logradouro": string,
    "complemento": string,
    "bairro": string,
    "localidade": string,
    "uf": string,
    "ibge": string,
    "gia": string,
    "ddd": string,
    "siafi": string
    "erro"?: boolean
}

type defaultReturingMessage = {
    data?: IViaCepDTO,
    status?: "ok" | "notOk",
    message?: string,
    stack?: unknown
}

export class ViaCep {
    private endpoint = "https://viacep.com.br/ws/"
    /**
     *
     */
    constructor() {
    }
    async find(cep: string): Promise<defaultReturingMessage> {
        try {
            console.log("\t\t Buscando cep nos servidores do ViaCep")
            const toReturn = await (await fetch(this.endpoint.concat(cep).concat("/json"))).json() as IViaCepDTO
            if (toReturn.erro) throw "Cep não encontrado"
            return {
                data: {
                    ...toReturn,
                    cep: toReturn.cep.split("-").join(""),
                }, status: "ok"
            }
        } catch (error) {
            return { status: "notOk", stack: error }
        }
    }
}