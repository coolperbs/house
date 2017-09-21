var handle,
    sysInfo = wx.getSystemInfoSync(),
    loadingTimmer,
    weeks_ch = ['日', '一', '二', '三', '四', '五', '六'],
    orderStatus;

orderStatus = {
  8 : '待支付',
  16 : '待入住',
  32 : '已入住',
  512 : '已完成',
  1024 : '已取消'
}

handle = {
  merge : function( r, s ) {
    var result = {}, p;

    for ( p in r ) {
      result[p] = r[p];
    }
    for ( p in s ) {
      result[p] = s[p]
    }
    return result;
  },
  mix : function( r, s ) {
    var p;
    for ( p in s ) {
      r[p] = s[p];
    }
    return r;
  },
  toPx : function( num ) {
  	return num / ( 750 / sysInfo.windowWidth )
  },
  toRpx : function( num ) {
  	return num * 750 / sysInfo.windowWidth;
  },
  checkRes : function( res ) {
    res = res || {};
    if ( res.code != '0000' || !res.success ) {
      wx.showToast( { title : res.msg || '系统错误', image : '' } );  // 需要一个错误图片
      return false;
    }
    return true;
  },
  isErrorRes : function( res ) {
    return !handle.checkRes( res );
  },
  fixPrice : function( price ) {
    price = price || 0;
    price = price / 100;
    price += '';
    if ( price.lastIndexOf( '.' ) == -1 ) {
      return price + '.00';
    } else if ( price.length - price.lastIndexOf( '.' ) == 2 ) {
      return price + '0';
    }
    return price;
  },
  showToast : function( param, time ) {
    if ( time && time > 0 ) {
      setTimeout( function() {
        wx.showToast( param );
      }, time );
      return;
    }
    wx.showToast( param );
  },
  showLoading : function() {
    var param, time;
    if ( arguments.length == 1 ) {
      param = {};
      time = arguments[0];
    } else {
      param = arguments[0] || {};
      time = arguments[1];
    }
    param.title = param.title || '加载中...';
    if ( time && time > 0 ) {
      loadingTimmer = setTimeout( function() {
        wx.showLoading( param );
      }, time );
      return;
    }

    wx.showLoading( param );
  },
  timeToDateObj : function( time ) {
    var date = new Date();

    date.setTime( time );

    return {
      time : time,
      day : date.getDate(),
      month : date.getMonth() + 1,
      year : date.getFullYear(),
      week : weeks_ch[date.getDay()],
      hours : date.getHours(),
      minutes : date.getMinutes(),
      seconds : date.getSeconds()
    };   
  },
  orderStatusStr : function( s ) {
    return orderStatus[ s ];
  },
  hideLoading : function() {
    clearTimeout( loadingTimmer );
    wx.hideLoading();
  }
}

module.exports = handle;