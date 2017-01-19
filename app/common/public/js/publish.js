$(function(){
	//富文本编辑器
	$(document).ready(function(){
		$("head").append("<link href='bower/summernote/summernote.css' rel='stylesheet'>")
		$(".summernote").summernote({
			height:500,
			lang:'zh-CN' 
		});
		$(".note-statusbar").remove();
		$("#passmodal").modal({
			show:true,
			backdrop:"static",
			keyboard:false
		});
		$(".passcancel").click(function(){
			location.href = "/";
		})
		$(".passconfirm").click(function(){
			var pass = $(".passvalue").val();
			if(pass){
				$.post("user/permission",{pass:pass},function(data){
					if(data.ok ==1 ){
						$("#passmodal").modal("hide");
					}else{
						$(".passvalue").val("");
						$(".passalert").removeClass("none");
						$(".passvalue").on("input",function(){
							$(".passalert").addClass("none");
						})
					}
				})
			}else{
				$(".passalert").removeClass("none");
				$(".passvalue").on("input",function(){
					$(".passalert").addClass("none");
				})
			}
		});
	});
	//取消
	var cancel = {};
	//文章相关
	var _artics = {};
	  //文章类型选择
	var artictype = {};
	  //文章发布
	var articpost = {};
	//心情相关
	  //获取数据
	var _moods = {};
	//分页相关
	var page = {};
	//选择文章类型
	  //默认类型为随笔
	  artictype.type = 1;
	$(".dropdown-menu a").click(function(evt){
		artictype.type = evt.target.getAttribute("data-type");
		$(".typechoose").html(evt.target.innerText+"<span class='caret'></span>");
	})
	cancel.clear = function(){
		$(".artic-title").val("");
		$(".artic-title").removeAttr("_id")
		$(".mood-content").val("");
		$(".note-editable").html("");
		$(".articupdate").addClass("none");
		$(".articbtn").removeClass("none");
	};
	$(".cancel").click(cancel.clear);
	$(".nav li").click(cancel.clear);
	//获取心情、文章数量
	page.getpage = function(dom,data,limit){
		dom.html("");
		var html = "";
		var limitNum = "";
		limitNum = limit?limit.limitNum:5;
		var pages = Math.ceil(data.item.count/limitNum);
		if(pages == 1) return;
		for(var i = 1 ; i <= pages ; i ++){
			var active = (i==1?"active":"")
			html += "<li class=" + active + "><a href='javascript:' page=" + i + ">" + i + "</a></li>"
		}
		dom.html(html);
	};
	//发布文章
	articpost.post = function(action){
		var params = {};
		var url = "artic/publish_artic";
		params.artic_title = $(".artic-title").val();
		params.artic_content = $(".note-editable").html();
		params.artic_type = artictype.type;
		if($(".artic-title").attr("_id")){
			params._id = $(".artic-title").attr("_id");
			url = "artic/update_artic"
		}
		if(params.artic_title && params.artic_content){
			$.post(url, params, function(data) {
			if(data.ok == 1){
				cancel.clear();
				if(!confirm("发表成功，是否继续发表？")){
					window.location.href = "artics";
				}
			}});
		}else{
			$(".alert").removeClass("none");
			setTimeout(function(){
				$(".alert").addClass("none");
			},5000);
		}
	};
	$(".articbtn").click(articpost.post);
	//修改文章
	$(".articupdate").click(articpost.post);
	_artics.html = function(value){
		var html = "";
		html = "<li class='border-bottom clearfix padding-bottom-10 margin-bottom-10'>"
	          +"<div>" + moment(value.creatAt).format("YYYY-MM-DD HH:mm") + "</div>"
	          +"<div class='col-md-8 col-sm-8 col-xs-6'><a href='artic?"+ value._id +"'>"+ value.title +" </a></div>"
	          +"<div class='col-md-4 col-sm-4 col-xs-6 text-right'>"
	          +"<button _id=" + value._id + " class='btn btn-primary margin-right-10'>修改</button>"
	          +"<button _id=" + value._id + " class='btn btn-primary'>删除</button>"
	          +"</div>"
			  +"</li>"
		return html;
	};
	_artics.sethtml = function(data){
		var html = ""
		if(data.ok == 1 && data.items.length){
			var artics = data.items;
			$.each(artics,function(index,value){
				html += _artics.html(value);
			})
		}else{
			html = "<div class='padding-16'>你还没有发表文章</div>"
		}
		$(".articul").html(html)
	};
	//查看我的文章
	$(".myartic").click(function(){
		var params = {};
		params.page = 1;
		params.limitNum = 5;
		$.get("artic/load_artics",params,function(data){
			_artics.sethtml(data);
		});
		$.get("artic/get_page_count",{},function(data){
			page.getpage($(".artics_page_ul"),data,{limitNum:params.limitNum});
		})
	});
	//文章分页查询
	$(".artics_page_ul").delegate("a","click",function(evt){
		$(".artics_page_ul li").removeClass("active");
		var pageNum = Number(evt.target.getAttribute("page"));
		$(".artics_page_ul li").eq(pageNum-1).addClass("active");
		var params = {};
		params.page = pageNum;
		params.limitNum = 5;
		$.get("artic/load_artics",params,function(data){
			_artics.sethtml(data);
		})
	})
	//删除我的文章
	$(".articul").delegate("button","click",function(evt){
		var params = {};
		var _id = evt.target.getAttribute("_id");
		params._id = _id;
		if(evt.target.innerText == "删除"){
			var _this = $(this).parent().parent();
			var delete_confirm = confirm("确认删除这篇文章？")
			if(delete_confirm){
				$.post("artic/remove_artic",params,function(data){
					if(data.ok == 1){
						_this.remove();
					}
				})
			}
		}
		if(evt.target.innerText == "修改"){
			$.post("artic/load_by_id",params,function(data){
				if(data.ok == 1){
					$(".artic-title").val(data.item.title);
					$(".note-editable").html(data.item.content);
					$("#articlistmodal").modal("hide");
					$(".artic-title").attr("_id",data.item._id);
					$(".articupdate").removeClass("none");
					$(".articbtn").addClass("none");
				}
			})
		}
	});
	//心情相关
	_moods.html = function(value){
		var html = "";
		  html = "<li class='border-bottom clearfix padding-bottom-10 margin-bottom-10'>"
		        +"<div>" + moment(value.creatAt).format("YYYY-MM-DD HH:mm") + "</div>"
		        +"<div class='col-md-9 col-sm-9 col-xs-9'> "+ value.content +" </div>"
		        +"<div class='col-md-2 col-sm-2 col-xs-2 text-right'><a _id=" + value._id + " class='btn btn-primary'>删除</a></div>"
				+"</li>"
		return html;
	};
	_moods.sethtml = function(data){
		var html = "";
		if(data.ok == 1 && data.items.length){
			var moods = data.items;
			$.each(moods,function(index,value){
				html += _moods.html(value);
			})
		}else{
			html = "<div class='padding-16'>你还没有发表说说</div>"
		}
		$(".historyul").html(html)
	}
	//发布心情
	$(".moodbtn").click(function(){
		var params = {}
		params.mood_content = $(".mood-content").val();
		$.post("mood/publish_mood", params, function(data) {
			if(data.ok == 1){
				cancel.clear();
				alert("发表成功");
			}
		});
	});
	//查看历史心情
	$(".history").click(function(){
		var params = {};
		params.page = 1;
		$.get("mood/load_moods",params,function(data){
			_moods.sethtml(data);
		});
		$.get("mood/get_page_count",function(data){
			page.getpage($(".moods_page_ul"),data);
		});
	});
	//心情分页数据
	$(".moods_page_ul").delegate("a","click",function(evt){
		$(".moods_page_ul li").removeClass("active");
		var pageNum = Number(evt.target.getAttribute("page"));
		$(".moods_page_ul li").eq(pageNum-1).addClass("active");
		var params = {};
		params.page = pageNum;
		$.get("mood/load_moods",params,function(data){
			_moods.sethtml(data);
		})
	})
	//删除心情
	$(".historyul").delegate("a","click",function(evt){
		var _this = $(this).parent().parent();
		var delete_confirm = confirm("确认删除这条说说?")
		if(delete_confirm){
			var params = {};
			var _id = evt.target.getAttribute("_id");
			params._id = _id;
			$.post("mood/remove_mood",params,function(data){
				if(data.ok == 1){
					_this.remove();
				}
			})	
		}
	});
})