import express from 'express'
import { createUser } from './UserController';
const authRouter = express.Router();


authRouter.get('/login',function (req,res){
    res.status(200).send(`
	<body>
		<div class="login-form">
			<h1>Login Form</h1>
			<form action="auth" method="POST">
        <input type="hidden
				<input type="text" name="username" placeholder="Username" required>
				<input type="hidden" name="_csrf" value="${req.csrfToken()}">
				<input type="password" name="password" placeholder="Password" required>
				<input type="submit">
			</form>
		</div>
	</body>
  
  `)  })

authRouter.get('/logout',function (req,res){
  

    res.send('Logout')
  })

authRouter.get('/register',function (req,res){
    res.status(200).send(`
	<body>
		<div class="login-form">
			<h1>Login Form</h1>
			<form action="/register" method="POST">
        <input type="hidden
				<input type="text" name="email" placeholder="email" required>
				<input type="hidden" name="_csrf" value="${req.csrfToken()}">
				<input type="password" name="password" placeholder="Password" required>
				<input type="submit">
			</form>
		</div>
	</body>	
  
  `)  })

authRouter.post('/register',async function(req,res){

    const {email,password}=req.body

    const result= await createUser(email,password)
	.catch((e)=> {
		console.log("Router level")
		console.error(e)})

	 console.log(result)

	//Convert Node error to HTTP error response heref

    res.send(result)}


  )

authRouter.get('/resetpassword',function (req,res){
    res.send('Reset Password    ')
  })

  

  export {authRouter}