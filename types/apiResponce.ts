import { Message } from "@/models/User";
export interface ApiResponce{
    success: boolean;
    message:string;
    isAccesptingMessage?: boolean;
    messages?:Array<Message>
}
