var _fn,
    utils = require( '../../common/utils/utils' ),
    ajax = require( '../../common/ajax/ajax' ),
    app = getApp(),
    pageParam;

Page({
  onLoad : function( param ) {
    pageParam = param || {};
  },
  onShareAppMessage : app.shareFunc,
  onShow : function() {
    var markers = [{
      iconPath : '../../asset/pin.png',
      width : 50,
      height : 50,
      id : 1,
      latitude : pageParam.lat,
      longitude : pageParam.lng
    }];
    this.setData( {
      lng : pageParam.lng,
      lat : pageParam.lat,
      markers : markers
    } );
  }
});