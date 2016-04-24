/* global vAPI */
/* exported AppExtn */

/******************************************************************************/

var AppExtn = (function() {

'use strict';

/******************************************************************************/

var oneSecond = 1000;
var oneMinute = 60 * oneSecond;
var oneHour = 60 * oneMinute;


return {
    userSettings: {
    
    },

 

    pageStores: {},

    storageQuota: vAPI.storage.QUOTA_BYTES,
    storageUsed: 0,

    noopFunc: function(){},


    // so that I don't have to care for last comma
    dummy: 0
};

/******************************************************************************/

})();


var DomUtils={}

DomUtils.parseUri = function (url) {
	var matches = /^(([^:]+(?::|$))(?:(?:\w+:)?\/\/)?(?:[^:@\/]*(?::[^:@\/]*)?@)?(([^:\/?#]*)(?::(\d*))?))((?:[^?#\/]*\/)*[^?#]*)(\?[^#]*)?(\#.*)?/.exec(url);
	var keys = ["href", "origin", "protocol", "host", "hostname", "port", "pathname", "search", "hash"];
	var uri = {};
	for (var i=0; (matches && i<keys.length); i++)
		uri[keys[i]] = matches[i] || "";
	return uri;
};

DomUtils.parseUri.secondLevelDomainOnly = function (appdomainold, keepDot) {

//effectiveTLD.getBaseDomainFromHost(item.docDomain).toUpperCase();
var appdomain=appdomainold.toString() +""

	var match = appdomain.match(/([^\.]+\.(?:co\.)?[^\.]+)\.?$/) || [appdomain, appdomain];
	return match[keepDot ? 0 : 1].toLowerCase();
};





if (!vAPI.hasOwnProperty('toolbarButton')) {
	vAPI.toolbarButton={}
}


/******************************************************************************
	vAPI.toolbarButton.events.listeners 
******************************************************************************/

vAPI.toolbarButton.events={
	
	listeners:[],
	onClick:function(callback){
		vAPI.toolbarButton.events.listeners.push(callback)
		
	},
	handleClick:function(tab){
		for(var i=0;i<vAPI.toolbarButton.events.listeners.length;i++)
			vAPI.toolbarButton.events.listeners[i](tab)
		
	},
	remove:function(callback){
		
		var i=0;
		for( i=0;i<vAPI.toolbarButton.events.listeners.length;i++){
			if(callback == vAPI.toolbarButton.events.listeners[i]){
				
				break
			}
				
		}
			
			if(i<vAPI.toolbarButton.events.listeners.length)
					vAPI.toolbarButton.events.listeners.splice(i,1);
			
		
		//???
	}
	
	
}




if (!vAPI.hasOwnProperty('tabWatcher')) {
	vAPI.tabWatcher={}
}



vAPI.tabWatcher.events={
	
	activatelisteners:[],
	
	onActivate:function(callback){
		vAPI.tabWatcher.events.activatelisteners.push(callback)
		
	},
	handleActivate:function(tab){
		for(var i=0;i<vAPI.tabWatcher.events.activatelisteners.length;i++)
			vAPI.tabWatcher.events.activatelisteners[i](tab)
		
	},
	remove:function(callback){
		
		var i=0;
		for(i=0;i<vAPI.tabWatcher.events.activatelisteners.length;i++){
			if(callback == vAPI.tabWatcher.events.activatelisteners[i]){
				
				break
			}
				
		}
		
			if(i<vAPI.tabWatcher.events.activatelisteners.length){
					vAPI.tabWatcher.events.activatelisteners.splice(i,1);
					return
					}
			
			
			
			
		
		//???
	}
	
	
}
	


/******************************************************************************/

