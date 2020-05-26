const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const session = require('express-session') ;
//connect to db

mongoose.connect('mongodb://localhost:27017/todolistDB2', {useNewUrlParser: true});
//schema
var taskSchema=new mongoose.Schema({
  task:String,
  user:String
});
var userSchema=new mongoose.Schema({
  name:String,
  username:String,
  password:String
});

//create model
var Tasks=mongoose.model('Tasks',taskSchema);
var Users=mongoose.model('Users',userSchema);
//module.exports = Users;

//express app
 const app=express();



app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(session({	secret:'super secret', resave: true ,saveUninitialized: true}));


 var tasks= [];

 app.get('/',function(req,res){

     if(!req.session.username){ res.redirect('/login');}
      else{
        Tasks.find({user:req.session.username},function(err,foundTasks){

            if(foundTasks.length===0)
             {


                   var task1=new Tasks({
                     task:"Welcome to my to do list",
                     user:req.session.username
                   });
                   task1.save();
                   var task2=new Tasks({
                     task:"Add your task",user:req.session.username
                   });
                   task2.save();
                   var task3=new Tasks({
                     task:"To delete use checkbox",user:req.session.username
                   });
                   task3.save();
                    res.redirect('/');



             }
          else {

            res.render("index",{items:foundTasks});
          }

        });
      }


});
app.get('/login',function(req,res) {
  res.render("login");

});
app.get('/register',function(req,res) {
  res.render("register");

});


app.post('/login',function(req,res){
 var password=req.body.password;

   Users.findOne({username:req.body.username},function(err,foundUser){
     if(err){
       console.log(err);
     }
    else{
          try{

               if(foundUser.password===password){
                 req.session.username=req.body.username;

                 res.redirect('/');
              }
           }
       catch{
         res.send("Login failed");
       }
     }

   }) ;

});

app.post('/register',function(req,res){

   var newUser=new Users({
     name:req.body.name,
     username:req.body.username,
     password:req.body.password,
   });
   newUser.save();
   req.session.username=req.body.username;
   res.redirect('/');
});

app.post('/',function(req,res){


 var newTask=new Tasks({
   task:req.body.itemName,user:req.session.username
 });
 newTask.save();
res.redirect('/');
});













//server
app.listen(3000,function(){
  console.log("server running");
});
