import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";
import { syncHandler } from "../utils/error/index.js";

export const accessRoles = {
    user: "user",
    admin: "admin",
};

export const authentication = syncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    console.log("Headers:", req.headers);

    if (!authorization) {
        return next(new Error("Token not found"));
    }

    const [prefix, token] = authorization.split(" ") || [];

    if (!prefix || !token) {
        return next(new Error("Token not found"));
    }

    let SIGNATURE_TOKEN;
    if (prefix === "admin") {
        SIGNATURE_TOKEN = process.env.SIGNATURE_ADMIN;
    } else if (prefix === "bearer") {
        SIGNATURE_TOKEN = process.env.SIGNATURE_USER;
    } else {
        return next(new Error("Invalid token format"));
    }

    const decoded = jwt.verify(token, SIGNATURE_TOKEN);
    if (!decoded?.id) {
        return next(new Error("Invalid token payload"));
    }
    console.log("Decoded Token:", decoded);

    const existUser = await userModel.findById(decoded.id);
    if (!existUser) {
        return next(new Error("User not found"));
    }

    if(existUser?.isDeleted){
        return next(new Error("User is deleted"),{cause:401});
    }

    if((parseInt(existUser.passwordChangeAt.getTime()/1000) > decoded.iat)){
        return next(new Error("expired token Password has been changed"),{cause:401});
    }

    

    req.user = existUser;
    next();
});

export const authorization = (accessRoles = []) => {
    return syncHandler(async (req, res, next) => {
        if (!req.user) {
            return next(new Error("Unauthorized access"));
        }

        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("Access denied"));
        }

        next();
    });
};
