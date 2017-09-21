var data = require( './citys.data' ),
	handle;


handle = {	
	getList : function( p, c ) {	// 封装一层，便于以后切换数据源
		switch( arguments.length ) {
			case 0 : // 获取省列表
				return data['0'];
			case 1 : // 获取市列表
				return data['0-' + p];
			case 2 : // 获取区域列表
				return data['0-' + p + '-' + c];
		}
	}
}

module.exports = handle;