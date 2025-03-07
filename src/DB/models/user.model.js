import mongoose from "mongoose";
import { accessRoles } from "../../middleware/auth.js";


export const enumGender = {
    male: "male",
    female: "female"
}

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        lowercace:true,
        minLength:3,
        maxLength:10
    },
    email:{
        type:String,
        required:true,
        lowercace:true,
        unique:true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    gender:{
        type:String,
        required:true,
        enum:Object.values(enumGender),
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:"user",
        enum:Object.values(accessRoles)
    },
    passwordChangeAt:Date,
    isDeleted:{
        type:Boolean,
        default:false
    }
},
    {
        timestamps: true,
    }
)

const userModel = mongoose.model("User",userSchema) || mongoose.model.User;

export default userModel;