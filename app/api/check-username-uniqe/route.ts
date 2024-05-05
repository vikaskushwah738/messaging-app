import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/singUpSchema";

const UsernameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request) {
    await dbConnect()
    
    try {
       const {searchParams} = new URL(request.url)
       const queryParam= {
       username: searchParams.get('username')   
    }
    // validation with zod
    const result =  UsernameQuerySchema.safeParse(queryParam)
    console.log(result)
    if(!result.success){
        const usernameErrors = result.error.format().
        username?._errors || []
        return Response.json({
            success: false,
            message: usernameErrors?.length > 0
            ? usernameErrors.join(', ') 
            : 'Invalid query parameters',
        }, {status: 400})
    }
    const {username} = result.data
    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true })

     if(existingVerifiedUser){
        return Response.json({
            success: false,
            message: 'Username is already exist'
        }, {status: 400})
     }
     return Response.json({
        success: true,
        message: 'Username is unique',
    }, {status: 200})
    
    } catch (error) {
       console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking userneme"
            },
            {status: 500}
        )
    }
}