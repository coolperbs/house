var ajax = require('../../common/ajax/ajax'), 
	utils = require( '../../common/utils/utils' ),
	_fn, handle;


handle = {

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

module.exports = handle;