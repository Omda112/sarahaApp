import  connectionDB from "./DB/connectionDB.js"
import messageRouter from "./modules/messages/message.controller.js"
import userRouter from "./modules/Users/user.controller.js"
import { globalErrorHandler } from "./utils/error/index.js"
import cors from "cors"

const bootstrap = async (app,express)=>{

    app.use(cors())

    app.use(express.json())

    // home page
    app.get('/',(req,res,next)=>{
        return res.status(200).json({msg:"hello from saraha app!"});
    })

    // app routes
    app.use("/users",userRouter)
    app.use("message",messageRouter)


    connectionDB()

    app.use("*",(req,res,next)=>{
        return next(new Error("not founded"),{cause:404})
    })
    
    // error handling middleware
    app.use(globalErrorHandler)
}

export default bootstrap;