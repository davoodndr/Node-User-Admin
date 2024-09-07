const checkSession = (req,res,next) => {
  //console.log('check session : ',req.session.user);
  if(req.session.user){
    next()
  }else{
    res.redirect('/')
  }
}

const isLogin = (req,res,next) => {
  //console.log('is login : ',req.session.user);
  if(req.session.user){
    res.redirect('/user/dashboard')
  }else{
    next()
  }
}


module.exports = {
  checkSession,
  isLogin
}