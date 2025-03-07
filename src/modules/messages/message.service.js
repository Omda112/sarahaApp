import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import { syncHandler } from "../../utils/error/index.js"

// ------------------------------ sendMessage  ----------------------------------
export const sendMessage = syncHandler(async(req,res,next)=>{
    const {content , userId} = req.body;
    if(! await userModel.findOne({ _id:userId , isDeleted:false })){
        return next(new Error("User not found"));
    }
    const message = await messageModel.create({content, userId});
    return res.status(201).json({msg:"done", message})
})

// ------------------------------ getMessages  ----------------------------------
export const getMessage = syncHandler(async(req,res,next)=>{
    // ال auth كده كده هيتاكد هو موجود ولا لا 
    // if(! await userModel.findOne({ _id:userId , isDeleted:false })){
    //     return next(new Error("User not found"));
    // }

    const messages = await messageModel.find({userId:req.user._id}).populate([
        {
            path:"userId",
            select:"name email",
        }
    ]);
    return res.status(201).json({msg:"done", messages})
})