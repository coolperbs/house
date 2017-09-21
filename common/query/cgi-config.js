var cgiList = {
	tradingApi:{
		host:{
			dev:"devapi.trading.com",
			test:"testapi.trading.com:9000"
		},
		url:{
			tradingApiAuthMiniProgram:"/mch/user/wechat/auth/miniProgram",//登录
			tradingApiUserInfo:"/mch/user/info",//获取用户信息
			tradingApiBalanceRule:"/mch/balance/rules",//获取充值金额列表
			tradingApiPayBalanceRecharge:"/mch/pay/balance-recharge",// 余额充值
			tradingApiPayBuyPlus:"/mch/pay/plus-buy", //购买PLUS
			tradingApiPayList:"/mch/pay/plus-buy/list",//消费记录
			tradingApiPlusRuls:"/mch/user/plus/rules",//购买会员资格
		}
	},

	appGateWay:{
		host:{
			dev:"app.gateway.nx.com:9000"
		},
		url:{
			appGateWayIndex:"/app/index",
			appGateWayGetStoreById:"/app/store/page"
		}
	}
};
module.exports = cgiList;
