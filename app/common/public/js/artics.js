$(function(){
	//存放调用的方法
	var methodsVue = new Vue({
		data:{
			limitNum:10,
			pageCount:0
		},
		methods:{
			onLoadArtics:function(options){
				var type,page,Alist,Plist,search
				type = options.type||"";
				page = options.page||1;
				Alist = options.Alist||"";
				Plist = options.Plist||"";
				search = options.search||"";
				//searchResult = options.searchResult||"";
				var params = {};
				var _this = this;
				params.page = page;
				params.limitNum = this.limitNum;
				if(type&&type>0){params.artic_type = type}
				if(search||search != ""){
					params.search = search;
					delete params.limitNum;
					$.ajax({
						url:"artic/load_artics",
						type:"GET",
						dataType:"json",
						data:params,
						timeout:5000,
						beforeSend:function(){
							searchResult.listItems = "";
							searchResult.isShow = true;
						},
						success:function(data){
							setTimeout(function(){
								searchResult.isShow = false;
								if(data.items.length){
									searchResult.listItems = data.items;
								}else{
									searchResult.listItems = "nofound";
								}
							},500)
						},
						error:function(xhr,status){
							console.log(xhr,"错误")
						}
					})
				}else{
					$.ajax({
						url:"artic/load_artics",
						type:"GET",
						dataType:"json",
						data:params,
						timeout:5000,
						beforeSend:function(){
							if(Alist){
								Alist.listItems = "";
								Alist.isShow = true;
								Alist.noArtics = false;
							}
							if(Plist){
								Plist.listItems = "";
							}
						},
						success:function(data){
							setTimeout(function() {
								Alist.isShow = false;
								if(!data.items.length){
									Alist.noArtics = true;
									return;
								}
								data.items.forEach(function(item,index){
									item.creatAt = moment(item.creatAt).format("YYYY-MM-DD HH:mm");
									item.isOdd = (index%2==0?false:true);
								})
								Alist.listItems = data.items;
								_this.onLoadPage(type,page);
							}, 300);
						},
						error:function(xhr,status){
							console.log(xhr,"错误")
						}
					})
				}
			},
			onLoadPage:function(type,page){
				var k = "";
				k = Math.ceil((navtab.listItems[type||0].count)/this.limitNum);
				if(k>1){
					var pageCount = [];
					for (var i = 0; i < k; i++) {
						pageCount.push({isActive:false})
					}
					if(!page||page == 1){
						pageCount[0].isActive = true;
					}else{
						pageCount[page-1].isActive = true;
					}
					pageList.listItems = pageCount;
					pageList.type = type;
				}else{
					pageList.listItems = "";
				}
			},
			onLoadCounts:function(){
				var _this = this;
				$.get("artic/get_type_count",{},function(data){
					if(data.ok == 1){
						navtab.listItems.forEach(function(item,index){
							if(data.item){
								if(index == 0 && data.item.all){
									item.count = data.item.all;
								}else if(data.item["tp"+index]){
									item.count = data.item["tp"+index];
								}
							}
						})
					}
				});
			}
		}
	})
	//搜索框
	var searchBox = new Vue({
		el:".searchbox",
		data:{
			search:""
		},
		methods:{
			onSearch:function(){
				searchResult.noSearch = false;
				if(!this.search){
					searchResult.noSearch = true;
					return;
				}
				methodsVue.onLoadArtics({
					search:this.search
				});
				this.search = "";
			}
		}
	})
	var searchResult = new Vue({
		el:".searchresult",
		data:{
			noSearch:false,
			listItems:"",
			pageList:"",
			isShow:false,
			type:articType()
		}
	})
	//响应式导航栏
	var classifyCollapse = new Vue({
		el:".classifycollapse",
		data:{
			label:"展开分类",
			classObject:{
				"fa-angle-down":true,
				"fa-angle-up":false,
			}
		},
		methods:{
			onClassifyClick:function(){
				this.label = (this.label == "展开分类")?"收起分类":"展开分类";
				for(var k in this.classObject){
					this.classObject[k] = !this.classObject[k];
				}
			}
		}
	})
	//导航栏
	var navtab = new Vue({
		el:"#navtab",
		data:{
			href:"javascript:",
			listItems:articType(true)
		},
		created:function(){
			if(window.location.href.split("?")[1]){
				var type = "";
				type = window.location.href.split("?")[1];
				type = type.split("=")[1];
				this.listItems[0].isActive = false;
				this.listItems[type].isActive = true;
			}
			methodsVue.onLoadCounts();
		},
		methods:{
			onNavClick:function(evt){
				var tabIndex = evt.target.getAttribute("tabindex")||evt.target.parentNode.getAttribute("tabindex");
				//选中点击项目
				this.listItems.forEach(function(item){
					item.isActive = false;
				})
				this.listItems[tabIndex].isActive = true;
				//发送ajax请求
				methodsVue.onLoadArtics({
					type:tabIndex,
					Alist:articList,
					Plist:pageList
				});
			}
		}
	})
	//文章列表
	var articList = new Vue({
		el:".articul-list",
		data:{
			listItems:"",
			isShow:false,
			noArtics:false
		},
		created:function(){
			var _this = this;
			if(window.location.href.split("?")[1]){
				var type = "";
				type = window.location.href.split("?")[1];
				type = type.split("=")[1];
				methodsVue.onLoadArtics({
					type:type,
					Alist:_this
				});
			}else{
				methodsVue.onLoadArtics({
					Alist:_this
				});
			}
		}
	})
	//分页
	var pageList = new Vue({
		el:".artics-page-ul",
		data:{
			href:"javascript:",
			listItems:"",
			type:""
		},
		methods:{
			onPageClick:function(evt){
				var pageNum = "";
				var pageNum = Number(evt.target.getAttribute("page"));
				methodsVue.onLoadArtics({
					type:this.type,
					page:pageNum,
					Alist:articList
				})
			}
		}
	})
})