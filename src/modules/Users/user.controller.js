import { Router } from "express";
import { confirmEmail, freezeAccount, getProfile, shareAccount, signIn, signUp, updatePassword, updateProfile } from "./user.service.js";
import { accessRoles, authentication, authorization } from "../../middleware/auth.js";
import { freezeAccountSchema, shareProfileSchema, signUpSchema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js";
import { validation } from "../../middleware/validation.js";


const userRouter = Router()
userRouter.post("/signUp",validation(signUpSchema),signUp)
userRouter.post("/signIn",signIn)
userRouter.get("/confirmEmail/:token",confirmEmail)
userRouter.get("/getProfile",authentication,authorization(accessRoles.user  ),getProfile)
userRouter.patch("/updateProfile",validation(updateProfileSchema),authentication,updateProfile)
userRouter.patch("/updateProfile/password",validation(updatePasswordSchema),authentication,updatePassword)
userRouter.delete("/freeze",validation(freezeAccountSchema),authentication,freezeAccount)
userRouter.get("/share/:id",validation(shareProfileSchema),authentication,shareAccount)




export default userRouter;