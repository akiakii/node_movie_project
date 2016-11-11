var Comment=require("../models/comment");
const moment = require('moment');

exports.save=function(req,res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;

	if(_comment.cid){
		Comment.findById(_comment.cid,function(err,comment){
			var reply={
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			comment.reply.push(reply);
			comment.save(function(err,comment){
				if(err){
					console.log(err);
				};
				Comment
		          .findOne({_id:comment._id})
              .populate('from','name img')
              .populate('reply.from reply.to','name img')// 查找评论人和回复人的名字和头像
              .exec(function(err,comments) {
                res.json({data:comments});
          });
			});
		});
	}else{
		var comment = new Comment(_comment);
		comment.save(function(err,comment){
			if(err){
				console.log(err);
			};
			Comment
          	.findOne({_id:comment._id})
          	.populate('from','name img')
          	.populate('reply.from reply.to','name img')// 查找评论人和回复人的名字
          	.exec(function(err,comments) {
            res.json({data:comments});
          });
		});
	};
};
// 删除电影评论控制器
exports.del = function(req,res) {
    // 获取客户端Ajax发送的URL值中的id值
    var cid = req.query.cid,                     // 获取该评论的id值
        did = req.query.did;                     // 获取各条回复评论的id值
    // 如果点击的是叠楼中的回复评论的删除按钮
    if(did !== 'undefined') {
      // 先查找到该叠楼评论
      Comment.findOne({_id:cid},function(err,comment) {
        var len = comment.reply.length;          // 获取该叠楼评论中回复评论的条数
        for(var i = 0; i < len; i++) {
          // 如果找到该叠楼中点击删除的评论，则将其评论删除
          if(comment.reply[i] && comment.reply[i]._id.toString() === did) {
            comment.reply.splice(i,1);
          }
        }
        // 保存评论
        comment.save(function(err) {
          if(err){
            console.log(err);
          }
        });
        res.json({success:1});
      });
    // 若是点击第一条评论中的删除
    }else {
      Comment.remove({_id:cid},function(err) {
        if(err){
          console.log(err);
        }
        res.json({success:1});
      });
    }
};
