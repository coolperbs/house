var environment = 'test', //当前的环境
	protocol = 'http://',
	hostCfg, HOST, config, _fn;

hostCfg = {//host
	trading : {
		// dev:protocol+'devapi.trading.com',
		dev : protocol + 'devapi.trading.com',
		//test : protocol + 'devapi.trading.nx.com:9000'
		test : protocol + '47.92.75.170:9000'
	},
	appGateWay : {
		//test : protocol + 'app.gateway.nx.com:9000'
		test : protocol + '47.92.75.170:8119'
	},
	activeGateWay : {
		test : protocol + '47.92.75.170:8159'
	}
};

_fn = {
	createHost : function( hostCfg, env ) {
		var result = {}, p, u;

		for ( p in hostCfg ) {
			result[p] = hostCfg[p][env];
		}
		return result;
	}
}


HOST = _fn.createHost( hostCfg, environment );

config = {
	env : environment,
	protocol : protocol,
	HOST : HOST,
	host : 'https://hotelgateway.yimeixinxijishu.com'
};

module.exports = config;