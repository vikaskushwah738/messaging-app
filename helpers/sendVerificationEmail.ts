import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponce } from "@/types/apiResponce"; 


export async function sendVericationEmail(
 email:string,
 username:string,
 verifyCode:string
): Promise<ApiResponce>{
    try{
        await resend.emails.send({
            from:'onbording@resend.dev',
            to: email,
            subject: "Mystry message / vrification code",
            react: VerificationEmail({username, otp: verifyCode})
        });
      return {success: true , message: 'verification email send sucessful'}
    }catch (emailError){
        console.error("error sendinfg verification email", emailError)
        return {success: false, message: 'failed to send verificatin email'}
    }
}