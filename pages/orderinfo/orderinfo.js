var _fn,
    utils = require( '../../common/utils/utils' ),
    ajax = require( '../../common/ajax/ajax' ),
    app = getApp(),
    pageParam,
    state;

state = {
  8 : '待支付',
  16 : '待入住',
  32 : '已完成',
  1024 : '已取消'
}

Page({
  data : {
    state : state
  },
  onShareAppMessage : app.shareFunc,
  onLoad : function( options ) {
    pageParam = options;
  },
  onReady : function() {
    _fn.renderPage( this );
  },
  phone : function( e ) {
    wx.makePhoneCall({
      phoneNumber : e.currentTarget.dataset.phone
    });
  },
  cancel : function() {
    var self = this;
    ajax.query( {
      url : app.host + '/app/order/cancel',
      param : {
        orderId : pageParam.orderId
      }
    }, function( res ) {
      if ( utils.isErrorRes( res ) ) {
        return;
      }
      _fn.renderPage( self );
    } ); 
  },
  pay : function() {
    var self = this;
    _fn.payOrder( {
      orderId : pageParam.orderId
    }, function( payRes ) {
      if ( !payRes || payRes.code != '0000' || !payRes.success ) {
        wx.showModal( {
          title : '提示',
          content : payRes.msg || '系统错误',
          showCancel : false,
          complete : function() { 
            _fn.renderPage( self ); 
          }
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
        _fn.renderPage( self );
      } );
    } );    
  },
  showMap : function( e ) {
    wx.openLocation({
      latitude : e.currentTarget.dataset.lat * 1,
      longitude : e.currentTarget.dataset.lng * 1,
      name : e.currentTarget.dataset.name,
      address : e.currentTarget.dataset.address
    });
  }
});

_fn = {
  data : {},
  renderPage : function( caller ) {
    var self = caller;

    _fn.getData( function( res ) {
        if ( utils.isErrorRes( res ) ) {
          return;
        }
        res.data = _fn.formatData( res.data );
        self.setData( {
          pageData : res.data
        } );
    } );
  },

  formatData : function( data ) {
    data.order.orderStatusStr = utils.orderStatusStr( data.order.orderStatus );
    data.order.startDateObj = utils.timeToDateObj( data.order.startDate );
    data.order.endDateObj = utils.timeToDateObj( data.order.endDate );
    data.order.orderTimeObj = utils.timeToDateObj( data.order.orderTime );
    return data;
  },

  getData : function( callback ) {
    var time = new Date();
    ajax.query( {
      url : app.host + '/app/order/info',
      param : {
        orderId : pageParam.orderId
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
