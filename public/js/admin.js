//在这里写删除的逻辑
//$(function(){});是$(document).ready(function(){ })的简写.
$(function(){
	$(".del").click(function(e){
		var target=$(e.target);
		var id=target.data("id");
		var tr=$(".item-id-"+id);
		$.ajax({
			type: 'DELETE',
			url: "/admin/movie/list?id=" +id,
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

	$("#douban").blur(function(){
		var douban =$(this);
		var id=douban.val();
		if(id){
			$.ajax({
				url:"https://api.douban.com/v2/movie/subject/" + id,
				cache:true,
				type:"get",
				dataType:"jsonp",
				crossDomain:true,
				jsonp:"callback",
				success:function(data){
					$("#inputTitle").val(data.title);
					$("#inputDoctor").val(data.directors[0].name);
					$("#inputCountry").val(data.countries[0]);
					$("#inputPoster").val(data.images.large);
					$("#inputYear").val(data.year);
					$("#inputSummary").val(data.summary);
				}
			});
		}
	});
});