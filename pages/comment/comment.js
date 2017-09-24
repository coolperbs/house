var ajax = require( '../../common/ajax/ajax' ),
	utils = require( '../../common/utils/utils' ),
	app = getApp(), URL,
	fn, pageParam;

URL = {
	1 : '/app/store/info',	// 小区房 storeId=100001
	2 : '/app/store/second/info', // 二手房详情 storeId = 1
	3 : '/app/store/lease/info', // 出租房详情 storeId = 3
	4 : '/app/store/building/info' //新房详情 sotreId = 100003
};

Page({
	data : {
		storeType : {
			1 : '公寓',
			2 : '普通住宅',
			3 : '别墅',
			4 : '平房'
		},
		houseType : {
			1 : 'store',
			2 : 'storeSecond', // 二手房详情 storeId = 1
			3 : 'storeLease', // 出租房详情 storeId = 4
			4 : 'storeBuilding' //新房详情 sotreId = 100003
		},
		buildType : {
			1 : '期房',
			2 : '现房',
			3 : '待售'
		},
		secondStoreType : {
			1 : '一室',
			2 : '二室',
			3 : '三室',
			4 : '四室',
			5 : '五室',
			6 : '五室以上'
		},
		selectTab : 2,
		imageIndex : 1
	},
	mapMarker : [{
		iconPath : '../../asset/pin.png',
    	width : 50,
    	height : 50
	}],
	onLoad : function( options ) {
		pageParam = options;
		this.setData( {
			pageType : pageParam.type
		} );
	},
	onReady:function(){
		fn.renderPage( this );
	},
	changeTab : function( e ) {
		this.setData( {
			selectTab : e.currentTarget.dataset.tab
		} );
	},
	showImage : function() {
		var data = this.data;
		wx.previewImage( {
		  urls : data.pageInfo.store.detailImage,
		  current : data.pageInfo.store.detailImage[data.imageIndex-1]
		} );
	},	
	changeSwiper : function( e ) {
		this.setData( {
			imageIndex : e.detail.current + 1
		} );
	},
	phone : function( e ) {
		wx.makePhoneCall({
			phoneNumber : e.currentTarget.dataset.phone
		});
	},
	showmap : function( e ){
		wx.openLocation( {
			latitude : e.currentTarget.dataset.lat * 1,
			longitude : e.currentTarget.dataset.lng * 1
		} );
	}
});


fn = {
	renderPage : function( caller ) {
		fn.getPageData( function( res ) {
			if ( utils.isErrorRes( res ) ) {
				return;
			}
			res.data = fn.formatData( res.data )
			caller.setData( {
				pageInfo : res.data,
				imageIndex : 1,
				'mapMarker[0].latitude' : res.data.store.lat * 1,
				'mapMarker[0].longitude' : res.data.store.lng * 1
			} );
		} );
	},

	formatData : function( data ) {
		if ( pageParam.type == 2 || pageParam.type == 3 ) {
			data = fn.strToList( data, ['introduce', 'developer', 'mind', 'mating', 'service'] );
		}
		return data;
	},

	strToList : function( data, list ) {
		var i, key, len;
		for ( i = 0, len = list.length; i < len; ++i ) {
			key = list[i];
			if ( !data.store || !data.store[key] ) {
				continue;
			}
			data.store[key + 'List'] = data.store[key].split( '<br>' );
			console.log( 'fasdfasdf' );
		}
		return data;
	},

	getPageData : function( callback ) {
		var url = URL[pageParam.type];
		url = app.config.host + url;
		ajax.query( {
			url : url,
			param : {
				storeId : pageParam.storeid
			}
		}, callback );
	}
}