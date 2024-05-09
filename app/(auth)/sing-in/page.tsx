"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { singInSchema } from "@/schemas/singInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
const Singin = () => {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof singInSchema>>({
    resolver: zodResolver(singInSchema),
    defaultValues: {
      identifire:'',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof singInSchema>) => {
    const result= await signIn('credentials', {
      redirect: false,
      identifire:data.identifire,
      password:data.password
    })
    if(result?.error){
      toast({
          title:"Login Failed",
          description:"Incorrect username ot password",
          variant:"destructive"
        })
      }

     if(result?.url){
      router.replace('/dashboard')
     } 
   
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold
         tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
         <p className="mb-4">Sing in to start your ananymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
            <FormField
              control={form.control}
              name="identifire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username / Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Username / Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Signin</Button>
          </form>
        </Form>

      </div>
    </div>
  )
}

export default Singin
