var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var modelName = "artic";

var articSchema = new Schema({
	content:String,
	title:String,
	type:String,
	commentCount:{type:Number,default:0},
	pv:{type:Number,default:0},
	//author:{type:String,default:"ciwei_c"},
	creatAt:{type:Date,default:Date.now()}
})

articSchema.statics.publish_artic = function(callback,params){
	if(!params.artic_content){
		callback("no content");
		return;
	}
	if(!params.artic_type){
		callback("no type");
		return;
	}
	if(!params.artic_title){
		callback("no title");
		return;
	}
	var _artic = new artic({
		content:params.artic_content,
		title:params.artic_title,
		type:params.artic_type,
		creatAt:Date.now()
	})
	_artic.save(function(err,res){
		if(err){
			console.log(err)
			callback(err);
			return;
		}
		callback(null);
	})
};
articSchema.statics.update_artic = function(callback,params){
	if(!params.artic_content){
		callback("no content");
		return;
	}
	if(!params.artic_type){
		callback("no type");
		return;
	}
	if(!params.artic_title){
		callback("no title");
		return;
	}
	this.findByIdAndUpdate(params._id,{$set:{
		content:params.artic_content,
		title:params.artic_title,
		type:params.artic_type
	}},function(err){
		if(err){
			console.log(err)
			callback(err);
			return;
		}
		callback(null);
	})
};
articSchema.statics.load_by_id = function(callback,params){
	var _id = params._id;
	var _this = this;
	this.update({_id,_id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err);
			callback(err);
		}
		_this.findOne({_id:_id},function(err,artic){
			if(err){
				console.log(err);
				callback(err);
				return;
			}
			if(params.prevnext){
				_this.find({},function(err,artics){
					var prevArtic = {};
					var nextArtic = {};
					var prevNextArtic = {};
					var nowIndex = "";
					for(var i = 0;i < artics.length ; i ++){
						if(artics[i]._id == _id){
							nowIndex = i;
						}
					}
				if(artics.length>1){
					if(nowIndex == 0){
						prevArtic._id = artics[nowIndex+1]._id;
						prevArtic.title = artics[nowIndex+1].title;
					}else if(nowIndex == artics.length-1){
						nextArtic._id = artics[nowIndex-1]._id;
						nextArtic.title = artics[nowIndex-1].title;
					}else{
						nextArtic._id = artics[nowIndex-1]._id;
						prevArtic._id = artics[nowIndex+1]._id;
						nextArtic.title = artics[nowIndex-1].title;
						prevArtic.title = artics[nowIndex+1].title;
					}
				}
					var data = {};
					data.artic = artic;
					data.prevArtic = prevArtic;
					data.nextArtic = nextArtic;
					callback(null,data)
				})
			}else{
				callback(null,artic);
			}
		})
	})
	
};
articSchema.statics.get_page_count = function(callback,params){
	var result = (params.artic_type?this.find({type:params.artic_type}):this.find({}));
	result.exec(function(err,data){
		if(err){
			callback(err);
			return;
		}
		callback(null,{count:data.length});
	})
};
articSchema.statics.get_type_count = function(callback,params){
	var type = {};
	type.all = 0;
	this.find({},function(err,artics){
		artics.forEach(function(artic){
			if(!type["tp"+artic.type]){
				type["tp"+artic.type] = 0;
			}
			type["tp"+artic.type] ++;
			type.all ++;
		})
		callback(null,type);
	})
};
articSchema.statics.load_artics = function(callback,params){
	var condition = {}
	if(params.artic_type){
		condition.type = params.artic_type;
	}
	if(params.search){
		condition.title = {$regex:params.search};
	}
	var result = this.find(condition);
	var skipNum;
	if(params.page&&params.limitNum){
		var limitNum = Number(params.limitNum)
		skipNum = params.page == 1?0:(params.page-1)*limitNum;
		result = result.skip(skipNum).limit(limitNum);
	}
	//加载分类
	result = (params.limit?result.limit(Number(params.limit)):result);
	result.sort({creatAt:-1})
	.exec(function(err,artics){
		if(err){
			console.log(err);
			callback(err);
			return;
		}
		callback(null,artics);
	})
};
articSchema.statics.remove_artic = function(callback,params){
	if(!params._id){
		callback("no id");
		return;
	}
	var _id = params._id;
	this.find({_id:_id},function(err,data){
		if(data&&data[0]){
			if(err){
				console.log(err);
				callback(err);
				return;
			}
			data[0].remove({_id:_id});
			callback(null);
		}else{
			callback("该数据已删除");
		}
	})
};
var artic = mongoose.model(modelName,articSchema);
exports.model = artic;
exports.modelName = modelName;