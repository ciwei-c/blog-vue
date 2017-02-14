var execBiz = function(reqPath, reqBody, res, req){
	var path = reqPath.split("/");
	path.splice(0,1);
	var methodName = path.pop();
	var objectPath = path.join("/")
	var objectPath = "../bo/" + objectPath;
	var currentObject = require(objectPath).model;
	currentObject[methodName](function(err,data){
		handleResult(err,data,res,req);
	},reqBody,req,res)
};
var handleResult = function(err,data,res,req){
	if(err){
		var errMsg = "\n";
		var result = {};
		if(req && req.path){
			errMsg = "path" + req.path + "\n";
		}
		if(typeof(err) == "string"){
			result.msg = err;
			errMsg += "error:" + err;
		}else if(typeof(err) == "object"){
			result = err;
			errMsg += "error:" + JSON.stringify(err);
		}
		result.ok = 0;
		res.send(result);
	}else{
		var result = {};
		if(data){
			if(Object.prototype.toString.call(data) == "[object Array]"){
				result.items = data;
			}else if(typeof(data) == "object"||typeof(data) == "string"){
				result.item = data;
			}
		}
		result.ok = 1;
		res.send(result);
	}
};
//上传文件
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
    	var topath = "";
    	topath = req.body.topath?req.body.topath:"default";
    	topath = "/"+topath;
        callback(null, 'app/common/public/upload'+topath);
    },
    filename: function(req, file, callback) {
        callback(null, Date.now()+file.originalname);
    }
});
var uploads = multer({
	storage:storage
});
//渲染页面
var _get = function(app,view,title){
	app.get("/"+view,function(req,res){
		res.render(view,{title:title})
	})
};
module.exports = function(app){
	//渲染页面
	_get(app,"","c_首页");
	_get(app,"artics","c_文章列表");
	_get(app,"artic","c_文章详情");
	_get(app,"about","c_关于");
	_get(app,"publish","c_发表");
	//upload上传
	app.post("/upload",uploads.single('c_file'),function(req,res){
		var file = req.file;
		file.path = file.path.split("common")[1];
		res.send(file);
	});
	//post请求
	app.post("*",function(req,res){
		execBiz(req.path, req.body, res, req)
	});
	//get请求
	app.get("*",function(req,res){
		execBiz(req.path, req.query, res, req)
	});
}