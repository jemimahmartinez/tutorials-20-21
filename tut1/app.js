// Referring to codeforgeek.com/express-nodejs-tutorial/

// // EXPRESS FRAMEWORK
// // Printing "Hello" on localhost:3000
// const express = require('express');
// const app = express();

// app.get('/', (req,res) => {
//   res.send("Hello");
// });

// app.listen(process.env.port || 3000);
// console.log('Web Server is listening at port '+ (process.env.port || 3000));

// ------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------------- //

// // EXPRESS ROUTERS
// // Printing "Hello World, ..." depending on the route on localhost:3000
// const express = require('express');
// const app = express();
// const router = express.Router();

// router.get('/home', (req,res) => {
//   res.send('Hello World, This is home router');
// });

// router.get('/profile', (req,res) => {
//   res.send('Hello World, This is profile router');
// });

// router.get('/login', (req,res) => {
//   res.send('Hello World, This is login router');
// });

// router.get('/logout', (req,res) => {
//   res.send('Hello World, This is logout router');
// });

// app.use('/', router);

// app.listen(process.env.port || 3000);

// console.log('Web Server is listening at port '+ (process.env.port || 3000));

// ------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------------- //

// // EXPRESS MIDDLEWARE
// // Application middleware
// // Prints time on console in a weird format
// const express = require('express');
// const app = express();

// app.use((req, res, next) => {
//   console.log('Time:', Date.now());
//   next();
// });

// app.listen(process.env.port || 3000);

// console.log('Web Server is listening at port '+ (process.env.port || 3000));

// ------------------------------------------------------------------------------------------------------------------- //

// // Router middleware
// // Prints the time on console in a weird format when on localhost:3000
// // Prints "ok" on localhost:3000/home and the time on console in a weird format when on localhost:3000
// const express = require('express');
// const app = express();
// const router = express.Router();

// router.use((req, res, next) => {
//   console.log('Time: ', Date.now());
  // next();
// });

// router.get('/home', (req,res) => {
//   var hello = "hello";
//   throw Error();
//   res.send("ok")
// });

// app.use('/', router);
// app.listen(process.env.port || 3000);

// console.log('Web Server is listening at port '+ (process.env.port || 3000));

// ------------------------------------------------------------------------------------------------------------------- //

// // Error-handling middleware
// // Is meant to print "Something broke!" when HTTP status code is 500 (error that originates from the server has a occurred) - but didn't
// app.use((err, req, res, next) => {
//   console.log("error", err);
//   res.status(500).send("Something broke!")
// });

// // USING THIRD-PARTY EXPRESS MIDDLEWARE
// // Does the same as EXPRESS ROUTERS
// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const router = express.Router();

// router.get('/home', (req,res) => {
//   res.send('Hello World, This is home router');
// });

// router.get('/profile', (req,res) => {
//   res.send('Hello World, This is profile router');
// });

// router.get('/login', (req,res) => {
//   res.send('Hello World, This is login router');
// });

// router.get('/logout', (req,res) => {
//   res.send('Hello World, This is logout router');
// });

// // add middleware before routes
// app.use(bodyParser.json());

// app.use('/', router);

// app.listen(process.env.port || 3000);

// console.log('Web Server is listening at port '+ (process.env.port || 3000));

// ------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------------- //

// // EXPRESS SESSIONS MANAGEMENT
// // When on localhost:3000/admin, prints "Please login first." and gets you to click on 'Login'
// // When you click on 'Login' it takes you to localhost:3000 and prints "Ok" (same for /logout)

// const express = require('express');
// const session = require('express-session');
// const bodyParser = require('body-parser');
// const router = express.Router();
// const app = express();

// app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// var sess; // gobal session, NOT recommended, only for demonstration purpose

// // first router => which renders the home page
// router.get('/', (req,res) => { 
//   sess = req.session;
//   if (sess.email) {
//     return res.redirect('/admin');
//   }
//   res.send('Ok');
// });

// // second router => used for a login operation (not doing any authentication for the sake of simplicity)
// router.post('/login', (req,res) => { 
//   sess = req.session;
//   sess.email = req.body.email;
//   res.end('done');
// });

// // third router => used for the admin area where the user can only go if he/she is log-in
// router.get('/admin', (req,res) => {
//   sess = req.session;
//   if(sess.email) {
//     res.write(` <h1>Hello ${sess.email} </h1><br> `);
//     res.end('<a href ='+'/logout'+'Logout</a>');
//   }
//   else {
//     res.write('<h1>Please login first. </h1>');
//     res.end('<a href='+'/'+'>Login</a>');
//   }
// });

// // fourth router => is for session destruction
// router.get('/logout', (req,res) => {
//   req.session.destroy((err) => {
//     if(err) {
//       return console.log(err);
//     }
//     res.redirect('/');
//   });
// });

// app.use('/', router);

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`App Started on PORT ${process.env.PORT || 3000}`);
// });

// ------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------------- //

// // FILE UPLOADS IN EXPRESS - Server file (with multiple file upload support)

// var express = require("express");
// var bodyParser = require("body-parser");
// var multer = require('multer');
// var app = express();

// app.use(bodyParser.json());

// // First, we initialized the multer with the disk storage
// // i.e. we are going to save our files in the machine where our Node server is running
// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });

// // Multer will accept any array of files limiting to max 2 file at each time 
// // Can increase the number parameter in array as you may need
// var upload = multer({ storage : storage }).array('userPhoto',2);

// app.get('/',function(req,res){
//   res.sendFile(__dirname + "/index.html");
// });

// app.post('/api/photo',function(req,res){
//   // the userPhoto is the key that should be used in the HTML file element as an ID (simply called this function in the router)
//   upload(req,res,function(err) {
//     if(err) {
//       return res.end(err);
//         //return res.end("Error uploading file.");
//     }
//     res.end("File is uploaded");
//   });
// });

// app.listen(3000,function(){
//   console.log("Working on port 3000");
// });

// ------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------------- //

// // NODE AND DATABASES
// // Need to install the MySQL server in my system
// // And download a database

// const mysql = require("mysql");

// const pool = mysql.createPool({
//   connectionLimit: 100,
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "database_name",
//   debug: false,
// });

// pool.query("SELECT * from table_name LIMIT 10", (err, rows) => {
//   if (err) {
//     console.log("error occured during the connection.");
//   }
//   console.log(rows[0]);
// });

// ------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------------- //

//// DEPLOYMENT OF NODE APPLICATIONS
//// Once you are finished with your application, it's time to test it out in the cloud server