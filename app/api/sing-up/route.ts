import { sendVericationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function Post(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerificationByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerificationByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken"
                }),
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "User already exists with this email"
                    }),
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVericationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: emailResponse.message
                }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully. Please verify your email."
            }),
            { status: 201 }
        );
    } catch (error) {
        console.log('Error registering user', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error registering"
            }),
            { status: 500 }
        );
    }

}
