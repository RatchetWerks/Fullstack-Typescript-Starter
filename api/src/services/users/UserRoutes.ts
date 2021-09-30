import express, { Request, Response } from "express";
import errorHandler from "../../errorHandler";
import { createUser, createResetPasswordToken, updateUserPassword } from "./UserController";
import passport from '../../middlewares/auth'
const authRouter = express.Router();

authRouter.get("/login", function (req, res) {
  res.status(200).send(`
	<body>
		<div class="login-form">
			<h1>Login Form</h1>
			<form action="auth" method="POST">
        <input type="hidden
				<input type="text" name="email" placeholder="Email" required>
				<input type="hidden" name="_csrf" value="${req.csrfToken()}">
				<input type="password" name="password" placeholder="Password" required>
				<input type="submit">
			</form>
		</div>
	</body>
  
  `);
});

authRouter.post('/auth', passport.authenticate('local'),function (req,res){

	
     res.send(`Hi ${req.user?.email}`)
})

authRouter.get("/logout", function (req, res) {
  res.send(`	<body>
  <div class="login-form">
	  <h1>Login Form</h1>
	  <p> Hi ${req.user?.email} </p>
	  <form action="logout" method="POST">
	  <input type="hidden" name="_csrf" value="${req.csrfToken()}">
		  <button type="submit"> Logout</button>
	  </form>
  </div>
</body>`);
});

authRouter.post('/logout',function (req,res){
	const email=req.user?.email
	req.logOut();

	res.send(`${email} has been logged out`)
})

authRouter.get("/register", function (req, res) {
  res.status(200).send(`
	<body>
		<div class="login-form">
			<h1>Signup Form</h1>
			<form action="/register" method="POST">
        <input type="hidden
				<input type="text" name="email" placeholder="email" required>
				<input type="hidden" name="_csrf" value="${req.csrfToken()}">
				<input type="password" name="password" placeholder="Password" required>
				<input type="submit">
			</form>
		</div>
	</body>	
  
  `);
});

authRouter.post("/register", async function (req, res) {
  const { email, password } = req.body;

  const result = await createUser(email, password).catch((e)=>{
	  errorHandler(e)
  })

  if (result instanceof Error){
	  res.status(400).send({"error":result.message})
  }

  //Convert Node error to HTTP error response here
  else{
  res.send(result);
  }
});

authRouter.get("/forgotpassword", function (req:Request, res:Response) {

	const {email, resetToken}=req.query;


	if (email && resetToken)
	{
		 res.send(
			`<body>
		<div class="login-form">
			<h1>Password Reset form</h1>
			<p>Please put your new password twice</p>
			<form action="forgotpassword" method="POST">
			<input type="hidden" name="_csrf" value="${req.csrfToken()}">
			<input type="hidden" name="_reset_token" value=${resetToken}>
			<input type="hidden" name="username" autocomplete="username" value=${email}>
			<input type="password" autocomplete="new-password" name="new_password" value=""/>
			<input type="password" autocomplete="new-password" name="new_password" value=""/>
			<button type="submit"> Reset Password</button>
			</form>
		</div>
		</body>`
		);
		 
	}
	else{
		res.send(
			`<body>
		<div class="login-form">
			<h1>Password Reset form</h1>
			<p> Please enter the email that you want to reset your password</p>
			<form action="forgotpassword" method="POST">
			<input type="hidden" name="_csrf" value="${req.csrfToken()}">
			<input type="email" name="email" value=""/>
				<button type="submit"> Reset Password</button>
			</form>
		</div>
		</body>`
		);
  }
});

authRouter.post("/forgotpassword", async function (req:Request, res:Response) {
	const { email }= req.body;

	const result =  createResetPasswordToken(email).catch((e)=>{
		errorHandler(e)
	})

	res.redirect('/forgotpassword/next');


  });

 authRouter.get("/forgotpassword/next",async function(req:Request,res:Response){
	 res.send("Please check your email for the reset link")
 })

  authRouter.get("/resetPassword",async function (req:Request,res:Response){

	//Should check if token is valid first
	const {email, resetToken}=req.query;
		 res.send(
			`<body>
		<div class="login-form">
			<h1>Password Reset form</h1>
			<p>Please put your new password twice</p>
			<form action="resetpassword" method="POST">
			<input type="hidden" name="_csrf" value="${req.csrfToken()}">
			<input type="hidden" name="_resetToken" value=${resetToken}>
			<input type="hidden" name="email" autocomplete="username" value=${email}>
			<input type="password" autocomplete="new-password" name="newPassword" value=""/>
			<button type="submit"> Reset Password</button>
			</form>
		</div>
		</body>`
		) 

  })

  authRouter.post("/resetPassword",async function (req:Request,res:Response){
	const { email, _resetToken,newPassword }= req.body;

	if (_resetToken && newPassword && email){

		const isSucessful= await updateUserPassword(email,_resetToken,newPassword)

		res.send(isSucessful?"Sucessfully changed password":
		"Your password reset token was invalid or expired, please reset password again")
	}

	else{

	res.redirect('/login')
	}	

  })


export { authRouter };

