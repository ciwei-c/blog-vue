(function(global,method){
	global.htmls = method;
}(this,function(options){
	var _r = "";
	//创建节点
	function createDom(params){
		var domNode = "";
		var domNode = document.createElement(params.tagName||"");
		//是否设置class
		if(params.class){
			domNode.className = "";
			domNode.className = params.class
		}
		//是否设置attr
		if(params.attr){
			var attrs = params.attr;
			for(var k in attrs){
				domNode.setAttribute(k,attrs[k])
			}
		}
		//是否设置text
		if(params.text){
			domNode.innerHTML = params.text;
		}
		if(params.subDomNode){
			domNode = each(params.subDomNode,domNode);
		}
		return domNode;
	}
	//创建后的节点转换成字符串
	function domToStr(domNode){
		var _d = document.createElement("div");
		_d.appendChild(domNode);
		return _d.innerHTML;
	}
	//遍历传入的数据
	function each(options,domNode){
		var _c = domNode?domNode:"";
		if(Object.prototype.toString.call(options) === "[object Array]"){
			if(_c){
				options.forEach(function(item){
					_c.appendChild(createDom(item))
				})
				return _c;
			}else{
				options.forEach(function(item){
					_r += domToStr(createDom(item))
				})
			}
		}else if(typeof options === "object"){
			if(_c){
				_c.appendChild(createDom(options));
				return _c;
			}else{
				_r = domToStr(createDom(options))
			}
		}
	}
	each(options);
	return _r;
}))