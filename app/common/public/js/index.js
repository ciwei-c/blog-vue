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
			listItems:""
		},
		created:function(){
			var params = {};
			params.limit = 8;
			var _this = this;
			var d = document.createElement("div");
			var type = ["全部","随笔","html","js","node","mongodb"];
			$.get("artic/load_artics",params,function(data){
				if(data.ok == 1 && data.items.length){
					data.items.forEach(function(item){
						d.innerHTML = item.content;
						item.breif = d.innerText.substring(0,80);
						item.creatAt = moment(item.creatAt).format("YYYY-MM-DD HH:mm");
						item.type = type[item.type];
					})
					_this.listItems = data.items;
				}
			});
		}
	})
})