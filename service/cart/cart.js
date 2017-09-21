var ajax = require('../../common/ajax/ajax'), 
	error = require( '../error' ),
	utils = require( '../../common/utils/utils' ),
	config = require( '../../config.js' ),
	url, CFG, _fn, handle;

CFG = {
	storeName : 'cart',	//前端key
	isMergeCart : 'isMergeCart',
	tempId : 'tempid'
}



url = {
	// add : config.host.trading + '/mch/cart/add',	// 考虑接口的剥离方哪里？
	// query : 'http://devapi.trading.nx.com:9000/mch/cart/get',
	// clear : 'http://devapi.trading.nx.com:9000/mch/cart/clear',
	// del : 'http://devapi.trading.nx.com:9000/mch/cart/del',
	// update : 'http://devapi.trading.nx.com:9000/mch/cart/update'
	add : config.HOST.trading + '/mch/cart/add',	// 考虑接口的剥离方哪里？
	query : config.HOST.trading + '/mch/cart/get',
	clear : config.HOST.trading + '/mch/cart/clear',
	del : config.HOST.trading + '/mch/cart/del',
	update : config.HOST.trading + '/mch/cart/update'	
}


handle = {
	isMerged : function() {
		return wx.getStorageSync( CFG.isMergeCart ) ? true : false;
	},

	merge : function( callback ) {
		var self = this;
		this.query( { shopId : [] }, function( res ) {
			callback && callback( self.isMerged() );
		} );
	},

	// param = { num : 1, shopId : 1, sku : 1 }
	add : function( param, callback ) {
		var defaultData = {
				checked: true, //是否选中
				data: true,    //是否需要返回购物车数据
				num: 2,        //商品数量
				sku: 123,      //商品SKU
				//tempId: "xxx", //临时购物车ID
				shopId:123     //门店ID
			};

		if ( Object.prototype.toString.apply( param ) !== '[object Object]' ) { // 之后再考虑多种传参的情况
			callback( error.paramError );
			return;
		} 
		param = utils.merge( defaultData, param );
		param = _fn.addTempId( param );
		//param = _fn.bindUserId(  ); // 处理临时id等东西
		ajax.query( {
			url : url.add,
			param : param
		}, function( res ) {
			res = _fn.callbackFilter( res );
			if ( res.code == '0000' && res.success ) {	// 这里判断条件等返回字段统一，ok后处理
				handle.save( res.data );	// 本地存储，是直接在这里处理？
			}
			callback( res );
		} );
	},

	// param = { num : 1, shopId : 1, sku : 1 }
	del : function( param, callback ) {
		var defaultData = {
				checked : true, //是否选中
				data : true,    //是否需要购物车返回数据
				num : 2,        //更新数量
				shopId : 1,     //门店ID
				sku : 123,      //SKUID
				tempId : "xxx", //临时购物车ID
				updateType : 3 //更新类型(1, "设置商品数量"),(2, "增加商品数量"),(3, "减少商品数量");
			};
		param.num = param.num || 1;
		param = utils.merge( defaultData, param );
		param = _fn.addTempId( param );
		ajax.query( {
			url : url.update,
			param : param
		}, function( res ) {
			res = _fn.callbackFilter( res );
			if ( res.code == '0000' && res.success ) {	// 这里判断条件等返回字段统一，ok后处理
				handle.save( res.data );	// 本地存储，是直接在这里处理？
			}
			callback( res );			
		} );
	},

	// param = { shopId :  '' } || param = { shopId : [] }
	query : function( param, callback ) {
		// 应该是根据storeId来，storeId也可以不传
		var defaultData = {
			shopIds : [] //需要获取数据的门店ID数组，可以传入多个店铺
			//tempId : "xxx" //临时购物车ID
		};
		var data = {};
		if ( Object.prototype.toString.apply( param.shopId ) === '[object Array]' ) {
			data.shopIds = param.shopId;
		} else if ( param && param.shopId ) {
			data.shopIds = [param.shopId]
		} else {
			callback( error.paramError );
			return;
		}
		data = utils.merge( defaultData, data );
		data = _fn.addTempId( data );
		ajax.query( {
			url : url.query,
			param : data
		}, function( res ) {
			res = _fn.callbackFilter( res );
			if ( res.code == '0000' && res.success ) {	// 这里判断条件等返回字段统一，ok后处理
				handle.save( res.data );	// 本地存储，是直接在这里处理？
			}
			callback( res );
		} );
	},
	get : function() {	// 全量返回
		return wx.getStorageSync( CFG.storeName );
	},
	save : function( data ) {
		wx.setStorageSync( CFG.storeName, data );
	}
};

_fn = {
	// 处理用户信息，单独打个标记，merge购物车，因为在结算的时候必须merge一次，成功后才下单
	// 处理绑定信息
	addTempId : function( param ) {
		var isMerge = wx.getStorageSync( CFG.isMergeCart ),
			userInfo = wx.getStorageSync( 'userinfo' );

		if ( isMerge == true ) {	// 已经登录也不需要打merge
			return param;
		}
		param.tempId = wx.getStorageSync( CFG.tempId );
		return param;
	},
	callbackFilter : function( res ) {
		var isMerged = wx.getStorageSync( CFG.isMergeCart );
		// 处理购物车merge数据
		if ( !isMerged && res && res.data && res.data.marge ) {
			wx.setStorageSync( CFG.isMergeCart, true );
		}
		return res;
	}
}

// error = {
// 	success : { code : '0000', msg : '' },
// 	paramError : { code : -1111, msg : '参数格式错误' }
// }

module.exports = handle;