import {z} from 'zod'

export const userNameValidation = z
    .string()
    .min(2, "Username must be atleast 2 character")
    .max(20, "Username must be no mare 20 character" )
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")
    
export const singnUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message:"password must be at least 6 charater" })
})  

