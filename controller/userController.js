const userSchema = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltround = 10

const registerUser = async (req, res) => {
  try {
    
    const {email, username, password, confirm} = req.body

    if(email.length < 1 || password.length < 1 || confirm.length < 1 || username.length < 1) 
      return res.render('user/auth', {
        status:403,
        message: 'All fields are mandatory',
        mail: email,
        name: username,
        pass: password,
        confirm: confirm
      })

    if(password !== confirm) return res.render('user/auth', {
      status:403,
      message: 'Password doesn\'t match',
      mail: email,
      name: username,
      pass: password,
      confirm: confirm
    })

    //checking user Existence
    const user = await userSchema.findOne({email})
    
    if(user) return res.render('user/auth', {status:403, message: 'User already exists'})

    const hashPassword = await bcrypt.hash(password,saltround)

    const newUser = new userSchema({
      username,
      email,
      password : hashPassword
    })

    await newUser.save()
    res.render('user/auth', {status:200, message: 'User created successfully'})

  } catch (error) {
    console.log(error);
  }
}

const loadHome = (req,res) => {
  res.render('user/home')
}

const showLogin = (req,res) => {
  res.render('user/auth')
}

const userLogin = async (req, res) => {
  try {
    
    const {email, password} = req.body;
    
    if(email.trim().length < 1)
      return res.render('user/auth',{status:401, pass:password, message:'Please enter your email'})

    if(password.trim().length < 1)
      return res.render('user/auth',{status:401, mail:email, message:'Please enter the password'})

    const user = await userSchema.findOne({email});

    if(!user) return res.render('user/auth',{status:401, message:'User does not exists'})

    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch) return res.render('user/auth',{status:401, message:'Incorrect password'});

    req.session.user = user

    res.redirect('/user/dashboard')

  } catch (error) {
    console.log(error);
    
  }
}

const showDashborad = (req,res) => {
  res.render('user/dashboard',{user:req.session.user})
}

const logout = (req,res) => {
  req.session.user = null;
  res.redirect('/')
}

module.exports = {
  registerUser,
  loadHome,
  showLogin,
  userLogin,
  showDashborad,
  logout
}