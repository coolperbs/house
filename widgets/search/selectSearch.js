class selectSearch{
	constructor(param) {
		this.page = param.page;
		this.onChangeItem = param.onChangeItem;
		this.onChangeHeader = param.onChangeHeader
		this.pageName = this.page.pageName;
		this.renderData = _fn.getRenderData(this.pageName);
		this.dataHandler = new dataHandler(this.page);
		this.page.selectSearch_changeHeader = this.selectSearch_changeHeader.bind(this);
		this.page.selectSearch_changeItem = this.selectSearch_changeItem.bind(this);

		this.render();
	}
	selectSearch_changeHeader(e){
		var type = e.currentTarget.dataset.type;
		var selectHeader = this.getClickHeader(type);

		var curType = this.dataHandler.getData('curType');
		var newType = selectHeader.type;

		if(curType === newType){//关闭
			this.updateDrop();
		}else{//打开
			this.update(selectHeader);
		}

		if(this.onChangeHeader && typeof this.onChangeHeader==='function'){
			this.onChangeHeader(type);//
		}
	}
	selectSearch_changeItem(e){
		var key = e.currentTarget.dataset.key.toString();
		var value = e.currentTarget.dataset.value.toString();
		var hasSub = e.currentTarget.dataset.hassub;
		var text = e.currentTarget.dataset.text;
		var curHeader = this.getClickHeader(key);
		if(hasSub){
			var subListConf = curHeader.drop.subList;
			var children = subListConf[value];
			curHeader.drop.children = children;
			this.updateDrop(curHeader);
		}else{
			var getParamFunc =  curHeader.getParam;
			if(getParamFunc && typeof getParamFunc === 'function'){
				var param  = getParamFunc(value);
				curHeader.searchParam = param;
				if(param){
					curHeader.searchText = text;
				}else{
					curHeader.searchText = null;
				}
				if(this.onChangeItem && typeof this.onChangeItem==='function'){
					var retParam = this.getParam();
					this.onChangeItem(retParam);//
				}
				this.dataHandler.setData({
					config:this.renderData
				});
				this.updateDrop();
			}else{
				console.log('error no param func');
			}
		}
	}
	render(){
		if(this.renderData && this.renderData.length>0){
			var width = (750/this.renderData.length)+'rpx';
			this.renderData = this.renderData.map(function(v,k){
				v.width = width;
				return v;
			});
		}
		this.dataHandler.setData({
			config:this.renderData
		});
	}
	getClickHeader(type){
		var selectTab = this.renderData.filter(function(v,k){
			return v.type === type;
		});
		return selectTab[0];
	}
	getParam(){
		var pageParam = {}
		this.renderData.forEach(function(v,k){
			if(v.searchParam){
				for(var k in v.searchParam){
					pageParam[k] = v.searchParam[k];
				}
			}
		});
		console.log(333,pageParam);
		return pageParam;
	}
	update(newHeader){
		if(!newHeader){
			return;
		}
		var curType = this.dataHandler.getData('curType');
		var newType = newHeader.type;
		var drop,type;
		drop = {
			active:true,
			tpl:newHeader.dropTpl,
			data:newHeader.drop
		};
		type = newType;
		this.dataHandler.setData({
			drop:drop,
			curType:type			
		});
	}
	updateDrop(newHeader){
		if(!newHeader){
			var drop = {}
			this.dataHandler.setData({
				drop:drop,
				curType:''
			});
			return;
		}
		var newType = newHeader.type;
		var drop,type;
		
		drop = {
			active:true,
			tpl:newHeader.dropTpl,
			data:newHeader.drop
		};
		type = newType;

		
		this.dataHandler.setData({
			drop:drop,
			curType:type			
		});

	}
	setRegion(data){
		// console.log('setRegion',data);
		var regionData = [{key:'region',value:'',text:'不限'}];
		var catData = {};
		data.forEach((v,k)=>{
			var hasChildren = v.catList&&v.catList.length>0;
			regionData.push({
				key:'region',
				value:v.id,
				text:v.name,
				hasSub:true
			});
			catData[v.id] = catData[v.id] = [
				{key:'region',value:v.id,text:'不限'},
				{key:'region',value:v.id,text:v.name}
			];
			if(hasChildren){
				v.catList.forEach((vc,kc)=>{
					catData[v.id].push({
						key:'region',
						value:v.id+'-'+vc.id,
						text:vc.name
					});
				});
			}
		});

		var regionConfig = this.getClickHeader('region')
		regionConfig.drop ={
				mainList:regionData,
				subList:catData
			}
		// console.log(this.renderData);
	}
}
class dataHandler{
	constructor(page) {
		this.page = page;
	}
	setData(data){
		var widgetsData = this.page.data.selectSearchData||{};
		for(var k in data){
			widgetsData[k] = data[k]
		}
		this.page.setData({
			selectSearchData:widgetsData
		});
	}
	getData(key){
		return this.page.data.selectSearchData[key]||null
	}
}
var _fn = {
	getRenderData:function(pageName){
		var config = []
		var region = _fn.getRegion();
		var xiaoQuPrice = _fn.getXiaoQuPrice();
		var newHousePrice = _fn.getNewHousePrice();
		var oldHousePrice = _fn.getOldHousePrice();
		var rentHousePrice = _fn.getRentHousePrice();
		var houseAge = _fn.getHouseAge();
		var houseType = _fn.getHouseType();
		switch(true){
			case pageName==="newHouse":
				config.push(region);
				config.push(newHousePrice);
				config.push(houseType);
				break;
			case pageName==="oldHouse":
				config.push(region);
				config.push(oldHousePrice);
				config.push(houseType);
				break;
			case pageName==="rentHouse":
				config.push(region);
				config.push(rentHousePrice);
				break;
			case pageName==="zhongjie":
				config.push(region);
				break;
			case pageName === 'xiaoqu':
				config.push(region);
				config.push(xiaoQuPrice);
				config.push(houseAge);
				break;
		}
		return config;
	},
	getRegion:function(){
		return {
			type:'region',
			dropTpl:'selectSearchScrollListWithSub',
			active:false,
			header:{
				name:'区域'
			},
			drop:{
				mainList:[],
				subList:[]
			},
			getParam:function(value){
				var region,cat;
				if(value){
					if(value.indexOf('-')>0){
						var valArr = value.split('-');
						region = valArr[0];
						cat = valArr[1]!='*'?valArr[1]:null;
					}else{
						region=value;
					}
					return {
						region:region,
						cat:cat
					}
				}

			}
		}

	},
	getHouseType:function(){
		return {
			type:'houseType',
			dropTpl:'selectSearchScrollList',
			active:false,
			header:{
				name:'房型'
			},
			drop:{
				items:[
					{key:'houseType',value:'',text:'不限'},
					{key:'houseType',value:'1',text:'一室'},
					{key:'houseType',value:'2',text:'二室'},
					{key:'houseType',value:'3',text:'三室'},
					{key:'houseType',value:'4',text:'四室'},
					{key:'houseType',value:'4',text:'五室'},
					{key:'houseType',value:'6',text:'五室以上'}
				]
			},
			getParam:function(value){
				if(value){
					return {type:value}
				}
			}
		}

	},
	getXiaoQuPrice:function(){
		return {
			type:'price',
			dropTpl:'selectSearchScrollList',
			active:false,
			header:{
				name:'价格'
			},
			drop:{
				items:[
					{key:'price',value:'',text:'不限'},
					{key:'price',value:'0-5000',text:'5000元以下'},
					{key:'price',value:'5000-8000',text:'5000-8000元'},
					{key:'price',value:'8000-10000',text:'8000-1万'},
					{key:'price',value:'10000-15000',text:'1-1.5万'},
					{key:'price',value:'15000-*',text:'1.5万以上'}
				]
			},
			getParam:function(value){
				var minPrice;
				var maxPrice;
				if(value){
					if(value.indexOf('-')>0){
						var valArr = value.split('-');
						minPrice = valArr[0];
						maxPrice = valArr[1]!='*'?valArr[1]:null;
					}
					return {
						minPrice:minPrice,
						maxPrice:maxPrice
					}
				}
			}
		}
	},
	getNewHousePrice:function(){
		return {
			type:'newHousePrice',
			dropTpl:'selectSearchScrollList',
			active:false,
			header:{
				name:'售价'
			},
			drop:{
				items:[
					{key:'newHousePrice',value:'',text:'不限'},
					{key:'newHousePrice',value:'0-6000',text:'6千以下'},
					{key:'newHousePrice',value:'6000-8000',text:'6-8千'},
					{key:'newHousePrice',value:'8000-10000',text:'8千-1万'},
					{key:'newHousePrice',value:'10000-15000',text:'1-1.5万'},
					{key:'newHousePrice',value:'15000-*',text:'1.5万以上'}
				]
			},
			getParam:function(value){
				var minPrice;
				var maxPrice;
				if(value){
					if(value.indexOf('-')>0){
						var valArr = value.split('-');
						minPrice = valArr[0];
						maxPrice = valArr[1]!='*'?valArr[1]:null;
					}
					return {
						minPrice:minPrice,
						maxPrice:maxPrice
					}
				}
			}
		}
	},
	getOldHousePrice:function(){
		return {
			type:'oldHousePrice',
			dropTpl:'selectSearchScrollList',
			active:false,
			header:{
				name:'售价'
			},
			drop:{
				items:[
					{key:'oldHousePrice',value:'',text:'不限'},
					{key:'oldHousePrice',value:'0-30',text:'30万以下'},
					{key:'oldHousePrice',value:'30-40',text:'30-40万'},
					{key:'oldHousePrice',value:'40-50',text:'40-50万'},
					{key:'oldHousePrice',value:'50-80',text:'50-80万'},
					{key:'oldHousePrice',value:'80-100',text:'80-100万'},
					{key:'oldHousePrice',value:'100-120',text:'100-120万'},
					{key:'oldHousePrice',value:'120-150',text:'120-150万'},
					{key:'oldHousePrice',value:'150-200',text:'150-200万'},
					{key:'oldHousePrice',value:'200-*',text:'200万以上'}
				]
			},
			getParam:function(value){
				var minPrice;
				var maxPrice;
				if(value){
					if(value.indexOf('-')>0){
						var valArr = value.split('-');
						minPrice = valArr[0];
						maxPrice = valArr[1]!='*'?valArr[1]:null;
					}
					return {
						minPrice:minPrice,
						maxPrice:maxPrice
					}
				}
			}
		}
	},
	getRentHousePrice:function(){
		return {
			type:'rentHousePrice',
			dropTpl:'selectSearchScrollList',
			active:false,
			header:{
				name:'价格'
			},
			drop:{
				items:[
					{key:'rentHousePrice',value:'',text:'不限'},
					{key:'rentHousePrice',value:'0-500',text:'500以下'},
					{key:'rentHousePrice',value:'500-800',text:'500-800'},
					{key:'rentHousePrice',value:'800-1000',text:'800-1000'},
					{key:'rentHousePrice',value:'1000-1500',text:'1000-1500'},
					{key:'rentHousePrice',value:'1500-2000',text:'1500-2000'},
					{key:'rentHousePrice',value:'2000-3000',text:'2000-3000'},
					{key:'rentHousePrice',value:'3000-5000',text:'3000-5000'},
					{key:'rentHousePrice',value:'5000-8000',text:'5000-8000'},
					{key:'rentHousePrice',value:'8000-*',text:'8000以上'}
				]
			},
			getParam:function(value){
				var minPrice;
				var maxPrice;
				if(value){
					if(value.indexOf('-')>0){
						var valArr = value.split('-');
						minPrice = valArr[0];
						maxPrice = valArr[1]!='*'?valArr[1]:null;
					}
					return {
						minPrice:minPrice,
						maxPrice:maxPrice
					}
				}
			}
		}
	},
	getHouseAge:function(){
		return {
			type:'houseAge',
			dropTpl:'selectSearchScrollList',
			active:false,
			header:{
				name:'房龄'
			},
			drop:{
				items:[
					{key:'houseAge',value:'',text:'不限'},
					{key:'houseAge',value:'0-2',text:'2年内'},
					{key:'houseAge',value:'2-5',text:'2-5年'},
					{key:'houseAge',value:'5-10',text:'5-10年'},
					{key:'houseAge',value:'10-*',text:'10年以上'}
				]
			},
			getParam:function(value){
				var minAge;
				var maxAge;
				if(value){
					if(value.indexOf('-')>0){
						var valArr = value.split('-');
						minAge = valArr[0];
						maxAge = valArr[1]!='*'?valArr[1]:null;
					}
					return {
						minAge:minAge,
						maxAge:maxAge
					}
				}
			}
		}

	}
}








module.exports = selectSearch;