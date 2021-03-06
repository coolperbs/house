var selectSearch = require('../../widgets/search/selectSearch');
var pageList = require('../../widgets/list/pageList');
var service = require('../../service/service');
var utils = require('../../common/utils/utils');
var xiaoquService = service.xiaoqu;
var oldhouseService = service.oldhouse;
var newhouseService = service.newhouse;
var renthouseService = service.rentHouse
var _fn;

Page({

	onShow:function(){
		console.log(111);
		var self = this;
		self.isLock = false;
		self.isLast = false;
		self.currentPage = 0;
		self.dataList = [];
		_fn.init(self);
	},
	toSearch:function(e){
		var type = e.currentTarget.dataset.type;
		wx.navigateTo({
			url:'../search/search?type='+type
		});
	},
	toInputSearch:function(){
		var self = this;
		wx.navigateTo({
			url:'../inputSearch/inputSearch?type=oldHouse'
		});
	},
	toCity:function(){
		var self = this;
		wx.navigateTo({
			url:'../city/city'
		});
	},
	getNext:function(){
		var self = this;
		var isLock= self.isLock;
		var isLast = self.isLast;
		if(isLock || isLast){
			return;
		}else{
			_fn.getPageData(self);
		}
	},
	pageList_tapItem:function(e){
		var storeId = e.currentTarget.dataset.id;
		var url = '../detail/detail?type=2&storeid='+storeId;
		console.log(url);
		wx.navigateTo({
			url:url
		});
	}

});

_fn = {
	init:function(page){
		var pageListHeight = (utils.toRpx(wx.getSystemInfoSync().windowHeight)-100)+'rpx';
		page.setData({
			height:pageListHeight,
			dataList:[]
		});
		_fn.getPageData(page);
		var city = wx.getStorageSync('city');
		page.setData({
			city:city
		})
	},
	getPageData:function(page){
		page.isLock = true;
		page.currentPage = page.currentPage || 0;
		page.currentPage = page.currentPage + 1;
		var param = {
			venderId:'2274',
			lng:'100',
			lat:'100',
			currentPage:page.currentPage,
			cityCode:wx.getStorageSync('city').code
		}
		page.dataList = page.dataList || [];
		oldhouseService.searchIndex(param,function(res){
			if(res.code==='0000' && res.success===true){
				var newDataList = res.data.stores;
				if(newDataList && newDataList.length>0){
					page.dataList = page.dataList.concat(newDataList);
					page.setData({
						dataList:page.dataList
					});
				}
				page.isLock = false;
				page.isLast = !res.data.hasMore;
			}
		});
	}
	
}