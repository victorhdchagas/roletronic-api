import { Street } from '../../prisma/.prisma/prismaclient'
import { z } from 'zod'
import { IViaCepDTO } from '../lib/zipApi'
import { ContextType } from '../context'


class Address {
    async createStreetViaCep(data: IViaCepDTO, { prisma }: ContextType): Promise<Street | null> {
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
        const municipality = await prisma.municipality.upsert({
            where: {
                ibge: data.ibge
            },
            create: {
                name: data.localidade,
                ddd: data.ddd,
                ibge: data.ibge,
                stateId: state.id
            },
            update: {}
        });
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
        })
        return street;
    }

    async streetFind(where: Partial<Street>, { prisma }: ContextType) {
        return await prisma.street.findFirst({ where });
    }

}

export default Address;