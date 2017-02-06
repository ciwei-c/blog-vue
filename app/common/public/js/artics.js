$(function(){
	//存放调用的方法
	var methodsVue = new Vue({
		data:{
			limitNum:10,
			pageCount:0
		},
		methods:{
			onLoadArtics:function(type,page){
				var params = {};
				var _this = this;
				params.page = page||1;
				params.limitNum = this.limitNum;
				if(type&&type>0){params.artic_type = type}
				$.ajax({
					url:"artic/load_artics",
					type:"GET",
					dataType:"json",
					data:params,
					timeout:5000,
					beforeSend:function(){
					},
					success:function(data){
						articList.listItems = "";
						pageList.listItems = "";
						$(".loading").removeClass("none");
						setTimeout(function() {
							$(".loading").addClass("none");
							data.items.forEach(function(item,index){
								item.creatAt = moment(item.creatAt).format("YYYY-MM-DD HH:mm");
								item.isOdd = (index%2==0?false:true);
							})
							articList.listItems = data.items;
							_this.onLoadPage(type,page);
						}, 300);
					},
					error:function(xhr,status){
						console.log(xhr,"错误")
					}
				})
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
			listItems:[
				{type:"全部",count:0,isActive:true},
				{type:"随笔",count:0,isActive:false},
				{type:"html",count:0,isActive:false},
				{type:"css",count:0,isActive:false},
				{type:"js",count:0,isActive:false},
				{type:"前端",count:0,isActive:false},
				{type:"后台",count:0,isActive:false}
			]
		},
		created:function(){
			methodsVue.onLoadCounts();
			methodsVue.onLoadArtics();
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
				methodsVue.onLoadArtics(tabIndex);
			}
		}
	})
	//文章列表
	var articList = new Vue({
		el:".articul-list",
		data:{
			listItems:""
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
				methodsVue.onLoadArtics(this.type,pageNum)
			}
		}
	})
})