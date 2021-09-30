import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import errorHandler from "../../errorHandler";
import { prisma } from "../../db/prisma";

export async function addUser(email: string, password: string, salt: string) {
  const newUser = await prisma.user
    .create({
      data: {
        email: email,
        password: password,
        salt: salt,
      },
    })
    .catch((e: PrismaClientKnownRequestError) => {
        errorHandler(e)
    });

  return newUser;
}

export async function findUserModelByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  }).catch(
    (e:PrismaClientKnownRequestError)=>{
      errorHandler(e)
      }
    );
}

export async function findUserModelByPasswordResetToken(resetTokenHash: string) {
  return await prisma.user.findFirst({
    where: {
      passwordResetToken:resetTokenHash
    },
  }).catch(
    (e:PrismaClientKnownRequestError)=>{
      errorHandler(e)
      }
    );
}


export async function addUserPasswordResetToken(email:string,resetTokenHash:string,expirationTime:string){
    const updatedUser=await prisma.user
      .update({
        where:{
           email:email
            
          },
          data:{
            passwordResetToken:resetTokenHash,
            passwordResetExpiration:expirationTime
          }
        },
      ).catch((e)=>{console.error(e)})
    

}

export async function updateUserModelPassword(userId:number,newHashedPassword:string,newSalt:string){
 //This updates password and nullifies reset tokens
  const user=await prisma.user.update({
    where:{
      id:userId
    },
    data:{
      salt:newSalt,
      password:newHashedPassword,
      passwordResetToken:null,
      passwordResetExpiration:null
    }
  }).catch((e)=>{
    errorHandler(e)
  })

  if (user) return true
  else return false
  //Function: Given a user UIID and a hashed password, update the user's password


}