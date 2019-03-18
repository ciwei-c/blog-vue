var express = require('express');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var path = require("path");
var dbUrl = "mongodb://localhost";
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');
var app = express();
//连接数据库
mongoose.connect(dbUrl);
//设置视图的根目录
app.set('views',path.join(__dirname,'app/view'));
//设置默认的模板引擎
app.set('view engine','jade');
//设置静态资源读取目录
app.use(express.static(path.join(__dirname,'app/common')));
app.use(express.static(path.join(__dirname,'app')));
//设置favicon
app.use(favicon(__dirname + '/app/common/public/image/c.png'));
//将body中的数据转换成对象
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//设置cookie
app.use(cookieParser("ciwei_c"));
app.use(session({
	secret:"ciwei_c",
	key:"ciwei_c",
	resave : true,
	saveUninitialized : true,
	cookie : {maxAge : 1000 * 3600 * 24 * 30},
	store:new mongoStore({
		url:dbUrl,
		mongooseConnection:mongoose.connection
	})
}));
//将cookie中的内容存入本地对象
app.use(function(req,res,next){
	var user = req.session.user;
	res.locals.user = user;
    next();
})
//监听端口
app.listen(port,function(){
	console.log('app started on port 3000');
});
//路由
require('./biz/routes/index')(app);