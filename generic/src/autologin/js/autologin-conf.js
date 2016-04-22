var Conf = {};


//Will set from Platform specific 
//Conf.EXTENSION_VERSION = chrome.runtime.getManifest().version;
Conf.API_VERSION = 'v0.9.43';

var userAgentDetect = Utils.UserAgentDetect;
userAgentDetect.init();
Conf.BROWSER_NAME = userAgentDetect.browserName;
Conf.BROWSER_VERSION = userAgentDetect.browserVersion;
Conf.OS_NAME = userAgentDetect.osName;
Conf.OS_VERSION = userAgentDetect.osVersion;
Conf.LOG_AD_REPLACEMENT = false



 
Utils.logerror = function(msg) {
	try{
		console.error(msg)
	}catch(exception){
	
	}	
};

