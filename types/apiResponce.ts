import { Message } from "@/models/User";
export interface ApiResponce{
    success: boolean;
    message:string;
    isAccesptingMessages?: boolean;
    messages?:Array<Message>
}
