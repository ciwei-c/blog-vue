var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var modelName = "mood";
var moodSchema = new Schema({
	content:String,
	creatAt:{
		type:Date,
		default:Date.now()
	}
});

moodSchema.statics.publish_mood = function(callback,params){
	if(!params.mood_content){
		callback("no content");
		return;
	}
	var _mood = new mood({
		content:params.mood_content,
		creatAt:Date.now()
	});
	_mood.save(function(err,res){
		if(err){
			console.log(err)
			callback(err);
			return;
		}
		callback(null)
	});
};
moodSchema.statics.load_one_mood = function(callback){
	return this.find({}).exec(function(err,data){
		var data = data[data.length-1];
		var params = {};
		params.content = "";
		params.creatAt = "";
		if(err){
			console.log(err);
			callback(err);
			return;
		}
		if(!data){
			params.content = "还没有发表说说";
		}else{
			params.content = data.content;
			params.creatAt = data.creatAt;
		}
	    callback(null,params);
	})
};
moodSchema.statics.get_page_count = function(callback){
	return this.find({}).exec(function(err,data){
		if(err){
			console.log(err);
			callback(err);
			return;
		}
		callback(null,{count:data.length});
	})
};
moodSchema.statics.load_moods = function(callback,params,req){
	var result = this.find({});
	var skipNum;
	if(params.page){
		skipNum = params.page == 1?0:(params.page-1)*5;
		result = result.skip(skipNum).limit(5);
	}
	return result.sort({creatAt:-1}).exec(function(err,histroymood){
		if(err){
			console.log(err)
			callback(err);
			return;
		}
		if(!histroymood){
			callback("没有历史心情");
			return;
		}
		callback(null,histroymood);
	});
};
moodSchema.statics.remove_mood = function(callback,params){
	if(!params._id){
		callback("no id");
		return;
	}
	var _id = params._id;
	return this.find({_id:_id}).exec(function(err,data){
		if(data&&data[0]){
			if(err){
				console.log(err);
				callback(err);
				return;
			}
			data[0].remove({_id:_id});	
			callback(null);
		}else{
			callback("该数据已删除")
		}
	});
};
var mood = mongoose.model(modelName,moodSchema);
exports.model = mood;