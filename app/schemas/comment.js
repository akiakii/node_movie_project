var mongoose = require("mongoose");
var ObjectId=mongoose.Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
	movie:{type:ObjectId,ref:"movie"},//这里的type设成ObjectId，是要跟被引用的schema的主键类型要一致，假如说被引用的主键类型是string那么这里的type就奢侈string   
	from:{type:ObjectId,ref:"User"},
	reply:[{
		from:{type:ObjectId,ref:"User"},
		to:{type:ObjectId,ref:"User"},
		content:String
	}],
	content:String,
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

CommentSchema.pre("save",function (next) {//每次在存储数据之前都会来调用这个方法（中间件）
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();
	}
	next();
});

CommentSchema.statics = {//添加一个静态方法，静态方法从模型上去调用 
	fetch:function(cb){
		return this
		.find({})
		.sort("meta.updateAt")
		.exec(cb)
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}

module.exports=CommentSchema;
















