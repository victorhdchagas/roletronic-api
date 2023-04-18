import { Street } from '../../prisma/.prisma/prismaclient'
import { z } from 'zod'
import { IViaCepDTO } from '../lib/zipApi'
import { ContextType } from '../context'


class Address {
    async createStreetViaCep(data: IViaCepDTO, { prisma }: ContextType): Promise<unknown> {
        if (data.erro) return null
        const state = await prisma.state.upsert({
            where: {
                uf: data.uf
            },
            create: {
                name: data.localidade,
                uf: data.uf,
            },
            update: {}
        });
        //Código IBGE não é parametro para bairros diferentes. É necessário fazer uma verificação manual nesta etapa.
        var municipality = await prisma.municipality.findFirst({
            where: {
                name: data.bairro,
                State: { id: state.id }
            }
        });

        if (!municipality) {
            municipality = await prisma.municipality.create({
                data: {
                    name: data.bairro,
                    ddd: data.ddd,
                    ibge: data.ibge,
                    stateId: state.id
                }
            })
        };

        const street = await prisma.street.upsert({
            where: {
                zip: data.cep
            },
            create: {
                street: data.logradouro,
                complement: data.complemento,
                zip: data.cep,
                municipalityId: municipality.id
            },
            update: {}
        });

        return { ...street, municipality: municipality?.name, state: state?.name, uf: state?.uf };
    }

    async streetFind(where: Partial<Street>, { prisma }: ContextType) {
        const toReturn = await prisma.street.findFirst({
            where, include: {
                Municipality: {
                    include: {
                        State: true
                    }
                }
            }
        });
        return { ...toReturn, municipality: toReturn?.Municipality?.name, state: toReturn?.Municipality?.State?.name, uf: toReturn?.Municipality?.State?.uf }
    }

}

export default Address;