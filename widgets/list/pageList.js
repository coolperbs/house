class pageList{
	constructor(param){
		this.page = param.page;
		this.height = param.height||0;
		this.getNextPage = param.getNextPage;
		this.tapItem = param.tapItem;

		this.dataHandler = new dataHandler(this.page);
		this.page.pageList_goNextPage = this.pageList_goNextPage.bind(this);
		this.page.pageList_tapItem = this.pageList_tapItem.bind(this);

		this.currentPage = 0;
		this.isLast = false;
		this.dataList = [];
		this.isLock=false;

		this.render();
	}
	render(){
		this.dataHandler.setData({
			height:this.height
		});
		this.getData();
	}
	pageList_goNextPage(e){
		this.getData();
	}
	pageList_tapItem(e){
		console.log(111,e);
		var dataset = e.currentTarget.dataset;
		this.tapItem(dataset);
	}
	reset(){//重置
		this.currentPage = 0;
		this.isLast = false;
		this.dataList = [];
		this.isLock=false;
		this.getData();
	}
	getData(){
		if(this.isLast || this.isLock){
			return;
		}
		this.currentPage = this.currentPage+1;
		this.isLock = true;
		this.dataHandler.setData({
			isLock:this.isLock
		})
		this.getNextPage({
			currentPage:this.currentPage,
			callback:(res)=>{
				var newDataList = res.dataList||[];
				var itemTpl = res.itemTpl;
				if(newDataList && newDataList.length>0){
					newDataList = newDataList.map((v,k)=>{
						v.itemTpl = itemTpl;
						return v;
					});
				}
				this.isLast = res.isLast;
				this.dataList = this.dataList || [];
				this.dataList = this.dataList.concat(newDataList);
				this.isLock = false;
				this.dataHandler.setData({
					dataList:this.dataList,
					isLock:this.isLock
				});
			}
		});
	}

}
class dataHandler{
	constructor(page) {
		this.page = page;
	}
	setData(data){
		var widgetsData = this.page.data.pageListData||{};
		for(var k in data){
			widgetsData[k] = data[k]
		}
		this.page.setData({
			pageListData:widgetsData
		});
	}
	getData(key){
		return this.page.data.pageListData[key]||null
	}
}

module.exports = pageList;