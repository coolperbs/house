var us = require('../../lib/underscore.js');

var handle = {
  callNum : 0,//全局变量，表示当前队列中的异步请求数量，不得超过5个
  get : function(args){
    var ajaxQueue = new queue();//初始化请求队列
    var fire = function(){//在每次请求结束后被调用
      if(handle.callNum<5&&ajaxQueue.callbackArray.length>0){
        ajaxQueue.fire();//触发队列中下个ajax请求
        handle.callNum = handle.callNum+1;
      }
    };
    var query = function(){//请求方法体
      var url = args.url;
      var data = args.data||{};
      var complete = args.complete;
      var fail = args.fail;

      wx.request({
        url : url,
        data: data,
        complete:function(resp){
          fire();
          if(typeof complete === "function"){
            complete(resp);
          }
          if(ajaxQueue.getSize()<=0){
            wx.hideToast();
          }
          handle.callNum--;
        }
      });
    };
    if(ajaxQueue && ajaxQueue.callbackArray.length>=0){//程序入口，
      ajaxQueue.add(args,query);//在队列中将请求的方法体和请求参注册，并等待调用
      fire();
    }
  },
};
var queue = function(name){
	this.name = name;
	this.callbackArray = [];
	this.getName=function(){
		return this.name;
	},
	this.add=function(){
		this.callbackArray.push({
			callback:us.last(arguments),
			args:arguments
		});
	},
	this.fire=function(){
		var fireObj = this.callbackArray.shift();
		fireObj.callback(fireObj.args);
	},
	this.getSize=function(){
		return this.callbackArray.length;
	}
};




module.exports = handle;


