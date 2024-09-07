const express = require('express');
const app = express();
const hbs = require('hbs');
const nocache = require('nocache');
const session = require('express-session');

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const connectDB = require('./db/connectDB');


connectDB()


app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(session({
  secret:'secretKey',
  resave:false,
  saveUninitialized:true
}))
app.use(nocache())

app.use('/',userRoutes)
app.use('/admin',adminRoutes)

app.listen(8080,()=>{
  console.log('Server running on localhost: 8080');
})