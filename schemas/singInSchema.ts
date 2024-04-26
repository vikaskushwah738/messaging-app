import {z} from 'zod'

export const singInSchema = z.object({
    identifire: z.string(),
    password: z.string(),
})
