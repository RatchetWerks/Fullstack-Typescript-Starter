import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import {prisma} from '../db/prisma';
import {env} from '../env';

declare module 'express-session' {
    export interface SessionData {
      views:number
    }
  }

export default session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: process.env.NODE_ENV === 'production', 
                sameSite:true,
                httpOnly:true},
                store: new PrismaSessionStore(
                  prisma,
                  {
                    checkPeriod: 2 * 60 * 1000,  //ms
                    dbRecordIdIsSessionId: true,
                    dbRecordIdFunction: undefined,
                  }
                )
  
    })