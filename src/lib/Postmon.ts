import fetch from 'node-fetch';
import { IAddressDTO, IAddressWithoutDBDTO } from '../controllers/address';

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

type IDefaultLocationInfo = {
    "area_km2": string
    "codigo_ibge": string,
}

interface IEstado_Info extends IDefaultLocationInfo {
    "nome": string
}
export type IPostMonDTO = {
    "bairro": string,
    "cidade": string,
    "logradouro": string,
    "estado_info": IEstado_Info,
    "cep": string,
    "cidade_info": IDefaultLocationInfo,
    "estado": string
}

type defaultReturingMessage = {
    data?: IAddressWithoutDBDTO,
    status?: "ok" | "notOk",
    message?: string,
    stack?: unknown
}

export class Postmon {
    static convert(data: IPostMonDTO): IAddressWithoutDBDTO {
        const toReturn: IAddressWithoutDBDTO = {
            zip: data.cep.split("-").join(""),
            city: data.cidade,
            state: data.estado_info.nome,
            uf: data.estado,
            street: data.logradouro,
            district: data.bairro,
            cityIbge: data.cidade_info.codigo_ibge,
            stateIbge: data.estado_info.codigo_ibge
        }
        return toReturn;
    }
    private endpoint = "https://api.postmon.com.br/v1/cep/"
    /**
     *
     */
    constructor() {
    }
    async find(cep: string): Promise<defaultReturingMessage> {
        try {
            console.log("\t\t Buscando cep nos servidores do Postmon")
            const toReturn = await (await fetch(this.endpoint.concat(cep))).json() as IPostMonDTO | null

            if (!toReturn) return { message: "Cep não encontrado" }

            return {
                data: Postmon.convert(toReturn),
                status: "ok"
            }
        } catch (error) {
            return { status: "notOk", stack: error }
        }
    }
}