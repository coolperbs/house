var selectSearch = require('../../widgets/search/selectSearch');
var pageList = require('../../widgets/list/pageList');
var service = require('../../service/service');
var utils = require('../../common/utils/utils');
var xiaoquService = service.xiaoqu;
var oldhouseService = service.oldhouse;
var newhouseService = service.newhouse;
var renthouseService = service.rentHouse;
var zhongjieService = service.zhongjie;
var _fn;
Page({
	onLoad:function(option){
		var id = option.id;
		var page = this;
		page.dataId=id;
		_fn.init(page);
	},
	call:function(e){
		var phone = e.currentTarget.dataset.phone;
		wx.makePhoneCall({
			phoneNumber:phone
		});
	},
	onShareAppMessage:function(option){
		var page = this;
		var man = page.data.man;

		return{
			title:man.name+"(好房)",
			path:"/"
		}
	},
	pageList_tapItem:function(e){
		var storeId = e.currentTarget.dataset.id;
		wx.navigateTo({
			url:'../detail/detail?type=2&storeid='+storeId
		});
	}

});


var _fn = {
	init:function(page){
		var param = {id:page.dataId}
		zhongjieService.info(param,function(res){
			if(res.code==='0000'&&res.success===true){
				page.setData({
					man:res.data.man,
					lease:res.data.lease
				});
				console.log(res.data);
			}
		});
	}
}