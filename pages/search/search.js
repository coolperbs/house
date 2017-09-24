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
		// console.log(1122);
		var self = this;
		var type = option.type||'xioaqu';
		self.pageName = type;
		_fn.init(self);
	},
	inputSearchCommon_focus:function(){
		var self = this;
		var pageName = self.pageName;
		wx.navigateTo({
			url:'../inputSearch/inputSearch?type='+pageName
		});
	}
});
_fn = {
	init:function(page){
		_fn.changeTitle(page);
		page.searchHandler = _fn.getSearchHander(page);

		if(!page.selectSearchInst){
			page.selectSearchInst = new selectSearch({
				page:page,
				onChangeItem:function(data){
					console.log(data);
					page.pageListInst.reset()
				}
			});
			page.searchHandler({},function(res){
				var regionData = res.regionCat;
				page.selectSearchInst.setRegion(regionData);
			});
		}
		if(!page.pageListInst){
			var pageListHeight = (utils.toRpx(wx.getSystemInfoSync().windowHeight)-200)+'rpx';
			page.pageListInst = new pageList({
				page:page,
				height:pageListHeight,
				getNextPage:function(param){
					var currentPage = param.currentPage;
					var pageParam = page.selectSearchInst.getParam();
					pageParam.currentPage=param.currentPage; 
					var callback = param.callback;
					page.searchHandler(pageParam,function(data){
						callback(data);
					});
				},
				tapItem:function(res){

				}
			});
		}
		
	},
	changeTitle:function(page){
		var pageName = page.pageName
		var pageTitle = '安X客';
		switch(true){
			case pageName==="newHouse":
				pageTitle='新房'
				break;
			case pageName==="oldHouse":
				pageTitle='二手房'
				break;
			case pageName==="rentHouse":
				pageTitle='租房'
				break;
			case pageName==="xiaoqu":
				pageTitle='小区'
				break;
			case pageName==="zhongjie":
				pageTitle='房产专家'
				break;
		}
		wx.setNavigationBarTitle({
			title:pageTitle
		})
	},
	getSearchHander:function(page){
		var pageName = page.pageName
		var searchHandler;
		switch(true){
			case pageName==="newHouse":
				searchHandler = _fn.searchNewHouse;
				break;
			case pageName==="oldHouse":
				searchHandler = _fn.searchOldHouse
				break;
			case pageName==="rentHouse":
				searchHandler = _fn.searchRentHouse
				break;
			case pageName==="xiaoqu":
				searchHandler = _fn.searchXiaoQu
				break;
			case pageName==="zhongjie":
				searchHandler = _fn.searchZhongJie
				break;
		}
		return searchHandler
	},
	searchNewHouse:function(param,callback){
		var defaultParam = {
			venderId:'2274',
			lng:'100',
			lat:'100',
			currentPage:1,
			cityCode:wx.getStorageSync('city').code
		}
		if(param){
			for(var i in param){
				defaultParam[i] = param[i]
			}
		}
		newhouseService.search(defaultParam,function(res){
			if(res.code==='0000'&&res.success===true){
				var callbackData = {
					isLast:!res.data.hasMore,
					dataList:res.data.stores,
					regionCat:res.data.regionCat,
					itemTpl:'newhouse'
				}
				callback(callbackData);
			}else{
				wx.showModal({
					title:'提示',
					content:res.msg,
					showCancel:false
				});
			}
		});
	},
	searchRentHouse:function(param,callback){
		var defaultParam = {
			venderId:'2274',
			lng:'100',
			lat:'100',
			currentPage:1,
			cityCode:wx.getStorageSync('city').code
		}
		if(param){
			for(var i in param){
				defaultParam[i] = param[i]
			}
		}
		renthouseService.search(defaultParam,function(res){
			if(res.code==='0000'&&res.success===true){
				var callbackData = {
					isLast:!res.data.hasMore,
					dataList:res.data.stores,
					regionCat:res.data.regionCat,
					itemTpl:'renthouse'
				}
				callback(callbackData);
			}else{
				wx.showModal({
					title:'提示',
					content:res.msg,
					showCancel:false
				});
			}
		});
	},
	searchOldHouse:function(param,callback){
		var defaultParam = {
			venderId:'2274',
			lng:'100',
			lat:'100',
			currentPage:1,
			cityCode:wx.getStorageSync('city').code
		}
		if(param){
			for(var i in param){
				defaultParam[i] = param[i]
			}
		}
		oldhouseService.search(defaultParam,function(res){
			if(res.code==='0000'&&res.success===true){
				var callbackData = {
					isLast:!res.data.hasMore,
					dataList:res.data.stores,
					regionCat:res.data.regionCat,
					itemTpl:'oldhouse'
				}
				callback(callbackData);
			}else{
				wx.showModal({
					title:'提示',
					content:res.msg,
					showCancel:false
				});
			}
		});
	},
	searchXiaoQu:function(param,callback){
		var defaultParam = {
			venderId:'2274',
			lng:'100',
			lat:'100',
			currentPage:1,
			cityCode:wx.getStorageSync('city').code
		}
		if(param){
			for(var i in param){
				defaultParam[i] = param[i]
			}
		}
		xiaoquService.search(defaultParam,function(res){
			if(res.code==='0000'&&res.success===true){
				var callbackData = {
					isLast:!res.data.hasMore,
					dataList:res.data.stores,
					regionCat:res.data.regionCat,
					itemTpl:'xiaoqu'
				}
				callback(callbackData);
			}else{
				wx.showModal({
					title:'提示',
					content:res.msg,
					showCancel:false
				});
			}
		});
	},
	searchZhongJie:function(param,callback){
		var defaultParam = {
			venderId:'2274',
			lng:'100',
			lat:'100',
			currentPage:1,
			cityCode:wx.getStorageSync('city').code
		}
		if(param){
			for(var i in param){
				defaultParam[i] = param[i]
			}
		}
		zhongjieService.search(defaultParam,function(res){
			if(res.code==='0000'&&res.success===true){
				var callbackData = {
					isLast:!res.data.hasMore,
					dataList:res.data.man,
					regionCat:res.data.regionCat,
					itemTpl:'zhongjie'
				}
				callback(callbackData);
			}else{
				wx.showModal({
					title:'提示',
					content:res.msg,
					showCancel:false
				});
			}
		});
	}
}