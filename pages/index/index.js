var home = require( '../../views/home/home.js' ),
	orders = require( '../../views/orders/orders.js' ),
//	mine = require( '../../views/mine/mine.js' ),
	serviceCart = require( '../../service/cart/cart' ),
	serviceUser = require( '../../service/user/user' ),
	service = require( '../../service/service' ),
	utils = require( '../../common/utils/utils' ),
	app = getApp(),
	views,
	_fn;

views = {
	home : home,
	orders : orders,
	//mine : mine
};

Page( {
	data : {
		viewData : {},
		currentView : 'home',
		tab : {
			currentTab : 0,
			list : [{
				text : '首页',
				className : 'footer-home',
				view : 'home'
			},{
				text : '订单',
				className : 'footer-orders',
				view : 'orders'
			}]
		}
	},
	onShareAppMessage : app.shareFunc,
	onReady : function() {
		wx.setNavigationBarTitle( {
			title : app.config.title 
		} );
		//_fn.showTips( this );
	},

	onReachBottom : function( e ) {
		var currentView = views[this.data.currentView] || {};
		if ( currentView && currentView.events && currentView.events['reachBottom'] ) {
			currentView.events['reachBottom']( this, e );
		}
	},

	onShow : function() {
		// 每次显示都刷新一次购物车
		// 这样保证在商详添加后在首页也能显示
		var self = this,
			currentView = self.data.currentView || 'home';

		_fn.selectView.call( this, currentView );
/*		serviceCart.get( function( res ) {
			self.setData( {
				'cart.num' : res.data.num
			} );
		} );*/
		// serviceUser.getInfo();
		// _fn.selectView.call( this, 'home' );
	},

	changeTab : function( e ) {
		var currentTarget = e.currentTarget,
			viewName = currentTarget.dataset.view;

		if ( !viewName ) {
			return;
		}

		// 请求数据，渲染对应页面
		this.setData( {
			currentView : viewName,
			'tab.currentTab' : e.currentTarget.dataset.index
		} );
		_fn.selectView.call( this, viewName );

	},

	// 触发事件代理
	events : function( e ) {
		var cTarget = e.currentTarget,
			dataset = cTarget.dataset,
			currentView = views[this.data.currentView] || {};


		console.log( dataset.func );
		if ( !currentView.events || typeof currentView.events[dataset.func] != 'function' ) {
			return;
		}
		currentView.events[dataset.func]( this, e );
	},

	jump : function( e ) {
		var url = e.currentTarget.dataset.url;

		if ( url.indexOf( '/comment/comment' ) > -1 ) {	// 多了后面改为switch
			this.closeTips();			
			wx.navigateTo( { url : url } );
		}
	},

	closeTips : function() {
		_fn.writeTime();
		this.setData( {
			tips : { show : false }
		} );
	}
} );

_fn = {
	selectView : function( viewName ) {
		var view = views[viewName];
		if ( !view ) {
			return;
		}
		this.setData( {
			currentView : viewName
		} );
		view.render( this );
	},
	showTips : function( caller ) {
		var self = caller;

		if ( !_fn.needCommentTips() ) {
			return;
		}

		// 评论提示
		service.comment.getUncommentOrder( { returnNum : 1 }, function( res ) {
			var orderInfo,
				userInfo = service.user.getStoreInfo(),
				orderInfo;

			res = res || {};
			if ( res.code != '0000' || !res.success || !res.data || res.data.length < 1 ) {
				return; // 错误情况下不做处理
			}
			//_fn.writeTime();
			orderInfo = res.data[0];
			orderInfo.payPriceStr = utils.fixPrice( orderInfo.payPrice );
			self.setData( {
				userInfo : userInfo,
				tips : {
					orderInfo : orderInfo,
					show : true
				}
			} );
		} );	
	},
	needCommentTips : function() {
		var time = wx.getStorageSync( 'time' ) || '{}';
		time = JSON.parse( time );
		if ( !time.commentTips || new Date().getTime() > time.commentTips ) {
			return true;
		}
		return false;
	},
	// 需要关闭时，手动处理
	writeTime : function() {
		var time = wx.getStorageSync( 'time' ) || '{}';
		time = JSON.parse( time );
		//time.commentTips = new Date().getTime() + 3 * 86400 * 1000; // 3天 * 秒 *毫秒
		time.commentTips = new Date().getTime() + 0.5 * 86400 * 1000; // 3天 * 秒 *毫秒
		wx.setStorageSync( 'time', JSON.stringify( time ) );
	}
}