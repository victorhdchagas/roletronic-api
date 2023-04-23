import { Payment as PrismaPayment } from '../../prisma/.prisma/prismaclient'
import { ContextType as Context, ContextType, CreateContext } from "../context"
import { z } from 'zod'
import { IEventCreateDTO } from '../types/modelInterface';


class Event {
    async create(eventCreateDto: IEventCreateDTO, userId: string, ctx: Context): Promise<boolean> {
        const event = await ctx.prisma.event.create({
            data: {
                name: eventCreateDto.title,
                description: eventCreateDto.description,
                enabled: false,
                startDate: eventCreateDto.startDate,
                endDate: eventCreateDto.endDate ? eventCreateDto.endDate : null,
                createdBy: {
                    connect: {
                        id: userId
                    }
                },
                image: eventCreateDto.image,
                EventPrice: {
                    createMany: {
                        data: eventCreateDto.prices.map(price => ({ ...price, id: undefined, quantity: parseInt(price.qtd.toString(), 10), value: parseFloat(price.value.toString()), qtd: undefined }))
                    }
                },
                address: {
                    create: eventCreateDto.address
                },

            }

        })
        return !!event
    }

    async getAll(ctx: Context) {
        return await ctx.prisma.event.findMany({
            select: {
                name: true,
                id: true,
                image: true,
                oneTimePayment: true,
                startDate: true,
                endDate: true,
                // address: true,
                createdBy: {
                    select: {
                        id: true,
                        login: true
                    }
                },
                EventPrice: {
                    select: {
                        value: true,
                        quantity: true,
                        id: true,
                    }
                },

            },

        })
    }

    async getById(ctx: Context, id: number, isAdmin: boolean = false) {
        return await ctx.prisma.event.findFirst({
            select: {
                name: true,
                id: true,
                image: true,
                oneTimePayment: true,
                startDate: true,
                endDate: true,
                address: {
                    include: {
                        Street: {
                            include: {
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
                        }
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        login: true
                    }
                },
                EventPrice: {
                    select: {
                        value: true,
                        quantity: true,
                        id: true,
                    }
                },

            },
            where: {
                id,
                ...(!isAdmin ? { enabled: true } : {})
            }

        })
    }
}

export default Event;