var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var SALT_WORK_FACROR=10;//加密强度

var UserSchema = new mongoose.Schema({
	name:{
		unique:true,//唯一索引
		type:String
	},
	password:String,
	role:{
		type:Number,
		default:0
	},
	img:{
		type:String,
		default:'1478083095626.jpeg'
	},		
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

UserSchema.pre("save",function (next) {//每次在存储数据之前都会来调用这个方法（中间件）
	
	var user=this;//this指向问题要多注意，这里。

	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();
	};

	bcrypt.genSalt(SALT_WORK_FACROR,function(err,salt){//生成盐
		if(err) return next(err);

		bcrypt.hash(user.password,salt,function(err,hash){
			if(err) return next(err);
			user.password=hash;
			next();
		});
	})
	
});

//添加实例方法
UserSchema.methods={
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err) return cb(err);
			cb(null,isMatch);
		})
	}
}

UserSchema.statics = {//添加一个静态方法，静态方法从模型上去调用 
	fetch:function(cb){
		return this
		.find({})
		.sort("meta.updateAt")//排序方法
		.exec(cb)
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}

module.exports=UserSchema;
















