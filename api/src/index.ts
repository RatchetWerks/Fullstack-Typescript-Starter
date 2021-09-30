import { env } from "./env"; //Load up all env variables
import express from "express";
import cors from "./middlewares/cors";
import helmet from "./middlewares/helmet";
import sessions from "./middlewares/sessions";
import csurf from "./middlewares/csurf";
import bodyParser from "./middlewares/bodyParser";
import passport from "./middlewares/auth";
//Routes

import { authRouter } from "./services/users/UserRoutes";

const app = express();

//Provides sane security defaults and CSP protection
app.disable("X-Powered-By");
app.use(helmet);

//Enable Sessions
app.use(sessions);

//Protect against CORS attack
app.use(cors);

//Protect against CRSF attack by creating CSRF Token//
app.use(bodyParser);
app.use(csurf);
app.use(passport.initialize())
app.use(passport.session())
app.set("port", env.PORT);

app.get("/", (req, res) => {
  // The following logic test that sessions works
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  const { views } = req.session;

  res.status(200).send("This is the homepage. Here's your view number" + views +` email is ${req.user?.email}
  <br/>
  <a href="/login">Login</a>
  <br/>
  <a href="/logout">Logout</a>
  <br/>
  <a href="/register">Register</a>
  <br/>
  <a href="/forgotPassword">Forgot Password?</a>
  `);
});

//Apply CRSF protection to all authenication routes
app.use("/", csurf, authRouter);

export default app;
