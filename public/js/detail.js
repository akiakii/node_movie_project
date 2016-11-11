//$(function(){});是$(document).ready(function(){ })的简写.
$(function(){
	// $("#mediaList").onclick(function(e){
	// 	var target=$(this);
	// 	var commentId=target.data("cid");
	// 	var toId=target.data("tid");
	// 	$(target).parents('.media-body').attr('id','mediaBody');
	// 	if($("#toId").length>0){
	// 		$("#toId").val(toId);
	// 	}else{
	// 		$("<input>").attr({
	// 			type:"hidden",
	// 			id:"toId",
	// 			name:"comment[tid]",
	// 			value:toId
	// 		}).appendTo("#commentForm");
	// 	};
	
	// 	if($("#commentId").length>0){
	// 		$("#commentId").val(commentId);
	// 	}else{
	// 		$("<input>").attr({
	// 			type:"hidden",
	// 			id:"commentId",
	// 			name:"comment[cid]",
	// 			value:commentId
	// 		}).appendTo("#commentForm");
	// 	};
		
	// });

	$('#mediaList').on('click','.comment',function() {
    var target = $(this),                     // 获取点击回复的评论对象
        toId = target.data('tid'),            // 被评论人的ID值
        commentId = target.data('cid');       // 该条评论内容的ID值
    // 给当前要叠楼回复的楼主添加ID值
    $(target).parents('.media-body').attr('id','mediaBody');
    if($('#toId').length > 0) {
      $('#toId').val(toId);
    }else {
      $('<input>').attr({
        type: 'hidden',
        id: 'toId',
        name: 'comment[tid]',
        value: toId                             // 被评论人ID
      }).appendTo('#commentForm');
    }

    if($('#commentId').length > 0) {
      $('#commentId').val(commentId);
    }else {
      $('<input>').attr({
        type: 'hidden',
        id: 'commentId',
        name: 'comment[cid]',
        value: commentId                         // 该评论，即该叠楼在数据库中的ID
      }).appendTo('#commentForm');
    }
  });
	$('#comments button').on('click',function(event){
		event.preventDefault();
		$.ajax({
			url:'/user/comment',
			type:'POST',
			data:{
				'comment[movie]':$('#comments input[name="comment[movie]"]').val(), // 电影ID
          		'comment[from]':$('#comments input[name="comment[from]"]').val(),   // 回复人ID
				'comment[content]':$('#comments textarea').val(),
				'comment[tid]':$('#toId').val(),                									// 被回复人ID
         		'comment[cid]':$('#commentId').val()  
			}

		}).done(function(results){
			var data = results.data||{};
			if(data.reply.length) 
			{
       		var len = data.reply.length;
       		console.log(data.reply);                      // 回复评论人的条数
        	$('#mediaBody').append('<div calss="media"><div class="pull-left"><img class="media-object" src="/upload/'+data.reply[len-1].from.img+'" style="width:60px; height:60px;"></div><div class="media-body"><h4 class="media-heading">'+ data.reply[len-1].from.name +'<span class="text-info">回复</span>'+ data.reply[len-1].to.name +'</h4><p>'+ data.reply[len-1].content +'</p><a href="javascript:;" style="float:right" class="comment-del" data-did='+ data.reply[len-1]._id +' data-cid='+ data._id+'>删除</a><a class="comment" href="#comments" data-cid='+data._id+' data-tid='+data.reply[len-1].to._id+' style="float:right">回复&nbsp;&nbsp;&nbsp;&nbsp;</a><br></div></div>');
      // 如果是发表新评论
      		}
      		else{
			$("#mediaList").append('<li calss="media"><div class="pull-left"><a class="comment" href="#comments" ><img class="media-object" src="/upload/'+data.from.img+'" style="width:60px; height:60px;"></a></div><div class="media-body"><h4 class="media-heading">'+data.from.name+'</h4><p>'+data.content+'</p><a href="javascript:;" style="float:right" class="comment-del" data-cid='+data._id+'>删除</a><a  class="comment" data-cid='+data._id+' href="#comments" data-tid='+data.from._id+' style="float:right">回复&nbsp;&nbsp;&nbsp;&nbsp;</a><br></div><hr></li>');
			}
			$("#comments textarea").val("");
			$('#mediaBody').removeAttr('id');
			$('#commentForm input:gt(1)').remove();
		})
	});
	  // 删除评论功能
  $('#mediaList').on('click','.comment-del',function(event) {
    var $omediaBody = $(this).parent('.media-body');	
    console.log($omediaBody);	// 获取点击删除a元素的父节点
    var cid = $(event.target).data('cid');  						// 获取该删除评论的id
    // 如果点击的是叠楼中的回复评论还要获取该回复评论的自身id值
    var did = $(event.target).data('did');
    $.ajax({
      url: '/movie/:id?cid='+cid+'&did='+did,
      type: 'DELETE',
    }).done(function(results) {
      if(results.success === 1) {
        // 获取.media-body的父节点并删除
        $omediaBody.parent().remove();
      }
    });
  });
});