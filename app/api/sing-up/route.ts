import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"

import { sendVericationEmail } from "@/helpers/sendVerificationEmail";

sendVericationEmail

export async function Post(request: Request) {
    //    await dbConnect()

    try {
        const { username, email, password } = await request.json()
        const existingUserVerificationByUsername = await
            UserModel.findOne({
                username,
                isVerified: true
            })
        if (existingUserVerificationByUsername) {
            return Response.json({
                suceess: false,
                message: "username is already taken"
            }, { status: 400 })
        }
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()

        if (existingUserByEmail) {
            true //todo back here
        } else {
            const hasedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVarified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }
        // send verification email
        const emailResponce = await sendVericationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponce.success){
            return Response.json({
                  success: false,
                  message: emailResponce.message
            }, {status: 500})
        }
    } catch (error) {
        console.log('Error registering user', error)
        return Response.json(
            {
                success: false,
                message: "Error registering"
            },
            {
                status: 500
            }
        )
    }
}