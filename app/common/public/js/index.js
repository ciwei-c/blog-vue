$(function(){
	new Vue({
		el:".articul-index",
		data:{
			listItems:""
		},
		created:function(){
			var params = {};
			params.limit = 5;
			var _this = this;
			$.get("artic/load_artics",params,function(data){
				if(data.ok == 1 && data.items.length){
					data.items.forEach(function(item){
						item.creatAt = moment(item.creatAt).format("YYYY-MM-DD HH:mm")
					})
					_this.listItems = data.items;
				}
			});
		}
	})
})