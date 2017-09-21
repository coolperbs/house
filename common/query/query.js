
var cgiList = require("cgi-config"),
	cgiUtils = require("cgi-utils"),
	ajaxHandler = require("ajax"),
	us = require("../../lib/underscore.js"),
	app = getApp(),
	handle = {};

handle = {
	getCgis    :   function(){
		var context = app.globalData ||{};
		if( context.cgi ){
			return context.cgi;
		}else{
			var cgiDefault = cgiUtils.regCgis(cgiList);
			var allCgi = us.extend({},cgiDefault);
			context.cgi = allCgi;
			return context.cgi  ;
		}
	},
	getByName:function(cgiName,param,callback,option){
		var reqUrl = handle.getCgis()[cgiName];
		if(reqUrl){
			handle.get(reqUrl,param,callback,option);
		}else{
			wx.showToast({
				title:"请求不存在("+cgiName+")"
			});
		}
	},
	get:function(url,param,callback,option){
		app.getUser(function(res){
			var token = res.token;
			var reqParam = {
				token:token,
				param:JSON.stringify(param)
			};
			ajaxHandler.get({
				url:url,
				data:reqParam,
				complete: function(res){
					if(res.errMsg === "request:ok" || res.statusCode.toString() === "200"){
						var data = res.data;
						if(typeof callback==="function"){
							callback(res);
						}
					}else{
						wx.showToast({
							title:"网络出错了("+res.statusCode.toString()+")"
						});
					}
				}
			});
		});
	}
};
module.exports = handle;