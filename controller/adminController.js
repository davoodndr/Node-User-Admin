const adminSchema = require('../models/adminModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const loadLogin = async (req,res) => {
  res.render('admin/login')
}

const adminLogin = async (req, res) => {
  try {
    
    const {email, password} = req.body;

    if(email.trim().length < 1)
      return res.render('user/auth',{status:401, message:'Please enter your email'})

    if(password.trim().length < 1)
      return res.render('user/auth',{status:401, message:'Please enter your email'})

    const user = await adminSchema.findOne({email});

    if(!user) return res.render('admin/login',{status:401, message:'User does not exists'})
    
    if(user.password !== password) return res.render('admin/login',{status:401, message:'Incorrect password'});

    req.session.admin = true

    res.redirect('/admin/dashboard')

  } catch (error) {
    console.log(error);
    
  }
}

const adminDashboard = async (req,res) => {
  try {
    
    const admin = req.session.admin;
    if(!admin) return res.redirect('admin/login')

    //const users = await userModel.find({})
    const search = req.query.search || "";
    
    const users = await userModel.find({username:{$regex:search, $options:"i"}})

    const error = req.session.error ? req.session.error : null
    res.render('admin/dashboard',{users,message: error})

  } catch (error) {
    console.log(error);
  }
}

const updateUser = async (req,res) => {

  try {
    
    let {id, email, password, username} = req.body;
    
    const cur_user = await userModel.findOne({_id:id})
    email = email ? email : cur_user.email
    username = username ? username : cur_user.username

    let hashedPass;
    if(password){
      hashedPass = await bcrypt.hash(password,10);
    }else{
      hashedPass = cur_user.password;
    }
    
    await userModel.findOneAndUpdate({_id:id},{
      $set: {email,password:hashedPass,username}
    })
    req.session.error = null
    res.redirect('/admin/dashboard')

  } catch (error) {
    console.log(error);
  }
}

const addUser = async (req,res) => {
  
  try {

    let {email, password, username, confirm} = req.body;
    
    if(email.length < 1 || password.length < 1 || confirm.length < 1 || username.length < 1){
      req.session.error = 'All fields are mandatory'
      return res.redirect('/admin/dashboard')
    }
    if(password !== confirm) {
      req.session.error = 'Password doesn\'t match'
      return res.redirect('/admin/dashboard')
    };
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      username,
      email,
      password : hashPassword
    })

    req.session.error = null
    await newUser.save()
    res.redirect('/admin/dashboard')

  } catch (error) {
    console.log(error);
  }
}

const deleteUser = async (req,res) => {
  try {
    
    const {id} = req.params

    await userModel.findOneAndDelete({_id:id})

    res.redirect('/admin/dashboard')

  } catch (error) {
    console.log(error);
  }
}

const logout = (req,res) => {
  req.session.admin = null
  res.redirect('/admin/login')
}

const search = async (req, res) => {
  try {
        
    const search = req.body.payload.trim();
    const users = await userModel.find({username:{$regex:search, $options:"i"}})
    
    res.send({payload: users})
    //res.render('admin/dashboard',{users})

  } catch (error) {
    
  }
}

module.exports = {
  loadLogin,
  adminLogin,
  adminDashboard,
  updateUser,
  addUser,
  deleteUser,
  logout,
  search
}