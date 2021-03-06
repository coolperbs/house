var handle, CFG, _fn, 
	error = require( '../error' ),
	ajax = require( '../../common/ajax/ajax' ),
	service = require('../../common/service/service'),
	utils = require( '../../common/utils/utils' ),
	uuid = require( '../../common/uuid/uuid' ),
	config = require('../../config'),
	app = getApp(),
	env = config.env,
	url;

var handle ={
	search:function(param,callback){
		var url = app.config.host+'/app/store/second/list';
		var param = param||{};
		ajax.query( {
			url : url,
			param : param
		}, function( res ) {
			if(callback && typeof callback === 'function'){
				callback(res);
			}
		} );

	},
	searchIndex:function(param,callback){
		var url = 'https://housegateway.yimeixinxijishu.com/app/index/second/list'
		var param = param || {};
		ajax.query({
			url:url,
			param:param
		},function(res){
			if(callback && typeof callback === 'function'){
				callback(res);
			}
		});
	}

}




module.exports = service(handle);