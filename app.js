var express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path= require("path");
var mongoose=require("mongoose");
var multipart = require('connect-multiparty');

var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
mongoose.connect("mongodb://localhost/imooc"); //连接数据库

mongoose.connection.on('open', function () {
    console.log('-----------数据库连接成功！------------');
});

var routes = require("./config/routes");

var port = process.env.PORT||3000;
var app = express();

app.set("views","./app/views");
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('connect-multiparty')());

app.use(session({
    secret: "what do you want to do?", //secret的值建议使用128个随机字符串
    cookie: {maxAge: 60 * 1000 * 60 * 24 * 14}, //过期时间
    resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection, //使用已有的数据库连接
        collection:"sessions"//存储sessions到mongodb中的集合名
    })
}));

routes(app);//传入路由。

app.locals.moment=require("moment");//引入moment模块并设置为app.locals属性,用来格式化时间

app.listen(port);
console.log("服务是否成功启动－端口号：",port);




