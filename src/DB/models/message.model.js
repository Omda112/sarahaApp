import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
    {
        timestamps:true
    }
)

const messageModel = mongoose.model("Message",messageSchema) || mongoose.model.Message

export default messageModel;