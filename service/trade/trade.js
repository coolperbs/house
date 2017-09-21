var ajax = require('../../common/ajax/ajax'), 
	error = require( '../error' ),
	utils = require( '../../common/utils/utils' ),
	config = require( '../../config' ),
	url, CFG, _fn, handle;

CFG = {
	storeName : 'cart',	//前端key
	isMergeCart : 'isMergeCart',
	tempId : 'tempid'
}

url = {
	tradeInfo : config.HOST.trading + '/mch/trade/info',	// 考虑接口的剥离方哪里？
	submit : config.HOST.trading + '/mch/trade/submit',
	pay : config.HOST.trading + '/mch/pay/order-pay'

	// tradeInfo : 'http://devapi.trading.com/mch/trade/info',	// 考虑接口的剥离方哪里？
	// submit : 'http://devapi.trading.com/mch/trade/submit',
	// pay : 'http://devapi.trading.com/mch/pay/order-pay'
}

error = utils.merge( error, {
	wxPayError : { code : -1101, msg : '用户取消支付' }
} );

handle = {
	getInfo : function( param, callback ) {
		param = param || {};
		var defaultParam = { tradeType : 1, shopId : 1, orderType : 1, orderSource : 5,/* shipmentType : 1,*/ /*addressId : ''*/ };
		param = utils.merge( defaultParam, param );
		ajax.query( {
			url : url.tradeInfo,
			param : param
		}, function( res ) {
			callback && callback( res );
		} );
	},

	submit : function( param, callback ) {
		param = param || {};
		var defaultParam = { tradeType:1/*1为微信*/, shopId:'', orderType:1 /* 1为线上订单，2为线下订单 */ , orderSource:5, shipmentType:'', pdupUuid:'', /*balanceRuleId:1,*/addressId:''};
		param = utils.merge( defaultParam, param );
		ajax.query( {
			url : url.submit,
			param : param
		}, function( res ) {
			callback && callback( res );
			///console.log( res );
		} );
	},

	pay : function( param, callback ) {
		param = param || {};
		// autoPay 充值支付为true
		var defaultParam = { autoPay:false, totalFee:1, orderId:10054001 };
		param = utils.merge( defaultParam, param );
		ajax.query( {
			url : url.pay,
			param : param
		}, function( res ) {
			callback && callback( res );
		} );		
	},
	wxPay : function( param, callback ) {
		wx.requestPayment( {
			timeStamp : param.timeStamp,
			nonceStr : param.nonceStr,
			package : param.package,
			signType : 'MD5',
			paySign : param.paySign,			
			success : function() {
				callback && callback( error.success );
			},
			fail : function( ) {
				callback && callback( error.wxPayError );
			}
		} );
	}
}

module.exports = handle;