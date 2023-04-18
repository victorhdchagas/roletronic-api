import { Street } from '../../prisma/.prisma/prismaclient'
import { z } from 'zod'
import { ContextType } from '../context'
import { City } from '../../prisma/.prisma/prismaclient'
import { District } from '../../prisma/.prisma/prismaclient'
import { State } from '../../prisma/.prisma/prismaclient'


export interface IAddressDTO {
    zip: string
    street: string
    district: string
    city: string
    uf: string
    state: string
    streetId: number
    cityId: number
    stateId: number
    districtId: number
}
export interface IAddressWithoutDBDTO {
    zip: string
    street: string
    district: string
    city: string
    state: string
    uf: string
    cityIbge?: string
    stateIbge?: string
    streetId?: number
    cityId?: number
    stateId?: number
    districtId?: number
}


class Address {
    convert(street: Street, city: City, district: District, state: State): IAddressDTO {
        const toReturn: IAddressDTO = {
            zip: street.zip,
            city: city.name,
            cityId: city.id,
            district: district.name,
            districtId: district.id,
            state: state.name,
            stateId: state.id,
            street: street.street,
            streetId: street.id,
            uf: state.uf
        }
        return toReturn
    }
    async createStreet(data: IAddressWithoutDBDTO, { prisma }: ContextType): Promise<IAddressDTO | null> {
        if (!data) return null
        const state = await prisma.state.upsert({
            where: {
                uf: data.uf
            },
            create: {
                name: data.state,
                uf: data.uf,
                ibge: data.stateIbge,
            },
            update: {}
        });
        //Código IBGE não é parametro para bairros diferentes. É necessário fazer uma verificação manual nesta etapa.
        var city = await prisma.city.findFirst({
            where: {
                name: data.city,
                stateId: state.id
            }
        });

        if (!city) {
            city = await prisma.city.create({
                data: {
                    name: data.city,
                    ibge: data.cityIbge!,
                    stateId: state.id
                }
            })
        };

        var district = await prisma.district.findFirst({
            where: {
                name: data.district,
                cityId: city.id
            }
        });

        if (!district) {
            district = await prisma.district.create({
                data: {
                    name: data.district,
                    cityId: city.id
                }
            })
        };

        const street = await prisma.street.upsert({
            where: {
                zip: data.zip
            },
            create: {
                street: data.street,
                zip: data.zip,
                districtId: district.id
            },
            update: {}
        });

        return this.convert(street, city, district, state);
    }

    async streetFind(where: Partial<Street>, { prisma }: ContextType): Promise<IAddressDTO | null> {
        const toReturn = await prisma.street.findFirst({
            where, include: {
                District: {
                    include: {
                        City: {
                            include: {
                                State: true
                            }
                        }
                    }
                }
            }
        });
        if (!toReturn) return null
        return this.convert(toReturn, toReturn.District!.City, toReturn.District!, toReturn.District!.City.State)
    }

}

export default Address;