vAPI.EXTENSION_VERSION = chrome.runtime.getManifest().version;

vAPI.onAuthRequired = {};

vAPI.onAuthRequired.addListener = function(callback) {

   chrome.webRequest.onAuthRequired.addListener(callback, {
						urls : ["http://*/*","https://*/*"]
						}, ['asyncBlocking']);

};

vAPI.windows = {};

vAPI.windows.open = function(details, callback) {
	chrome.windows.create(details, callback)
}

vAPI.onAuthRequired.removeListener = function(callback) {
  chrome.webRequest.onAuthRequired.removeListener(callback)
};


/*
chrome.browserAction.onClicked.addListener(vAPI.toolbarButton.events.handleClick)
chrome.tabs.onActivated.addListener(function(info){

	var tabId=info.tabId

	vAPI.tabs.get(tabId, function(tab) {



			vAPI.tabWatcher.events.handleActivate(tab)

	})



});
*/
//Activate event for location change as well

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){

		/*

	if (   changeInfo.url === undefined){
			vAPI.handleUpdateTab(tab)
  }

  */

    if (tab.url !== undefined && changeInfo.status == "complete") {

    if (tab.url.indexOf("http") == 0 || tab.url.indexOf("www") == 0) {
    } else {
    	return;
    }

    	vAPI.handleUpdateTab(tab)
	}


});


	//globalAutologinHandler.processScripts(tab)

/******************************************************************************
	setAutologinIcon on tab
******************************************************************************/
vAPI.tabs.toChromiumTabId = function(tabId) {
    if ( typeof tabId === 'string' ) {
        tabId = parseInt(tabId, 10);
    }
    if ( typeof tabId !== 'number' || isNaN(tabId) || tabId === -1 ) {
        return 0;
    }
    return tabId;
};


/**************************************************************************************************
 * Purpose:
 *	Setinterval Implementation for different platforms
 *	.
 *
 * Params:
 *	callback (function) - function to be called upon completion of the operation. alertID
 *		is passed, or null if notifications API is not supported.
  *	timeout (number) - timeout in milli secs.
 *
 * Returns: None.
 **************************************************************************************************/

vAPI.setInterval = function(callback,timeout) {
   window.setInterval(callback,timeout)
};


/**************************************************************************************************
* Purpose:
*	Show extension notification to user, falling back on older methods if browser version does
*	not support the notifications API.
*
* Params:
*	alertID (number) - a unique identifier used to clear the nofication if it is already being
*		displayed.
*	alertOptions (object) - options for the alert, see Chrome notifications API for more info.
*	callbackFunction (function) - function to be called upon completion of the operation. alertID
*		is passed, or null if notifications API is not supported.
*
* Returns: None.
**************************************************************************************************/
var issueAlert = function(alertID, alertOptions, callbackFunction) {
	//see if user has notifications api
	if (Utils.UserAgentDetect.browserVersion >= 28) {
		//clear any existing notification with the same id
		chrome.notifications.clear(alertID, function(wasCleared) {
			//create notification with specified options
			delete alertOptions.alert;
			chrome.notifications.create(alertID, alertOptions, function(alertID) {
				//execute callback
				if (typeof callbackFunction === 'function') {
					callbackFunction(alertID);
				}
			});
		});
	}
	else {
		//no notifications api, simple alert
		alert(alertOptions.alert);
		//execute callback
		if (typeof callbackFunction === 'function') {
			callbackFunction(null);
		}
	}
};
