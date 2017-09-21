var _fn,
    utils = require( '../../common/utils/utils' ),
    ajax = require( '../../common/ajax/ajax' ),
    app = getApp(),
    pageParam;


Page( {
	data : {
		type : '在线支付',
		paytype : ['到店支付', '在线支付']
	},
	onShareAppMessage : app.shareFunc,
	onLoad : function( options ) {
		pageParam = options;
	},
	savename : function( e ) {
		this.setData({
			name : (e.detail.value + '').trim()
		});
	},
	savephone : function( e ) {
		this.setData({
			phone : (e.detail.value + '').trim()
		});
	},
	changeType : function( e ) {
		var type;
		type = e.detail.value * 1 == 0 ? '到店支付' : '在线支付';
		this.setData( {
			type : type
		} );
	},
	onReady : function() {
		var self = this;
		_fn.getData( function( res ) {
			if ( utils.isErrorRes( res ) ) {
				return;
			}
			var i, w, select;
			for ( i = 0; w = res.data.ware[i]; ++i ) {
				if ( w.wareSkuId * 1 == pageParam.wareSkuId * 1 ) {
					select = w;
					break;
				}
			}

			var datetime = wx.getStorageSync( 'datetime' ),
				allDay;

			allDay = datetime[1].time - datetime[0].time;
        	allDay = Math.round( allDay / ( 24 * 60 * 60 * 1000 ) );
			self.setData( {
				store : res.data.store,
				ware : select,
				allDay : allDay,
				datetime : datetime
			} );
		} );
	},

	submit : function() {
		var userInfo = wx.getStorageSync( 'userinfo' );
		if ( !userInfo || !userInfo.token ) {
			wx.navigateTo( { url : '../login/login' } );
			return;
		}
		_fn.submit( this, function( res ) {
			// 如果是在线支付就继续调用
			if ( utils.isErrorRes( res )) {
				return;
			}
		} );
	}
} );

_fn = {
	getData : function( callback ) {
		var dateTime = wx.getStorageSync( 'datetime' );

		ajax.query( {
		  url : app.host + '/app/store/info',
		  param : {
		    storeId : pageParam.storeId,
		    startTime : dateTime[0].time,
		    endTime : dateTime[1].time
		  }
		}, callback );    
	},

	submit : function( caller ) {
		var data = caller.data;
		if ( !data.name ) {
			wx.showToast( { title : '请填写联系人' } );
			return;
		}
		if ( !data.phone ) {
			wx.showToast( { title : '请填写手机号' } );
			return;
		}

		// 1.创建订单
		_fn.createOrder( caller, function( orderRes ) {
			if ( utils.isErrorRes( orderRes ) ) {
				return;
			}
			var orderId = orderRes.data.orderId;

			if ( caller.data.type == '到店支付' ) {
				wx.redirectTo( { url : '../orderinfo/orderinfo?orderId=' + orderId  } );
				return;
			}
			// 2.获取支付订单
			_fn.payOrder( {
				orderId : orderRes.data.orderId
			}, function( payRes ) {
				if ( !payRes || payRes.code != '0000' || !payRes.success ) {
					wx.showModal( {
						title : '提示',
						content : payRes.msg || '系统错误',
						showCancel : false,
						complete : function() { wx.redirectTo( { url : '../orderinfo/orderinfo?orderId=' + orderId } ) }
					} );
					return;
				}
				// 3.唤醒微信支付
				_fn.wxPay( {
					timeStamp : payRes.data.timeStamp,
					nonceStr : payRes.data.nonceStr,
					package : 'prepay_id=' + payRes.data.prepayId,
					paySign : payRes.data.sign					
				}, function() {
					wx.redirectTo( { url : '../orderinfo/orderinfo?orderId=' + orderId  } );
				} );
			} );
		} );
	},
	createOrder : function( caller, callback ) {
		var data = caller.data;
		var datetime = wx.getStorageSync( 'datetime' );
		var type;

		type = caller.data.paytype.indexOf( caller.data.type );
		ajax.query( {
			url : app.host + '/app/order/submit',
			//url : 'https://gateway.hotel.yimeixinxijishu.com/app/order/list',
			param : {
				userPhone : caller.data.phone,
				userName : caller.data.name,
				wareSkuId : caller.data.ware.wareSkuId,
				storeId : caller.data.store.id,
				wareSkuCount : 1,
				startDate : datetime[0].time,
				endDate : datetime[1].time,
				paymentType : caller.data.type == '到店支付' ? 1 : 2   // 1到店支付，2在线支付
			}
		}, callback );
	},

	payOrder : function( param, callback ) {
		ajax.query( {
			url : app.host + '/app/pay/wechatPrePay',
			param : param
		}, callback );		

	},

	wxPay : function( param, callback ) {
		wx.requestPayment( {
			timeStamp : param.timeStamp,
			nonceStr : param.nonceStr,
			package : param.package,
			signType : 'MD5',
			paySign : param.paySign,			
			success : function() {
				callback && callback( true );
			},
			fail : function( ) {
				callback && callback( false );
			}
		} );
	}
}