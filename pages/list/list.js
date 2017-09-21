var _fn,
    utils = require( '../../common/utils/utils' ),
    ajax = require( '../../common/ajax/ajax' ),
    app = getApp(),
    currentPage = 1,
    area;

area = {
  1 : '商业圈',
  2 : '机场 火车站',
  3 : '城市景点'
}

Page({
  onReady : function() {
    currentPage = 1;
  },
  onShareAppMessage : app.shareFunc,
  onShow : function() {
    var data = this.data,
        city = wx.getStorageSync( 'city' ),
        datetime = wx.getStorageSync( 'datetime' );

    if ( data && data.city && data.datetime && data.city.code == city.code 
      && data.datetime[0].time == datetime[0].time
      && data.datetime[1].time == datetime[1].time ) {
      return;
    }
    // 切换城市清空很多东西
    if ( data && data.city && data.city.code != city.code ) {
      this.setData( {
          area : [],
          stores : [],
          showArea : false,
      } );
      currentPage = 1;
    }
    _fn.renderPage( this );
  },
  changeTab : function( e ) {
    this.setData( {
      selectTab : e.currentTarget.dataset.area
    } );
  },
  changeArea : function( e ) {
    this.setData( {
      area : [ ( this.data.selectTab || this.data.area[0] ), e.currentTarget.dataset.subarea ],
      showArea : false,
      stores : [],
    } );
    currentPage = 1;
    _fn.renderPage( this );
  }, 
  selectarea : function() {
    var showArea = !this.data.showArea;

    this.setData( {
      showArea : !this.data.showArea,
      selectTab : showArea ? '' : this.data.selectTab
    } );
  },
  onReachBottom : function() {
    if ( !this.data.pageData.hasMore ) {
      return;
    }
    ++currentPage;
    _fn.renderPage( this );
  }
});

_fn = {
  data : {},
  renderPage : function( caller ) {
    var self = caller;

    // 渲染页面
    _fn.getData( { caller : caller }, function( res ) {
        if ( utils.isErrorRes( res ) ) {
          return;
        }
        var datetime = wx.getStorageSync( 'datetime' ),
            allDay,
            stores;

        allDay = datetime[1].time - datetime[0].time;
        allDay = Math.round( allDay / ( 24 * 60 * 60 * 1000 ) );

        stores = caller.data.stores || [];
        stores = stores.concat( res.data.stores || [] );

        self.setData( {
          pageData : res.data,
          cityCatMap : res.data.cityCatMap,
          stores : stores,
          newCityCatMap : _fn.formatMap( res.data.cityCatMap ),
          city : wx.getStorageSync( 'city' ),
          datetime : wx.getStorageSync( 'datetime' ),
          allDay : allDay,
          area : self.data.area || [],
          selectTab : ''
        } );
    } );
  },

  formatMap : function( map ) {
    var p, result = [];

    for ( p in map ) {
      result.push( {
        key : p,
        name : area[p],
        value : map[p]
      } );
    }
    return result;
  },
  getData : function( param, callback ) {
    var time = new Date(),
        city = wx.getStorageSync( 'city' ),
        datetime = wx.getStorageSync( 'datetime' ),
        caller = param.caller,
        data = caller.data,
        currentArea;

    if ( data.area && data.area.length == 2 && data.cityCatMap ) {
      currentArea = data.cityCatMap[data.area[0]][data.area[1]];
    } else {
      currentArea = {};
    }

    ajax.query( {
      url : app.host + '/app/store/list',
      param : {
        currentPage : currentPage,
        cityCode : city.code,
        lng : currentArea.lng || 0,
        lat : currentArea.lat || 0,
        catType : data && data.area ? data.area[0] : '',
        catValueId : currentArea.id || '',
        startTime : datetime[0].time,
        endTime : datetime[1].time
      }
    }, callback );    
  }
}
