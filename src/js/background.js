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
	
function BetterInnerHTML(o,p,q){function r(a){var b;if(typeof DOMParser!="undefined")b=(new DOMParser()).parseFromString(a,"application/xml");else{var c=["MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"];for(var i=0;i<c.length&&!b;i++){try{b=new ActiveXObject(c[i]);b.loadXML(a)}catch(e){}}}return b}function s(a,b,c){a[b]=function(){return eval(c)}}function t(b,c,d){if(typeof d=="undefined")d=1;if(d>1){if(c.nodeType==1){var e=document.createElement(c.nodeName);var f={};for(var a=0,g=c.attributes.length;a<g;a++){var h=c.attributes[a].name,k=c.attributes[a].value,l=(h.substr(0,2)=="on");if(l)f[h]=k;else{switch(h){case"class":e.className=k;break;case"for":e.htmlFor=k;break;default:e.setAttribute(h,k)}}}b=b.appendChild(e);for(l in f)s(b,l,f[l])}else if(c.nodeType==3){var m=(c.nodeValue?c.nodeValue:"");var n=m.replace(/^\s*|\s*$/g,"");if(n.length<7||(n.indexOf("<!--")!=0&&n.indexOf("-->")!=(n.length-3)))b.appendChild(document.createTextNode(m))}}for(var i=0,j=c.childNodes.length;i<j;i++)t(b,c.childNodes[i],d+1)}p="<root>"+p+"</root>";var u=r(p);if(o&&u){if(q!=false)while(o.lastChild)o.removeChild(o.lastChild);t(o,u.documentElement)}}

/******************************************************************************/

