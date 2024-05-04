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
       const 
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