import { config } from 'dotenv';
config(); //Immediately load the .env file before doing anything
export const env={
   SESSION_SECRET:process.env.SESSION_SECRET||'SessionSecretNotDefined',
   DATABASE_URL: process.env.DATABASE_URL||'file:./db/prisma/dev.db',
   PORT: process.env.PORT ||3000,
}