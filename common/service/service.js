var ajax = require('../../common/ajax/ajax.js'),
config = require('../../config'),
protocol = config.protocol;
function service(basicService){
	var retService = {};
	if(basicService){
		for(var i in basicService){
			if(typeof basicService[i] === 'function'){//合并用户写的特殊api
				retService[i] = basicService[i];
			}else if(typeof basicService[i] === 'object'){//合并配置的方法
				var url = basicService[i].url;
				if(url){
					retService[i] = commonApiTemplate(url);
				}

			}
		}
	}
	return retService;
}
function commonApiTemplate(url){
	return function(param,callback){
		var option = {};
		option.url = url;
		option.param = param||{};
		ajax.query(option,function(res){
			if(typeof callback === 'function'){
				callback(res);
			}
		});
	};
}


module.exports = service;