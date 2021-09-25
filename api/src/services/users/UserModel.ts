import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { prisma } from "../../db/prisma"

export async function addUser(email:string,password:string,salt:string){

    const newUser = await prisma.user.create({
        data:{
        email:email,
        password:password,
        salt:salt
        }
    }).catch(
        (e:PrismaClientKnownRequestError)=>{
            if (e.code==="P2002"){
                throw Error("User already exsits")     }
            else console.error(e)})

    


    return newUser

}

export async function findUserModelByEmail(email:string) {
    return await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    
}
