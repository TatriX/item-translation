var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var x = mongoose.connect("mongodb://username:password@ds135830.mlab.com:35830/translations");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var translationRouter = require('./routes/translate');
var downloadRouter = require('./routes/download');
var importRouter = require('./routes/import'); 
var variantsRouter = require('./routes/variants'); 
var app = express();
var MONGOOSE = require('./routes/schema');
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 

 app.use(function(req,res,next) {  
  
		switch (req.url) {
			case '/signup': 
				let db = new MONGOOSE.user({login:req.body.login,password: req.body.password,cookie: generateCookie()});
				db.save(); 
				console.log('fuu');
		        break;	 
		        case '/login': 
		        login();
		        break;
		        default: 
		       isValidCookie(req.cookies.auth);
		        break;	
		}
		
	 
		
		function generateCookie() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 228; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
		function isValidCookie(cookie) {
			if (!req.cookies.auth && req.url === '/') {res.send({auth:"failed"})}
			MONGOOSE.user.find({"cookie": cookie}, function (err,found) {  if (found[0]) {req.url === '/' ? res.send({auth:'ok'}) : next()} else {res.send({auth:'failed'}); }}) 
			}
		function login () {
			MONGOOSE.user.find({login:req.body.login},
			function(err,found) {
				 if (found) {if (found[0].password === req.body.password) {  res.send({'auth':found[0].cookie});  }
				  else {res.send({auth:'wrong password'})}  }
				  else {res.send({auth:'Login not found'})} 
			}) }
 });

app.use('/', indexRouter);
app.use('/download', downloadRouter);
app.use('/users', usersRouter);
app.use('/translation', translationRouter);
app.use('/import', importRouter);
app.use('/variants', variantsRouter);


app.use(function(req, res, next) {
    next(createError(404));
});


app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500); 
});

module.exports = app;
