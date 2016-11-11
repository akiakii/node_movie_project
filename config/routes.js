var Index=require("../app/controllers/index");
var User=require("../app/controllers/user");
var Movie=require("../app/controllers/movie");
var Comment=require("../app/controllers/comment");
var Category=require("../app/controllers/categories");

module.exports=function(app){
	//pre handle user
	app.use(function(req,res,next){
		var _user =req.session.user;
		app.locals.user = _user;	
		return next();
	});

	//首页
	app.get("/",Index.index);
	//用户
	app.post("/user/signup",User.saveImg,User.signup);
	app.post("/user/signin",User.signin);
	app.get("/signup",User.showSignup);
	app.get("/signin",User.showSignin);
	app.get("/logout",User.logout);
	app.get("/admin/user/list",User.signinRequired, User.adminRequired, User.userlist);
	app.delete("/admin/user/list",User.signinRequired, User.adminRequired, User.del);

	//movie
	app.route("/movie/:id")
		.get(Movie.detail)
		.delete(Comment.del);
	app.get("/admin/movie/new",User.signinRequired, User.adminRequired, Movie.news);
	app.get("/admin/movie/update/:id",User.signinRequired, User.adminRequired, Movie.update);
	app.post("/admin/movie",User.signinRequired, User.adminRequired,Movie.savePoster, Movie.save);
	app.get("/admin/movie/list",User.signinRequired, User.adminRequired, Movie.list);
	app.delete("/admin/movie/list",User.signinRequired, User.adminRequired, Movie.del);

	//comment
	app.post("/user/comment",User.signinRequired, Comment.save);

	//category
	app.get("/admin/category/new",User.signinRequired, User.adminRequired, Category.news);
	app.post("/admin/categories",User.signinRequired, User.adminRequired, Category.save);
	app.get("/admin/category/list",User.signinRequired, User.adminRequired, Category.list);

	//results
	app.get("/results",Index.search);
};
