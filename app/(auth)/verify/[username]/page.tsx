import { useToast } from "@/components/ui/use-toast"
import * as z  from "zod"
import { verifySchema } from "@/schemas/verifySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import axios, {AxiosError} from "axios"
import { ApiResponce } from "@/types/apiResponce"

const VerifyAccount = () => {
 const router = useRouter()
 const params = useParams<{username : string}>()
 const {toast}= useToast() 
 
 const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    
  }) 
 const onSubmit = async (data: z.infer<typeof verifySchema>) => {
   try {
     const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code
     }) 
     toast({
        title: "Success",
        description: response.data.message
     })
     router.replace('sing-in')
   } catch(error) {
    console.log('error in verify-code error', error)
    const axiosError = error as AxiosError<ApiResponce>
    toast({
      title: "Sing-up failed",
      description: axiosError.response?.data.message,
      variant: "destructive"
    })
   }
 }
 return (
    <div>

    </div>
  )
}

export default VerifyAccount