var _fn,
    utils = require( '../../common/utils/utils' ),
    ajax = require( '../../common/ajax/ajax' ),
    app = getApp(),
    pageParam;

Page({
  onLoad : function( param ) {
    pageParam = param;
  },
  onShow : function() {
    _fn.renderPage( this );
  },
  onShareAppMessage : app.shareFunc,
  showImage : function() {
    var data = this.data;
    wx.previewImage( {
      urls : data.pageData.store.detailImage
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
  renderPage : function( caller ) {
    var self = caller;

    if ( !pageParam || !pageParam.storeId ) {
      wx.showModal( {
        title : '提示',
        content : '缺少storeId',
        showCancel : false,
        complete : function() {
          wx.navigateBack();
        }
      } );
      return;
    }

    var datetime = wx.getStorageSync( 'datetime' );
    if ( self.data && self.data.datetime && datetime[0].time == self.data.datetime[0].time && datetime[1].time == self.data.datetime[1].time ) {
      return;
    }

    _fn.getData( function( res ) {
        if ( utils.isErrorRes( res ) ) {
          return;
        }
        var allDay;

        allDay = datetime[1].time - datetime[0].time;
        allDay = Math.round( allDay / ( 24 * 60 * 60 * 1000 ) );

        self.setData( {
          pageData : res.data,
          datetime : datetime,
          allDay : allDay
        } );
    } );
  },

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
  }
}
