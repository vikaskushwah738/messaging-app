import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/singUpSchema";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const {username, code} =await request.json()
        const decodeUsername=decodeURIComponent(username)
        const user= await UserModel.findOne({username: decodeUsername}) 
        
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {status : 500}
            )
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired= new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeValid && isCodeNotExpired){
            user.isVerified =true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                }, {status : 200}
            )
        } else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Your code is expired, please signup again to get a new code"
                }, {status : 400}
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Please enter right code to singup"
                }, {status : 400}
            )
        }
    } catch(error){
        console.error("Error verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            }, {status : 500}
        )
    }
}