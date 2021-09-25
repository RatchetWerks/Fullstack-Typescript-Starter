import { addUser,findUserModelByEmail } from "./UserModel";
import {generatePasswordHash} from "../../middlewares/auth"

export async function createUser(email:string,password:string){
    //Needs to calculate hash, generate salt, send out confirmation email etc


    const exists= await findUserByEmail(email)

    if(!exists){
    console.log("Creating account for ",email)
    const saltHash = generatePasswordHash(password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;
   
    const newUser= await addUser(email,hash,salt)
    .catch((e)=>{console.error(e)});
    
    return newUser
    }

    else{
        return new Error("Already has account")
    }

}

export function findUserByEmail(email:string){

    return findUserModelByEmail(email)
}