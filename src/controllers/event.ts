import { Payment as PrismaPayment } from '../../prisma/.prisma/prismaclient'
import { ContextType as Context, ContextType, CreateContext } from "../context"
import { z } from 'zod'
import { IEventCreateDTO } from '../types/modelInterface';


class Event {
    async create(eventCreateDto: IEventCreateDTO, userId: string, ctx: Context): Promise<boolean> {
        console.log(userId)
        const event = await ctx.prisma.event.create({
            data: {
                name: eventCreateDto.title,
                description: eventCreateDto.description,
                enabled: false,
                startDate: eventCreateDto.startDate,
                endDate: eventCreateDto.endDate ? eventCreateDto.endDate : null,
                createdby: {
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
            include: {
                address: true,
                createdby: true,
                EventPrice: true
            }
        })
    }
}

export default Event;