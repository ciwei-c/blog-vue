var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var session = require("express-session");
var modelName = "user";
var userSchema = new Schema({
	nickName:String,
	email:String,
	logo:String
});

userSchema.statics.login = function(callback,params,req){
	if(!params.email){
		callback("no email")
	}
	this.findOne({email:params.email}).exec(function(err,hasUser){
		if(err){
			callback(err);
			return;
		}
		if(hasUser){
			req.session.user = hasUser;
			callback(null,hasUser);
		}else{
			callback("用户不存在");
		}
	})
}
userSchema.statics.register = function(callback,params,req){
	if(!params.nickName){
		callback("no nickName");
	}
	if(!params.email){
		callback("no email");
	}
	this.findOne({email:params.email}).exec(function(err,hasUser){
		if(err){
			callback(err);
			return;
		}
		if(hasUser){
			callback("用户已存在");
			return;
		}

		var _user = new user({
			nickName:params.nickName,
			email:params.email,
			logo:params.logo
		})
		_user.save(function(err,newUser){
			if(err){
				callback(err);
				return;
			}
			req.session.user = newUser;
			callback(null,newUser);
		})
	})
}
userSchema.statics.logout = function(callback,params,req,res){
	delete req.session.user;
	delete res.locals.user;

	callback(null);
}

userSchema.statics.permission = function(callback,params){
	if(!params.pass){
		callback("no pass num");
	}
	if(params.pass == "15223396462"){
		callback(null);
	}else{
		callback("wrong pass");
	}
}
var user = mongoose.model(modelName,userSchema);
exports.model = user;
exports.modelName = modelName;