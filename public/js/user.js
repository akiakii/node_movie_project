$(function(){
	$(".del_user").click(function(e){
		var target=$(e.target);
		var id=target.data("id");
		var tr=$(".item-id-"+id);
		$.ajax({
			type: 'DELETE',
			url: "/admin/user/list?id=" +id,
			async: true,
			success:function(req){
				if(tr.length>0){
					tr.remove();
				}
			},
			error:function(){
				alert("出错");
			}
		})
	});
});
