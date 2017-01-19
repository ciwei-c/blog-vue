var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var modelName = "comment";
var commentSchema = new Schema({
	fromUser:{type:ObjectId,ref:require("./user").modelName},
	reply:[{
		fromUser:{type:ObjectId,ref:require("./user").modelName},
		toUser:{type:ObjectId,ref:require("./user").modelName},
		content:String,
		creatAt:Date
	}],
	commentArtic:{type:ObjectId,ref:require("./artic").modelName},
	content:String,
	creatAt:{type:Date,default:Date.now()}
});

commentSchema.statics.comment = function(callback,params){
	if(!params.fromUser){
		callback("no fromUser");
		return;
	}
	if(!params.commentArtic){
		callback("no commentArtic");
		return;
	}
	if(!params.content){
		callback("no content");
		return;
	}

	var _comment = new comment({
		fromUser:params.fromUser,
		commentArtic:params.commentArtic,
		content:params.content,
		creatAt:Date.now()
	})

	_comment.save(function(err,data){
		if(err){
			callback(err);
			return;
		}
		callback(null);
	})
};

commentSchema.statics.reply = function(callback,params){
	if(!params.fromUser){
		callback("no fromUser");
		return;
	}
	if(!params.toUser){
		callback("no toUser");
		return;
	}
	if(!params.content){
		callback("no content");
		return;
	}
	if(!params._id){
		callback("no _id");
		return;
	}
	this.findOne({_id:params._id},function(err,comment){
		if(err){
			callback(err);
			return;
		}
		var reply = {
			fromUser:params.fromUser,
			toUser:params.toUser,
			content:params.content,
			creatAt:Date.now()
		};

		comment.reply.push(reply);
		comment.save(function(err){
			if(err){
				callback(err);
				return;
			}
			callback(null);
		})
	})
};

commentSchema.statics.get_comment_content = function(callback,params){
	var skipNum = (Number(params.page)-1)*10;
	this.find({commentArtic:params.commentArtic})
	.skip(skipNum)
	.limit(10)
	.populate("fromUser","nickName logo")
	.populate("reply.fromUser reply.toUser","nickName logo")
	.exec(function(err,comments){
		if(err){
			callback(err);
			return;
		}
		callback(null,comments);
	})
};

commentSchema.statics.get_page_count = function(callback,params){
	this.find({commentArtic:params.commentArtic},function(err,comments){
		var count = {count:comments.length};
		if(err){
			callback(err);
			return;
		}
		callback(null,count)
	})
};
var comment = mongoose.model(modelName,commentSchema);
exports.model = comment;
