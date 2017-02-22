$(function(){
	//闲言碎语
	new Vue({
		el:".mood-panel",
		data:{
			item:""
		},
		created:function(){
			var _this = this;
			$.get("mood/load_one_mood",{},function(data){
				data.item.creatAt = moment(data.item.creatAt).format("YYYY-MM-DD HH:mm");
				_this.item = data.item;
			})
		}
	})
	new Vue({
		el:".tags-panel",
		data:{
			listItems:articType(),
			count:[],
			colors:["#F44336","#FF5722","#efdf57","#8BC34A","#4CAF50","#00BCD4","#673AB7"]
		},
		created:function(){
			var _this = this;
			$.get("artic/get_type_count",{},function(data){
				if(data.ok == 1){
					_this.listItems.forEach(function(item,index){
						if(data.item){
							if(index == 0 && data.item.all){
								_this.count.push(data.item.all);
							}else if(data.item["tp"+index]){
								_this.count.push(data.item["tp"+index]);
							}else{
								_this.count.push(0);
							}
						}
					})
				}
			});
		}
	})
	new Vue({
		el:".articul-index",
		data:{
			listItems:"",
			isShow:false
		},
		created:function(){
			var params = {};
			params.limit = 8;
			var _this = this;
			var d = document.createElement("div");
			var type = articType();
			$.ajax({
				url:"artic/load_artics",
				type:"GET",
				dataType:"json",
				data:params,
				timeout:5000,
				beforeSend:function(){
					_this.isShow = true;
				},
				success:function(data){
					if(data.ok == 1 && data.items.length){
						_this.isShow = false;
						data.items.forEach(function(item){
							d.innerHTML = item.content;
							item.breif = d.innerText.substring(0,80);
							item.creatAt = moment(item.creatAt).format("YYYY-MM-DD HH:mm");
							item.typeName = type[item.type];
						})
						_this.listItems = data.items;
					}
				},
				error:function(xhr,status){
					console.log(xhr,"错误")
				}
			})
		}
	})
})