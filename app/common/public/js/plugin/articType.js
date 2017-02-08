(function(global,method){
	global.articType = method;
}(this,function(listItems){
	var type = [];
	if(listItems){
		return type = [
				{type:"全部",count:0,isActive:true},
				{type:"随笔",count:0,isActive:false},
				{type:"html",count:0,isActive:false},
				{type:"css",count:0,isActive:false},
				{type:"js",count:0,isActive:false},
				{type:"前端",count:0,isActive:false},
				{type:"后台",count:0,isActive:false}
		]
	}else{
		return ["全部","随笔","html","css","js","前端","后台"];
	}
}))