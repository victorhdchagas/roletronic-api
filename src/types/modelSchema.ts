import { z } from 'zod';
const allowedExtensions = ['jpg', 'jpeg', 'png']; // lista de extensões permitidas

export const EventCreateDTOSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string(),
    image: z.string().refine((value) => allowedExtensions.findIndex(ext => value.includes(ext)) >= 0, {
        message: `Apenas arquivos com as extensões ${allowedExtensions.join(', ')} são permitidos.`,
    }), // valida a extensão do arquivo,
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    userId: z.string().optional(),
    oneTimePrice: z.boolean(),
    prices: z.array(
        z.object({
            name: z.string().optional(),
            value: z.coerce.number({
                invalid_type_error: "Falta de valor numérico"
            }).min(0),
            // value: z.preprocess((a) => parseFloat(z.string().parse(a)),
            //     z.number()),
            qtd: z.coerce.number({
                invalid_type_error: "Falta de valor numérico"
            }).min(0)
        })
    ),
    address: z.object({
        streetId: z.number(),
        number: z.string().min(3),
        complement: z.string().optional(),
    })

});