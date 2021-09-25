import passport from "passport";

import { Strategy } from "passport-local";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { findUserByEmail } from "../services/users/UserController";

declare global {
  namespace Express {
    interface User {
      email: string;
      id?: number | undefined;
    }
  }
}

passport.initialize();
passport.authenticate("session");

export function validatePassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  var hashVerify = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
    "hex"
  );
  return hash === hashVerify;
}

export function generatePasswordHash(password: string) {
  var salt = randomBytes(32).toString("hex");
  var genHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    //This tells Passport how to take user/password combo and validate against database
    function (email: string, password: string, cb) {
      findUserByEmail(email)
        .then((user) => {
          if (!user) {
            return cb(null, false);
          }

          // Function defined at bottom of app.js
          const isValid = validatePassword(password, user.password, user.salt);

          if (isValid) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        })
        //Need to fix error type with proper error typing
        .catch((err: any) => {
          cb(err);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  //Serializes user to the session cookie sent back to the client
  done(null, user.id);
});

passport.deserializeUser(async function (email: string, done) {
  //Converts the data from the session into the server side user object
  const user = await findUserByEmail(email).catch((err) => {
    done(err);
    return null;
  });

  done(null, user);
});

export default passport;
