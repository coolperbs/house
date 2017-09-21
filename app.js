//var user = require( 'service/user/user' );
//var uuid = require( 'common/uuid/uuid' );
var config = require( './config' );
var weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
var _fn;
var ajax = require( './common/ajax/ajax' );


var conf = wx.getExtConfigSync ? wx.getExtConfigSync() : {};

conf.host = conf.host || config.host;
conf.appid = conf.appid || 'wxaccdda8d2e9e827e';
conf.secret = conf.secret || '60088a714462ddd6fb59bb7b8bbe2a1c';
conf.title = conf.title || '酒店';
conf.uid = conf.uid || 2274;

ajax.setGlobalParam( conf );

var handle = {
	//host : 'https://hotelgateway.yimeixinxijishu.com',
	host : conf.host,
	config : conf,
	shareFunc : function() {
		return {
			title : conf.title,
			path : 'pages/index/index'
		}
	},
	globalData:{
		evt:"dev"//使用环境
	},
	onLaunch:function(){
		_fn.setDate();
		_fn.setCity();
		_fn.getLocation();
	}
};

_fn = {
	setDate : function() {
		var datetime = wx.getStorageSync( 'datetime' ),
			start, end;
		if ( datetime && datetime.length == 2 ) {
			return;
		}

		start = new Date();
	    start.setHours( 12 );
	    start.setMinutes( 0 );
	    start.setSeconds( 0 );

	    end = new Date();
	    end.setTime( start.getTime() + 24 * 60 * 60 * 1000 );
		datetime = [{
			time : start.getTime(),
			day : start.getDate(),
			month : start.getMonth() + 1,
			year : start.getFullYear(),
			week : weeks_ch[start.getDay()]			
		},{
			time : end.getTime(),
			day : end.getDate(),
			month : end.getMonth() + 1,
			year : end.getFullYear(),
			week : weeks_ch[end.getDay()]			
		}];
		wx.setStorageSync( 'datetime', datetime );		
	},
	setCity : function() {
		var city = wx.getStorageSync( 'city' );
		if ( city.name && city.code ) {
			return;
		}
		wx.setStorageSync( 'city', { name : '北京市', code : '010' } );
	},
	getLocation : function() {
		return;
		wx.getLocation( {
			success : function() {

			}
		} );
	}
}

App( handle );

