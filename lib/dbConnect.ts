import mongoose from "mongoose";
type ConnectionObject ={
    isConnected?:number
}
const connection: ConnectionObject = {}

async function dbConnect():  Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }
    try{
        const db = await mongoose.connect(process.env.
             MONGODB_URI || '', {})

             connection.isConnected = db.connections[0].
             readyState

             console.log('db connected sucefull')
    } catch(error) {
        console.log('data base connection fials ')
        process.exit(1)
    }   
}
export default dbConnect