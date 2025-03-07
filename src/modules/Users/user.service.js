import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js"
import { syncHandler , eventEmitter , hash , compare , encrypt , decrypt , generateToken , verifyToken } from "../../utils/index.js"
import env from 'dotenv';

// ------------------------------ signUp  ----------------------------------
export const signUp = syncHandler(async (req, res, next) => {
    const { email, name, password, cPassword, phone, gender } = req.body;
    
    if (password !== cPassword) {
        return next(new Error("Password does not match", { cause: 400 }));
    }

    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
        return next(new Error("Email already exists", { cause: 409 }));
    }

    const hashedPassword = await hash({password, SALT_RAOUNDS : process.env.SALT_ROUNDS});
    const encryptedPhone = await encrypt ({ key : phone , SECRET_KEY:process.env.SECRET_KEY})
    
    eventEmitter.emit('sendEmail', { email });

    const user = await userModel.create({ email, name, password: hashedPassword, phone: encryptedPhone, gender });
    return res.status(201).json({ msg: "done", user });
});


// ------------------------------ confirmEmail  ----------------------------------

export const confirmEmail = syncHandler(async (req, res, next) => {
    const { token } = req.params;
    
    if (!token) {
        return next(new Error("Token not found", { cause: 401 }));
    }

    const decoded = await verifyToken({
        token,
        SIGNATURE_CONFIRMATION: process.env.SIGNATURE_CONFIRMATION,
    })
    if (!decoded?.email) {
        return next(new Error("Invalid token payload", { cause: 401 }));
    }

    const user = await userModel.findOneAndUpdate(
        { email: decoded.email, confirmed: false },
        { confirmed: true }
    );
    
    if (!user) {
        return next(new Error("User not found or already confirmed", { cause: 404 }));
    }

    return res.status(201).json({ msg: "done", token });
});


// ------------------------------ signUp  ----------------------------------

export const signIn = syncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, confirmed: true });
    if (!user) {
        return next(new Error("Email not found or not confirmed", { cause: 404 }));
    }

    const isMatch = compare({password, hashedPassword:user.password});
    if (!isMatch) {
        return next(new Error("Password is incorrect", { cause: 401 }));
    }

    const token = await generateToken({
        payload:{
            email,
            id: user._id,
        },
        SIGNATURE : user.role === "user" ? process.env.SIGNATURE_USER : process.env.SIGNATURE_ADMIN,
    })

    return res.status(201).json({ msg: "done", token });
});


// ------------------------------ getProfile  ----------------------------------

export const SHAREProfile = syncHandler(async (req, res, next) => {
    const messages = await messageModel.find({userId:req.user._id});
    const phone = await decrypt({ key:req.user.phone , SECRET_KEY:process.env.SECRET_KEY })
    return res.status(201).json({ msg: "done", user: req.user , messages });
});


// ------------------------------ SHAREProfile  ----------------------------------

export const getProfile = syncHandler(async (req, res, next) => {
    const phone = await decrypt({ key:req.user.phone , SECRET_KEY:process.env.SECRET_KEY })
    return res.status(201).json({ msg: "done", user: req.user });
});

// ------------------------------ updateProfile  ----------------------------------

export const updateProfile = syncHandler(async (req, res, next) => {
    const { name, phone, gender } = req.body;

    if(req.body.phone){
        await encrypt ({ key : phone, SECRET_KEY:process.env.SECRET_KEY})
    }
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body ,{new:true});
})


// ------------------------------ updatePassword  ----------------------------------
export const updatePassword = syncHandler(async (req, res, next) =>{
    const { oldPassword, newPassword } = req.body;
    const checkPassword = await compare({password: oldPassword, hashedPassword:req.user.password});
    console.log(checkPassword);
    
    if(!checkPassword){
        return next(new Error("Old password is incorrect", { cause: 401 }));
    }
    console.log(process.env.SALT_ROUNDS);
    
    const hashed = await hash({ password: newPassword  , SALT_ROUNDS : process.env.SALT_ROUNDS});

    const user = await userModel.findByIdAndUpdate(req.user._id , {password:hashed ,passwordChangeAt: Date.now()} ,{new:true});
    return res.status(201).json({ msg:"done", user})
})

// ------------------------------ freezeAccount(softDelete)  ----------------------------------
export const freezeAccount = syncHandler(async (req, res, next) =>{
    // هسيب ال  passwordchangeat عشان مدام اتعمله delete يبقي الtoken  expired
    const user = await userModel.findByIdAndUpdate(req.user._id , {isDeleted: true ,passwordChangeAt: Date.now()} ,{new:true});
    return res.status(201).json({ msg:"done", user})
})


// ------------------------------ shareAccount ----------------------------------
export const shareAccount = syncHandler(async (req, res, next) =>{

    const user = await userModel.findById(req.params.id).select("name email phone");
    if(!user){
        return next(new Error("User not found", { cause: 404 }));
    }
    return res.status(201).json({ msg:"done", user})
})
