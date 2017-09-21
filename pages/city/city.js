var ajax = require( '../../common/ajax/ajax' ),
    utils = require( '../../common/utils/utils' ),
    app = getApp(),
    _fn;

Page({

    data: {
        scorllId: 'C'
    },
    onLoad: function(options) {
        this.getCity();
    },
    onShareAppMessage : app.shareFunc,
    getCity() {
        const self = this;
        ajax.query( {
            url : app.host + '/city'
        }, function( res ) {
            if ( utils.isErrorRes( res ) ) {
                return;
            }
            console.log( res );
            res.data = _fn.formatData( res.data );
            self.setData( {
                pageData : res.data
            } );
        } );
    },
    onShareAppMessage : app.shareFunc,
    scrollIntoCity(ev) {
        let id = ev.currentTarget.dataset.id;
        console.log(id);
        this.setData({
            scorllId: '' + id
        })
    },
    selectCity : function( e ) {
        console.log( e );
        var data = e.currentTarget.dataset;

        if ( !data.citycode || !data.cityname ) {
            return;
        }
        wx.setStorageSync( 'city', {
            name : data.cityname,
            code : data.citycode
        } );
        wx.navigateBack();
    }    
});

_fn = {
    formatData : function( data ) {
        var cityList = [],
            p;

        for ( p in data.cityMap ) {
            cityList.push( {
                letter : p,
                city : data.cityMap[p]
            } );
        }
        data.cityList = cityList;
        return data;
    }
}