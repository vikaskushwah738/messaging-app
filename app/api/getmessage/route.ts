import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()
    const session =await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session  || !session.user){
        return Response.json(
            {
                success:false,
                message:"NOt Authenticated"
            }, {status: 401}
        )
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try{
      const user= await UserModel.aggregate([
        {$match: {id: userId}},
        {$unwind: '$message'}, 
        {$sort: {'message.createdAt':-1}},
        {$group: {_id: '$_id', messages: {$push:'$message'}}}
    
    ])
    if(!user || user.length === 0){
        return Response.json(
            {
                success:false,
                message:"User not found"
            },  {status: 401}
        )
    }
    return Response.json(
        {
            success:true,
            messages:user[0].messages
        }, {status: 200}
    )
    } catch(error){
        console.log("An unexpected error occure", error)
        return Response.json(
            {
                success: false,
                message:"not Authenticated"
            }, {status: 500}
          )
    }

}