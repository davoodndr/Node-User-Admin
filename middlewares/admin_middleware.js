const checkSession = (req,res,next) => {
  console.log('check session : ',req.session.error);
  if(req.session.admin || (req.session.error && req.session.error.length > 0)){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

const isLogin = (req,res,next) => {
  //console.log('is login : ',req.session.user);
  if(req.session.admin){
    res.redirect('/admin/dashboard')
  }else{
    next()
  }
}


module.exports = {
  checkSession,
  isLogin
}