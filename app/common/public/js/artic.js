$(function(){
	//文章
	var articWrap = new Vue({
		el:".artic-wrap",
		data:{
			item:"",
			prevArtic:"",
			nextArtic:"",
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
				_this.prevArtic = data.prevArtic;
				_this.nextArtic = data.nextArtic;
				var k = articType();
				breadcrumb.upSort = k[data.artic.type];
				breadcrumb.upSortType = data.artic.type;
				breadcrumb.nowArtic = data.artic.title;
			});
		}
	})
	//面包屑导航
	var breadcrumb = new Vue({
		el:".breadcrumbNav",
		data:{
			upSort:"",
			upSortType:"",
			nowArtic:""
		}
	})
	//发表评论
	var commontWrap = new Vue({
		el:".send-commont-wrap",
		data:{
			loginEmailAlert:false,
			registerAlert:false,
			commentText:"",
			userLoginEmail:"",
			userEmail:"",
			userNickname:"",
			loginErr:{
				info:"",
				errClass:{"has-error":false}
			},
			registerErr:{
				info:"",
				nickErrClass:{"has-error":false},
				emailErrClass:{"has-error":false}
			}
		},
		methods:{
			onLogin:function(){
				var _this = this;
				var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if(this.userLoginEmail == ""||!regEmail.test(this.userLoginEmail)){
					this.loginEmailAlert = true;
					this.loginErr.info = "邮箱格式不正确";
					this.loginErr.errClass["has-error"] = true;
				}else{
					$.post("user/login",{email:this.userLoginEmail},function(data){
						if(data.ok == 1){
							window.location.href = "artic?"+window.location.href.split("?")[1];
						}else{
							_this.loginEmailAlert = true;
							_this.loginErr.info = "用户不存在";
							_this.loginErr.errClass["has-error"] = true;
						}
					});
				}
			},
			onLogout:function(){
				$.post("user/logout",{},function(data){
					if(data.ok == 1){
						window.location.href = "artic?"+window.location.href.split("?")[1];
					}else if(data.ok == 0){
						alert(data.msg);
					}
				});
			},
			onHeadPick:function(evt){
				var file = evt.target.files[0];
				if(file.type == ""||file.type.split("/")[0] != "image"){
					alert("请选择图片！");
					return;
				}
				var data = new FormData();
				data.set("topath","user");
				data.append("c_file",file);
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
			},
			onComment:function(){
				if(this.commentText == ""){

					return;
				}
				var params = {};
				var _this = this;
				params.content = this.commentText;
				params.fromUser = $(".user-info").attr("userid");
				params.commentArtic = location.href.split("?")[1];
				$.post("comment/comment",params,function(data){
					if(data.ok == 1){
						commentList.onLoadComment();
						commentList.onLoadCommentCount();
						_this.commentText = "";
					}
				})
			},
			onRegister:function(){
				var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if(this.userNickname == ""){
					this.registerAlert = true;
					this.registerErr.info = "昵称不能为空";
					this.registerErr.nickErrClass["has-error"] = true;
				}else if(this.userEmail == "" || !regEmail.test(this.userEmail)){
					this.registerAlert = true;
					this.registerErr.info = "邮箱格式不正确";
					this.registerErr.emailErrClass["has-error"] = true;
				}else{
					var params = {};
					var _this = this;
					params.nickName = this.userNickname;
					params.email = this.userEmail;
					params.logo = $(".user-logo").attr("src");
					$.post("user/register",params,function(data){
						if(data.ok == 1){
							window.location.href = "artic?"+window.location.href.split("?")[1];
						}else{
							_this.registerAlert = true;
							_this.registerErr.info = "用户已存在";
							_this.registerErr.emailErrClass["has-error"] = true;
						}
					});
				}
			},
			onClearLoginErrInfo:function(){
				this.loginEmailAlert = false;
				this.loginErr.info = "";
				this.loginErr.errClass["has-error"] = false;
			},
			onClearRegErrInfo1:function(){
				this.registerAlert = false;
				this.registerErr.info = "";
				this.registerErr.nickErrClass["has-error"] = false;
			},
			onClearRegErrInfo2:function(){
				this.registerAlert = false;
				this.registerErr.info = "";
				this.registerErr.emailErrClass["has-error"] = false;
			}
		}
	})
	//评论列表
	var commentList = new Vue({
		el:".comment-wrap",
		data:{
			listItems:"",
			limitNum:10,
			count:"",
			pageLists:"",
			nowpage:"",
			href:"javascript:",
			commentArtic:"",
			replyText:"",
			toUser:"",
			fromUser:"",
			commentid:""
		},
		created:function(){
			this.commentArtic = window.location.href.split('?')[1];
			this.onLoadComment();
			this.onLoadCommentCount();
		},
		methods:{
			onLoadComment:function(page){
				var _this = this;
				var params = {};
				params.commentArtic = this.commentArtic;
				params.page = page?page:1;
				$.ajax({
					url:"comment/get_comment_content",
					type:"GET",
					dataType:"json",
					data:params,
					timeout:5000,
					beforeSend:function(){
						$(".loading").removeClass("none");
						_this.listItems = "";
					},
					success:function(data){
						setTimeout(function(){
							$(".loading").addClass("none");
							if(data.items&&data.items.length>0){
								data.items.forEach(function(item,index){
									item.creatAt = moment(item.creatAt).format("YYYY-MM-DD HH:mm");
									item.floorIndex = (index+1)+((params.page-1)*_this.limitNum);
									item.ifReply = false;
									if(item.reply){
										item.reply.forEach(function(_item){
											_item.creatAt = moment(_item.creatAt).format("YYYY-MM-DD HH:mm");
											_item.cindex = index;
											_item.ifReply = false;
										})
									}
								})
								_this.listItems = data.items;
							}
						},300)
						
					},
					error:function(xhr,status){
						console.log(xhr,"错误")
					}
				})
			},
			onLoadCommentCount:function(){
				var _this = this;
				$.get("comment/get_page_count",{commentArtic:this.commentArtic},function(data){
					_this.count = data.item.count;
					var pageCount = Math.ceil(data.item.count/_this.limitNum);
					if(pageCount>1){
						var arr = [];
						for(var i = 0 ; i < pageCount ; i ++){
							arr.push({isActive:false});
						}
						_this.pageLists = arr;
						_this.pageLists[0].isActive = true;
					}
				})
			},
			onPageClick:function(evt){
				var page = evt.target.getAttribute("page");
				this.pageLists.forEach(function(item,index){
					item.isActive = (page-1 == index)?true:false;
				})
				this.nowpage = page;
				this.onLoadComment(this.nowpage);
			},
			onReply:function(){
				var params = {};
				var _this = this;
				params.fromUser = this.fromUser;
				params.toUser = this.toUser;
				params.content = this.replyText;
				params._id = this.commentid;
				$.post("comment/reply",params,function(data){
					if(data.ok == 1){
						_this.onLoadComment(_this.nowpage);
						_this.replyText = "";
					}else{
						alert("请登录")
					}
				})
			},
			onShowReplyInput:function(evt){
				var c = "";
				var r = "";
				var dom = evt.target;
				c = dom.getAttribute("c-index");
				this.toUser = dom.getAttribute("touser");
		        this.fromUser = $(".user-info").attr("userid")||"";
		        this.commentid = this.listItems[c]._id;
				this.onClearIfReply();
				if(dom.hasAttribute("r-index")){
					r = dom.getAttribute("r-index");
					this.listItems[c].reply[r].ifReply = true;
				}else{
					this.listItems[c].ifReply = true;
				}
			},
			onClearIfReply:function(){
				this.listItems.forEach(function(item){
					item.ifReply = false;
					if(item.reply){
						item.reply.forEach(function(_item){
							_item.ifReply = false;
						})
					}
				})
				this.replyText = "";
			},
		}
	})
})