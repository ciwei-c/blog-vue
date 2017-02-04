$(function(){
	//文章
	new Vue({
		el:".articul",
		data:{
			listItems:""
		},
		created:function(){
			var params = {};
			var _this = this;
			params.limit = 5;
			$.get("artic/load_artics",params,function(data){
				if(data.ok == 1&&data.items.length){
					_this.listItems = data.items;					
				}
			});
		}
	})
})