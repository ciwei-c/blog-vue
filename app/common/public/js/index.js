$(function(){
	//说说
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