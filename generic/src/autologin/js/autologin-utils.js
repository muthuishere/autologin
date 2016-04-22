var Utils = {};

//enum of element types
Utils.ELEMENT_TYPES = {
	NONE: 0,
	script: 1,
	image: 2,
	background: 4,
	stylesheet: 8,
	'object': 16,
	subdocument: 32,
	object_subrequest: 64,
	media: 128,
	other: 256,
	xmlhttprequest: 512,
	'document': 1024,
	elemhide: 2048,
	popup: 4096,
	//for types that are implied by a filter that don't explicitly specify types
	DEFAULTTYPES: 1023
};


//convert a webRequest.onBeforeRequest type to an ElementType.
Utils.ELEMENT_TYPES.fromOnBeforeRequestType = function(type) {
	switch(type) {
		case 'main_frame': return Utils.ELEMENT_TYPES.document;
		case 'sub_frame': return Utils.ELEMENT_TYPES.subdocument;
		//see http://src.chromium.org/viewvc/chrome/trunk/src/webkit/glue/resource_type.h?view=markup for what 'other' includes
		case 'other': return Utils.ELEMENT_TYPES.other;
		default: return Utils.ELEMENT_TYPES[type];
	}
};


Utils.FILTER_OPTIONS = {
	NONE: 0,
	THIRDPARTY: 1,
	MATCHCASE: 2,
	FIRSTPARTY: 4
};
//create a guid
Utils.guid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
};

Utils.setDefault = function (obj, value, defaultValue) {
	if (obj[value] === undefined)
		obj[value] = defaultValue;
	return obj[value];
};

Utils.parseUri = function (url) {
	var matches = /^(([^:]+(?::|$))(?:(?:\w+:)?\/\/)?(?:[^:@\/]*(?::[^:@\/]*)?@)?(([^:\/?#]*)(?::(\d*))?))((?:[^?#\/]*\/)*[^?#]*)(\?[^#]*)?(\#.*)?/.exec(url);
	var keys = ["href", "origin", "protocol", "host", "hostname", "port", "pathname", "search", "hash"];
	var uri = {};
	for (var i=0; (matches && i<keys.length); i++)
		uri[keys[i]] = matches[i] || "";
	return uri;
};

Utils.parseUri.secondLevelDomainOnly = function (appdomain, keepDot) {

//effectiveTLD.getBaseDomainFromHost(item.docDomain).toUpperCase();

	var match = appdomain.match(/([^\.]+\.(?:co\.)?[^\.]+)\.?$/) || [appdomain, appdomain];
	return match[keepDot ? 0 : 1].toLowerCase();
};

//detect operating system and browser info

Utils.UserAgentDetect = {

	init: function () {
	
	
		//get browser name
		var browserData = this.findMatchingData(this.dataBrowser);
		if(browserData) {
			this.browserName = browserData.identity;
			var browserVersionSearchString = browserData.versionSearch || browserData.identity;
			//get browser version
			this.browserVersion = this.searchBrowserVersion(navigator.userAgent, browserVersionSearchString)
				|| this.searchBrowserVersion(navigator.appVersion, browserVersionSearchString)
				|| "Unknown";			
		}
		else {
			// could not find browser info
			this.browserName = "Unknown";
			this.browserVersion = "Unknown";
		}
		//get operating system name
		var osData = this.findMatchingData(this.dataOS);
		if(osData) {
			this.osName = osData.identity;
			if(this.osName.indexOf('Windows') >= 0) {
				//special case for windows os version
				this.osVersion = /Windows (.*)/.exec(this.osName)[1];
				this.osName = 'Windows';
			}
			else {
				//get operating system version
				this.osVersion = this.searchOSVersion(navigator.userAgent, osData.versionSearch) 
				|| this.searchOSVersion(navigator.appVersion, osData.versionSearch)
				|| 'Unknown';
			}
		}
		else {
			// could not find os info
			this.osName = "Unknown";
			this.osVersion = "Unknown";
		}
	},
	findMatchingData: function (data) {
		var i, dataString, dataProp;
		for (i = 0; i < data.length; i++) {
			var dataRegex = data[i].regex;
			dataString	= data[i].string;
			dataProp = data[i].prop;
			if (dataString) {
				if(dataRegex.test(dataString)) {
					return data[i];
				}
			} else {
				if (dataProp) {
					return data[i];
				}
			}
		}
	},
	searchBrowserVersion: function (dataString, browserVersionSearchString) {
		var index = dataString.indexOf(browserVersionSearchString);
		if (index === -1) {
			return;
		}
		return parseFloat(dataString.substring(index + browserVersionSearchString.length + 1));
	},
	searchOSVersion: function(dataString, osVersionSearchRegex) {
		var osVersion = osVersionSearchRegex.exec(dataString);
		if(osVersion && osVersion.length > 1) {
			osVersion.splice(0, 1);
			return osVersion.join('.');
		}
		else {
			return osVersion;;
		}
	},
	dataBrowser: [{
		string: navigator.userAgent,
		regex: /Chrome/,
		identity: "Chrome"
	}, {
		string: navigator.userAgent,
		regex: /OmniWeb/,
		versionSearch: "OmniWeb/",
		identity: "OmniWeb"
	}, {
		string: navigator.vendor,
		regex: /Apple/,
		identity: "Safari",
		versionSearch: "Version"
	},  {
		string: navigator.vendor,
		regex: /iCab/,
		identity: "iCab"
	}, {
		string: navigator.vendor,
		regex: /KDE/,
		identity: "Konqueror"
	}, {
		string: navigator.userAgent,
		regex: /Firefox/,
		identity: "Firefox"
	}, {
		string: navigator.vendor,
		regex: /Camino/,
		identity: "Camino"
	}, {		// for newer Netscapes (6+)
		string: navigator.userAgent,
		regex: /Netscape/,
		identity: "Netscape"
	}, {
		string: navigator.userAgent,
		regex: /MSIE/,
		identity: "Explorer",
		versionSearch: "MSIE"
	}, {
		string: navigator.userAgent,
		regex: /Gecko/,
		identity: "Mozilla",
		versionSearch: "rv"
	}, {
		string: navigator.userAgent,
		regex: /Mozilla/,
		identity: "Netscape",
		versionSearch: "Mozilla"
	}],
	dataOS : [{
		string: navigator.userAgent,
		regex: /Win16/,
		identity: 'Windows 3.11',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Windows 95|Win95|Windows_95)/,
		identity: 'Windows 95',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Win 9x 4.90|Windows ME)/,
		identity: 'Windows ME',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Windows 98|Win98)/,
		identity: 'Windows 98',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /Windows CE/,
		identity: 'Windows CE',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Windows NT 5.0|Windows 2000)/,
		identity: 'Windows 2000',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Windows NT 5.1|Windows XP)/,
		identity: 'Windows XP',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /Windows NT 5.2/,
		identity: 'Windows Server 2003',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /Windows NT 6.0/,
		identity: 'Windows Vista',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Windows 7|Windows NT 6.1)/,
		identity: 'Windows 7',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Windows 8.1|Windows NT 6.3)/,
		identity: 'Windows 8.1',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Windows 8|Windows NT 6.2)/,
		identity: 'Windows 8',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
		identity: 'Windows NT 4.0',
		versionSearch: /Windows (.*)/
	}, {
		string: navigator.userAgent,
		regex: /Android/,
		identity: 'Android',
		versionSearch: /Android ([\.\_\d]+)/
	}, {
		string: navigator.userAgent,
		regex: /OpenBSD/,
		identity: 'Open BSD'
	}, {
		string: navigator.userAgent,
		regex: /SunOS/,
		identity: 'Sun OS'
	}, {
		string: navigator.userAgent,
		regex: /(Linux|X11)/,
		identity: 'Linux'
	}, {
		string: navigator.userAgent,
		regex: /(iPhone|iPad|iPod)/,
		identity: 'iOS',
		versionSearch: /OS (\d+)_(\d+)_?(\d+)?/
	}, {
		string: navigator.userAgent,
		regex: /Mac OS X/,
		identity: 'Mac OS X',
		versionSearch: /Mac OS X (\d+)_(\d+)_?(\d+)?/
	}, {
		string: navigator.userAgent,
		regex: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/,
		identity: 'Mac OS'
	}, {
		string: navigator.userAgent,
		regex: /QNX/,
		identity: 'QNX'
	}, {
		string: navigator.userAgent,
		regex: /UNIX/,
		identity: 'UNIX'
	}, {
		string: navigator.userAgent,
		regex: /BeOS/,
		identity: 'BeOS'
	}, {
		string: navigator.userAgent,
		regex: /OS\/2/,
		identity: 'OS/2'
	}, {
		string: navigator.userAgent,
		regex: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
		identity: 'Search Bot'
	}]
};

