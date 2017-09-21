var handle,
	ajax = require( '../../common/ajax/ajax' ),
	utils = require( '../../common/utils/utils' ),
	events,
	app = getApp(),
	currentPage = 1,
	_fn;

handle = {
	name : 'orders',
	//data : data.data,
	render : function( callerPage ) {
		// 请求数据，渲染数据
		this.events.changeTab( callerPage, 1 );
	},

	events : {
		changeTab : function( callerPage, e ) {
			var type = typeof e === 'number' ? e : e.currentTarget.dataset.type;
			currentPage = 1;
			callerPage.setData( {
				'viewData.currentType' : type,
				'viewData.orders' : []
			});

			_fn.render( callerPage );
		},
		reachBottom : function( callerPage ) {
			if ( !callerPage.data.viewData.pageData.hasMore ) {
				return;
			}
			_fn.render( callerPage );
		}
	}
}

_fn = {
	render : function( callerPage ) {
		var type = callerPage.data.viewData.currentType || 1;

		ajax.query( {
			url : app.host + '/app/order/list',
			param : {
				currentPage : currentPage,
				type : type // 1全部 2待付款 3入住
			}
		}, function( res ) {
			if ( res && res.code + '' == '1000' ) {
				callerPage.setData( {
					'viewData.needLogin' : true
				} );
				return;
			}
			if ( utils.isErrorRes( res ) ) {
				return;
			}
			var orders = callerPage.data.viewData.orders || [];

			orders = orders.concat( _fn.formatOrders( res.data.order ) );
			callerPage.setData( {
				'viewData.needLogin' : false,
				'viewData.pageData' : res.data,
				'viewData.orders' : orders
			});
			if ( res.data.hasMore ) {
				++currentPage;
			}
		} );
	},

	formatOrders : function( orders ) {
		if ( !orders ) {
			return [];
		}
		var i, o;
		for ( i = 0; o = orders[i]; ++i ) {
			o.startDateObj = utils.timeToDateObj( o.startDate );
			o.endDateObj = utils.timeToDateObj( o.endDate );
			o.orderStatusStr =  utils.orderStatusStr( o.orderStatus );
		}
		return orders;
	}
}

module.exports = handle;










