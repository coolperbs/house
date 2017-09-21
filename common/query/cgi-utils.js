/**
 * 用于将cgi-config 配置的接口转换成对应环境和协议的接口
 */
    var handle,
        _fn,
        CFG;
    var URLObject = {};
    var evtUrlObject = {};
    var us = require('../../lib/underscore.js');
    var app = getApp();


    handle = {
        regCgis:function(cgiConfig){
            var cgiName,cgiHost,cgiUrl;
            us.each(cgiConfig,function(val,key){
                var curCgi = "";
                cgiName = key;
                cgiHost = val.host;
                cgiUrl = val.url;
                _fn.addCgi(cgiName,cgiHost,cgiUrl);
            });
//            console.log(evtUrlObject);
            return evtUrlObject;

        },
        getCurrentEvt:function(){//获取当前页面的环境类型:test,prod
            return {
                envName:app.globalData.evt,
                envPrifix:app.globalData.evt,
                protocol: "http"//上线后为https
            };
        }
    };
    _fn = {
        addHost :   function(cgiName,cgiHost){
            if(!URLObject.cgiHost){
                URLObject.cgiHost = {};
            }
            if(!URLObject.cgiHost[cgiName]){
                URLObject.cgiHost[cgiName] = cgiHost;
            }else{
                console.log(cgiName+"已经存在");
            }
        },
        addUrl  :   function(cgiName,cgiUrl){
            if(!URLObject.cgiUrl){
                URLObject.cgiUrl = {};
            }
            if(!URLObject.cgiUrl[cgiName]){
                URLObject.cgiUrl[cgiName] = cgiUrl;
            }else{
                console.log(cgiName+"已经存在");
            }
        },
        getCurrentEvtUrlObj:function(cgiName){

            var host = URLObject.cgiHost[cgiName];
            var url = URLObject.cgiUrl[cgiName];
            var currentEvt = handle.getCurrentEvt();
//            console.log(evtHost,host,url,currentEvt);
            //组装host ， 如果配置的是string ，就在前边使用dev 或者test。否则，就读取对象的相应环境（test，dev，prod）的name名称
            var evtHost = "";

            if(typeof host == 'string'){
                evtHost = currentEvt.envPrifix + host;
            }else{
                evtHost = host[currentEvt.envName];
            }
            var defaultPrefix = currentEvt.protocol+"://";
            evtHost = defaultPrefix + evtHost;

            for(var i in url){
                //组装URL 如果配置的是string ，直接使用，就读取对象的相应环境（test，dev，prod）的name名称
                var evtUrl = url[i];
                if(typeof evtUrl !== "string"){
                    evtUrl = evtUrl[currentEvt.envName];
                }
                evtUrlObject[i] = evtHost + evtUrl;
            }
        },
        addCgi  :   function(cgiName,cgiHost,cgiUrl){
            _fn.addHost(cgiName,cgiHost);
            _fn.addUrl(cgiName,cgiUrl);
            _fn.getCurrentEvtUrlObj(cgiName);
        }
    };

    module.exports = handle;
