import { addUser, addUserPasswordResetToken, findUserModelByPasswordResetToken, findUserModelByEmail, updateUserModelPassword } from "./UserModel";
import { generatePasswordHash } from "../../middlewares/auth";
import errorHandler from "../../errorHandler";
import {randomBytes,createHash} from 'crypto';
//This is the dataShape of the exposed user object
interface UserControllerType{
  email:string
  id:number
}

export async function createUser(email: string, password: string):Promise<UserControllerType|Error|void>{
  //Needs to calculate hash, generate salt, send out confirmation email etc

  //Check if user already exists
  const user = await findUserByEmail(email).catch((e)=>{
    errorHandler(e)
  });   
  //Do everything below if user doesn't exist
  if (!user) {
  
    const saltHash = generatePasswordHash(password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    let newUser = await addUser(email, hash, salt).catch((e) => {
      errorHandler(e)
    });

    if(newUser){

      let user:UserControllerType={
        email:newUser.email,
        id:newUser.id
      }

      return user

    }



  }
  else{
    //Throw an error if the user already exists/or the promise chain fails
    const e= new Error(`Email ${email} is already registered`)
    return  e
  }
}

export function findUserByEmail(email: string) {
  //Just do a direct call to model function
  return findUserModelByEmail(email);
}

export async function createResetPasswordToken(email:string){

  //Generate token
  const resetToken = randomBytes(20).toString('hex');
  const resetTokenHash= createHash('sha256').update(resetToken).digest('hex')
  const resetTokenExpirationDate= new Date(Date.now() + 30 * 60 * 1000).toISOString() //Valid for 30 minutes

  addUserPasswordResetToken(email,resetTokenHash,resetTokenExpirationDate)
  
  console.log(`http://localhost:3000/resetpassword?email=${email}&resetToken=${resetTokenHash}`)

}

export async function updateUserPassword(email:string,hashedToken:string,newPassword:string):Promise<boolean>{

  //Find matching hashed token
  let isUpdatingSucessful=false;
  const userViaToken=await findUserModelByPasswordResetToken(hashedToken)

  const expiration= userViaToken?.passwordResetExpiration
  let isTokenStillValid= false;

  if (expiration){
  isTokenStillValid=(expiration?.getTime()>new Date().getTime())
  }

  //Find user independant of token
  const userViaEmail= await findUserByEmail(email)


  //Make sure user and token line up
  if(userViaToken && 
    userViaEmail &&
    userViaToken?.id == userViaEmail?.id &&
    isTokenStillValid){

      //Hash new password
      const saltHash = generatePasswordHash(newPassword);

      const salt = saltHash.salt;
      const hash = saltHash.hash;
      
       //Apply new password and remove token and expiration date
       isUpdatingSucessful= await  updateUserModelPassword(userViaToken.id,hash,salt)


    }


  //Return true/false
  return isUpdatingSucessful
}
