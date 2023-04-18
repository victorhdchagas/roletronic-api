import fetch from 'node-fetch';
import { IAddressWithoutDBDTO } from '../controllers/address';
import estados from './estados'

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
    data?: IAddressWithoutDBDTO,
    status?: "ok" | "notOk",
    message?: string,
    stack?: unknown
}

export class ViaCep {
    private endpoint = "https://viacep.com.br/ws/"

    static convert(data: IViaCepDTO): IAddressWithoutDBDTO {
        const state = estados.filter(estado => estado.sigla == data.uf.toUpperCase())[0]
        const toReturn: IAddressWithoutDBDTO = {
            zip: data.cep.split("-").join(""),
            city: data.localidade,
            state: state.nome,
            uf: data.uf,
            street: data.logradouro,
            district: data.bairro,
            cityIbge: data.ibge,
            stateIbge: data.ibge
        }
        return toReturn;
    }
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
                data: ViaCep.convert(toReturn), status: "ok"
            }
        } catch (error) {
            return { status: "notOk", stack: error }
        }
    }
}