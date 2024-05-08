"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback  } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { singnUpSchema } from "@/schemas/singUpSchema"
import axios, { Axios, AxiosError } from 'axios'
import { ApiResponce } from "@/types/apiResponce"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const debounced = useDebounceCallback(setUsername, 400)
  const { toast } = useToast()
  const router = useRouter()

  //zod Implementation
  const form = useForm<z.infer<typeof singnUpSchema>>({
    resolver: zodResolver(singnUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const responce = await axios.get(`/api/check-username-uniqe?username=${username}`)
        //  console.log(responce)
        //   let message = responce.data.message
          setUsernameMessage(responce.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponce>
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit:any = async (data: z.infer<typeof singnUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponce>('/api/sing-up', data)
      toast({
        title:'Sucess',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.log('error in sing-up error', error)
      const axiosError = error as AxiosError<ApiResponce>
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Sing-up failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-5 bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold
        tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">
            Sing up to start your anonymous adventrue
          </p>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 rounded-2xl">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin"/>}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-600'}`}>text {usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E-mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}>
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"
                      /> Please wait
                    </>
                  ) : ('SingUp')
                }
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>Aready a member? {''}
            <Link href="/sing-in" className="text-blue-600
         hover:text-blue-800">
              Sing in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page