var ajax = require('../../common/ajax/ajax'), 
	error = require( '../error' ),
	utils = require( '../../common/utils/utils' ),
	config = require( '../../config.js' ),
	url, CFG, _fn, handle, addressInfo;

CFG = {
	storeName : 'cart',	//前端key
	isMergeCart : 'isMergeCart',
	tempId : 'tempid'
}

url = {
	update : config.HOST.trading + '/mch/user/address/saveOrUpdate'
}


handle = {
	// 缓存存储下,目前没有地址管理机制
	cache : function( value ) {
		if ( arguments.length == 0 ) {	// 读操作
			return addressInfo || {};
		}
		addressInfo = value; // 写操作
	},

	update : function( param, callback ) {
		param = param || {};
		var defaultParam = {id:'', consignee:'',mobilePhone:'',provinceName:'',cityName:'',areaName:'',addressName:'',addressDetail:''};
		param = utils.merge( defaultParam, param );
		ajax.query( {
			url : url.update,
			param : param
		}, callback );		
	}
}

module.exports = handle;