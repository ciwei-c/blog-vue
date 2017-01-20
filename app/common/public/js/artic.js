$(function(){
	//页面初始化
	$(document).ready(function(){
		// var params = {};
		// _artic._id = window.location.href.split('?')[1]
		// // params._id = _artic._id;
		// // params.prevnext = true;
		// // $.get("artic/load_by_id",params,function(data){
		// // 	_artic.sethtml(data);
		// // });
		// params = {};
		// params.commentArtic = _artic._id;
		// params.page = 1;
		// $.get("comment/get_comment_content",params,function(data){
		// 	_comment.sethtml(data,params.page);
		// 	if(data.items.length){
		// 		$.get("comment/get_page_count",{commentArtic:_artic._id},function(data){
		// 			_comment.getpage(data.item.count);
		// 			$(".comment-count").text("("+data.item.count+")")
		// 		})
		// 	}
		// })
	});
	//文章相关
	var _artic = {};
	//用户相关
	var _user = {};
	//评论相关
	var _comment = {};
	//回复相关
	var _reply = {};
	//登陆或注册成功刷新页面
	_artic.refresh = function(){
		window.location.href = "artic?"+_artic._id;
	};
	//评论获取分页的数量
	_comment.getpage = function(data){
		$(".comment-page-ul").html("");
		var html = "";
		var limitNum = 10;
		var pages = Math.ceil(data/limitNum);
		if(pages == 1) return;
		for(var i = 1 ; i <= pages ; i ++){
			var active = (i==1?"active":"")
			html += "<li class=" + active + "><a href='javascript:' page=" + i + ">" + i + "</a></li>"
		}
		$(".comment-page-ul").html(html);
	};
	//评论区的html片段
	_comment.html = function(value,index){
		var html = "";
		var replyhtml = "";
		var replycount = 0;
		var index = Number(index)+1;
		if(value.reply.length){
			$.each(value.reply,function(index,item){
				replyhtml += _reply.html(item);
			})
			replycount = value.reply.length;
			replyhtml = "<ul class='ul clearfix'>"+ replyhtml +"</ul>";
		}
		html = "<li class='clearfix comment-list margin-bottom-16' commentid="+ value._id +">"
		      +"<div class='text-center inlineblock col-md-2 col-sm-2'><img src="+ value.fromUser.logo +" class='size60 img-responsive img-thumbnail'><div class='font-size-12'>"+ value.fromUser.nickName +"</div></div>"
			  +"<div class='col-md-10 col-sm-10'>"
			  +"<p class='minwidth'>"+ value.content +"</p>"
			  +"<div class='right'><span>"+ index +"楼 |</span><span> "+ moment(value.creatAt).format("YYYY-MM-DD HH:mm") +" | </span>"
			  +"<a href='javascript:' class='a show-reply-input' toUser="+ value.fromUser._id +">回复("+replycount+")</a>"
			  +"</div>"
			  +replyhtml
			  +"</div>"
			  +"</li>"
			  +"<hr>"
		return html;
	};
	//获取数据后生成评论区的html片段
	_comment.sethtml = function(data,nowpage){
		var html = "";
		if(data.ok == 1 && data.items.length){
			$.each(data.items,function(index,value){
				html += _comment.html(value,(nowpage-1)*10+index);
			})
		}else{
			html = "<div class='padding-16'>暂未有评论</div>";
		}
		$(".comment-wrap").html(html);
	};
	//回复区的表单html片段
	_reply.inputhtml = function(){
		var html = "";
		html = "<form class='reply-form'>"
			  +"<textarea class='form-control noresize reply-text margin-bottom-16' placeholder='快发表你的见解吧' rows='4'></textarea>"
			  +"<a class='btn btn-primary reply margin-right-16'>发表</a>"
			  +"<a class='btn btn-primary reply-cancel'>取消</a>"
			  +"</form>"
		return html;
	};
	//回复区的html片段
	_reply.html = function(value){
		var html = "";
		html ="<hr><li class='clearfix'>"
		      +"<div class='left'><img src="+ value.fromUser.logo +" class='size40 hidden-xs img-responsive img-thumbnail'></div>"
		      +"<div class='col-md-10 col-sm-10'>"
		      +"<p><span> "+value.fromUser.nickName+" 回复 "+value.toUser.nickName+" : </span>"+ value.content +"</p>"
		      +"<div class='right'><span> "+ moment(value.creatAt).format("YYYY-MM-DD HH:mm") +" | </span>"
			  +"<a href='javascript:' class='a show-reply-input' toUser="+ value.fromUser._id +">回复</a>"
			  +"</div>"
		      +"</div>"
		      +"</li>"
		return html;
	};
	//用户错误信息提示方法
	_user.showError = function(alertDom,hasErrorDom,errtext){
		$("."+alertDom).removeClass("none");
		$("."+alertDom).text(errtext);
		$("."+hasErrorDom).addClass("has-error");
	};
	//用户错误信息隐藏方法
	_user.hideError = function(alertDom,hasErrorDom){
		$("."+alertDom).addClass("none");
		$("."+alertDom).text("");
		$("."+hasErrorDom).removeClass("has-error");
	};
	//新用户注册
	$(".user-register").click(function(){
		var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if($(".user-nickname").val() == ""||$(".user-email").val() == ""||!regEmail.test($(".user-email").val())){
			if($(".user-nickname").val() == ""){
				_user.showError("nickname-alert","register-nickname","昵称不能为空");
			}
			if($(".user-email").val() == ""||!regEmail.test($(".user-email").val())){
				_user.showError("email-alert","register-email","邮箱格式不正确");
			}
		}else{
			var params = {};
			params.nickName = $(".user-nickname").val();
			params.email = $(".user-email").val();
			params.logo = $(".user-logo").attr("src");
			$.post("user/register",params,function(data){
				if(data.ok == 1){
					_artic.refresh();
				}else{
					_user.showError("email-alert","register-email","邮箱已存在");
				}
			});
		}
	});
	//登陆
	$(".user-login").click(function(){
		var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if($(".user-login-email").val() == ""||!regEmail.test($(".user-login-email").val())){
			_user.showError("login-email-alert","login-email","邮箱格式不正确");
		}else{
			var params = {};
			params.email = $(".user-login-email").val();
			$.post("user/login",params,function(data){
				if(data.ok == 1){
					_artic.refresh();
				}else{
					_user.showError("login-email-alert","login-email","用户不存在");
				}
			});
		}
	});
	//登出
	$(".user-logout").click(function(){
		$.post("user/logout",{},function(data){
			if(data.ok == 1){
				_artic.refresh();
			}else if(data.ok == 0){
				alert(data.msg);
			}
		});
	})
	//输入框正在输入时隐藏错误提示
	$(".user-nickname").on("input",function(){
		_user.hideError("nickname-alert","register-nickname")
	});
	$(".user-email").on("input",function(){
		_user.hideError("email-alert","register-email")
	});
	$(".user-login-email").on("input",function(){
		_user.hideError("login-email-alert","login-email")
	});
	//用户选择头像
	$(".user-head-picker").on("change",function(e){
		var file = e.target.files[0];
		if(file.type == ""||file.type.split("/")[0] != "image"){
			alert("请选择图片！");
			return;
		}
		var data = new FormData();
		data.append("user-logo",file);
		$.ajax({
			url: "upload",
		  	type: "POST",
		  	data: data,
		  	contentType: false, //必须false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理 
		  	processData: false, //必须false才会自动加上正确的Content-Type
		  	success: function (data) {
		  		$(".user-logo").attr("src",data.path);
		  	}
		 });
	});
	//发表评论
	$(".comment").click(function(){
		var commentText = $(".comment-text").val();
		if(commentText == ""){
			$(".comment-alert").removeClass("none");
			return;
		}
		var params = {};
		params.content = commentText;
		params.fromUser = $(".user-info").attr("userid");
		params.commentArtic = location.href.split("?")[1];
		$.post("comment/comment",params,function(data){
			if(data.ok == 1){
				params = {};
				params.commentArtic = _artic._id;
				params.page = 1;
				$.get("comment/get_comment_content",params,function(data){
					_comment.sethtml(data,params.page);
					if(data.items.length){
						$.get("comment/get_page_count",{commentArtic:_artic._id},function(data){
							_comment.getpage(data.item.count);
							$(".comment-count").text("("+data.item.count+")")
						})
					}
				})
				var commentText = $(".comment-text").val("");
			}
		})
	});
	$(".comment-text").on("input",function(){
		$(".comment-alert").addClass("none");
	});
	//评论分页数据
	$(".comment-page-ul").delegate("a","click",function(evt){
		if(evt.target.parentNode.getAttribute("class").indexOf("active") == 0) return;
		$(".comment-page-ul li").removeClass("active");
		var pageNum = Number(evt.target.getAttribute("page"));
		$(".comment-page-ul li").eq(pageNum-1).addClass("active");
		$.get("comment/get_comment_content",{page:pageNum,commentArtic:_artic._id},function(data){
			_comment.sethtml(data,pageNum);
		})
	});
	//显示回复的表单
	$(".comment-wrap").delegate(".show-reply-input","click",function(){
		_reply.toUser = "";
		_comment._id = "";
		_reply.toUser = $(this).attr("toUser");
		_comment._id = $(this).parents(".comment-list").attr("commentid");
		if($(".reply-form")){
			$(".reply-form").remove();
		}
		var targetDom = $(this).parent();
		targetDom.after(_reply.inputhtml())
	});
	//取消回复
	$(".comment-wrap").delegate(".reply-cancel","click",function(){
		$(".reply-form").remove();
	});
	//回复
	$(".comment-wrap").delegate(".reply","click",function(){
		var params = {};
		params.toUser = _reply.toUser;
		params.fromUser = $(".user-info").attr("userid")||"";
		if(!params.fromUser){
			alert("请登陆回复");
			return;
		}
		params.content = $(".reply-text").val();
		params._id = _comment._id;
		$.post("comment/reply",params,function(data){
			if(data.ok == 1){
				$(".reply-form").remove();
				params = {};
				params.commentArtic = _artic._id;
				params.page = 1;
				$.each($(".comment-page-ul li"),function(index,value){
					if(value.className == "active"){
						params.page = index+1;
					}
				})
				$.get("comment/get_comment_content",params,function(data){
					_comment.sethtml(data,params.page);
				})
			}
		})
	});
	//文章
	var articWrap = new Vue({
		el:".artic-wrap",
		data:{
			item:"",
			prevnext:""
		},
		created:function(){
			var params = {};
			var _this = this;
			params._id = window.location.href.split("?")[1];
			params.prevnext = true;
			$.get("artic/load_by_id",params,function(data){
				var data = data.item;
				data.artic.creatAt = moment(data.artic.creatAt).format("YYYY-MM-DD HH:mm");
				_this.item = data.artic;
				_this.prevnext = data.prevNextArtic;
			});
		}
	})
	//评论
	var commentList = new Vue({
		el:".comment-wrap",
		data:{
			listItems:"",
			count:"",
			href:"javascript:",
			replyForm:"",
			targetDom:""
		},
		created:function(){
			var params = {};
			var _this = this;
			params.commentArtic = window.location.href.split('?')[1];
			params.page = 1;
			$.get("comment/get_comment_content",params,function(data){
				data.items.forEach(function(item,index){
					item.creatAt = moment(item.creatAt).format("YYYY-MM-DD HH:mm");
					item.floorIndex = (index+1)+((params.page-1)*10)
					if(item.reply){
						item.reply.forEach(function(_item){
							_item.creatAt = moment(_item.creatAt).format("YYYY-MM-DD HH:mm");
						})
					}
				})
				_this.listItems = data.items;
			})
			$.get("comment/get_page_count",{commentArtic:params.commentArtic},function(data){
				_this.count = data.item.count;
			})
		},
		methods:{
			onReply:function(evt){
				if(this.replyForm){
					oldReplyForm = this.replyForm;
					oldTargetDom = this.targetDom;
					this.onRemoveReplyForm(oldTargetDom,oldReplyForm);
				}
				this.targetDom = evt.target.parentNode.parentNode;
				this.replyForm = document.createElement("form");
				this.replyForm.innerHTML = this.getReplyInput();
				this.targetDom.appendChild(this.replyForm);
			},
			getReplyInput:function(){
				var html = "";
				html = htmls([{
						tagName:"textarea",
						class:"form-control noresize reply-text margin-bottom-16",
						attr:{
							placeholder:"快发表你的见解吧",
							rows:"4"
						}
					},{
						tagName:"a",
						class:"btn btn-primary reply-confirm margin-right-16",
						text:"发表"
					},{
						tagName:"a",
						class:"btn btn-primary reply-cancel",
						text:"取消"
					}]);
				return html;
			},
			onRemoveReplyForm:function(targetDom,oldReplyForm){
				targetDom.removeChild(oldReplyForm);
			}
		}
	})
})