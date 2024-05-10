'use client'

import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/models/User"
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponce } from "@/types/apiResponce"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const Dashboard = () => {
  const [message, setMessage]=useState<Message[]>([])
  const [isLoading, setIsLoading]=useState(false)
  const [isSwitchLoading, setIsSwitchLoading]=useState(false)
  const {toast} =useToast()
  const handleDeleteMessage =(messageId : string) =>{
    setMessage(message.filter((message) => message._id !== messageId))
  }
  const {data : session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema)
  })

  const {register, watch, setValue}= form
  const acceptMessages = watch('acceptMessage')
  const fetchAcceptMessage =useCallback(async ()=> {
    setIsSwitchLoading(true)
    try{
     const response= await axios.get<ApiResponce>('/api/accept-messages')
     setValue('acceptMesages', response.data.isAccesptingMessage)
    } catch(error) {
      const axiosError = error as AxiosError<ApiResponce>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ||
        "Failes to fetch message setting",
        variant: "destructive"
      })
    } finally{
     setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
       const response = await axios.get<ApiResponce>('/api/get-messages');
       setMessage(response.data.messages || [])
        if(refresh){
          toast({
            title: "Refresh Messages",
            description:"Showing latest messages"
          })
        }
      } catch (error) {
       const axiosError= error as AxiosError<ApiResponce>
       toast({
        title: "Error",
        description: axiosError.response?.data.message ||
        "failed to fetch message setting"
      })
      }  finally {
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
 }, [setIsLoading, setMessage]); 
  
 useEffect(() => {
  if(!session || session.user) return
  fetchMessages()
  fetchAcceptMessage()
 }, [session, setValue, fetchAcceptMessage, fetchMessages])
  
 const handleSwitchChamge = async() => {
  try{
    const response= await axios.post<ApiResponce>('/api/accept-messages', {
      acceptMessages: !acceptMessages
    })
    setValue('acceptMessages', !acceptMessages)
    toast({
      title: response.data.message,
      variant: 'default'
    })
  } catch(error){
    const axiosError= error as AxiosError<ApiResponce>
    toast({
     title: "Error",
     description: axiosError.response?.data.message ||
     "failed to fetch message setting",
     variant:"destructive"
   })
  }
 }
 if(!session || !session.user){
  return <div>Please login</div>
 }
 return (
    <div>Dashboard</div>
  )
}

export default  Dashboard