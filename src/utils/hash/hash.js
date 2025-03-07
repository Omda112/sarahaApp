import bcrypt from "bcrypt"

export const hash = async ({password,SALT_ROUNDS = process.env.SALT_ROUNDS})=>{
    console.log(password);
    
    console.log(SALT_ROUNDS);
    
    return bcrypt.hashSync(password,Number(SALT_ROUNDS));
}

