import bcrypt from 'bcrypt';

export const compare = async ({password, hashedPassword})=>{
    console.log(password);
    
    return bcrypt.compareSync(password, hashedPassword);
}