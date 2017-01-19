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