Conf.EXTENSION_VERSION = chrome.runtime.getManifest().version;







chrome.browserAction.onClicked.addListener(vAPI.toolbarButton.events.handleClick)
chrome.tabs.onActivated.addListener(function(info){

	var tabId=info.tabId

	vAPI.tabs.get(tabId, function(tab) {

	
	
			vAPI.tabWatcher.events.handleActivate(tab)

	})
		


});

//Activate event for location change as well
/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab){

vAPI.tabWatcher.events.handleActivate(updatedTab)
});
	
*/
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
	if(Utils.UserAgentDetect.browserVersion >= 28) {
		//clear any existing notification with the same id
		chrome.notifications.clear(alertID, function(wasCleared) {
			//create notification with specified options
			delete alertOptions.alert;
			chrome.notifications.create(alertID, alertOptions, function(alertID) {
				//execute callback
				if(typeof callbackFunction === 'function') {
					callbackFunction(alertID);
				}
			});
		});
	}
	else {
		//no notifications api, simple alert
		alert(alertOptions.alert);
		//execute callback
		if(typeof callbackFunction === 'function') {
			callbackFunction(null);
		}
	}
};


/**************************************************************************************************
* Purpose: 
*	Checks the refresh_client_data and refresh_notification_count cookies to determine if the 
*	extension and / or data should be refreshed.
*
* Params: None.
*
* Returns: None.
**************************************************************************************************/
var checkRefreshCookies = function() {
	//refresh client data callback method
	var refreshClientDataCallback = function(cookies) {
		//ensure cookie was returned
		if(cookies && cookies.length > 0) {
			cookies.forEach(function(cookie) {
				//check cookie value
				if(cookie.domain == Conf.DOMAIN && cookie.value == '1') {
					Utils.log('refresh cookie found! refreshing data from api');
					//reset the cookie
					chrome.cookies.set({ url: 'https://api' + Conf.DOMAIN + '/', domain: cookie.domain, path: '/', name: 'refresh_client_data', value: '0' }, function(updatedCookies) {
						//ensure initialization is not alredy occurring
						if(extension.autologinInitializing) return;
						extension.autologinInitializing = true;
						//refresh api data
						initApiData(function() {
							Utils.log('cookie data refresh complete');
							//init the extension
							if(!extension.autologinActive) {
								extension.initAutologinExtension();
							}
							else {
								//just refresh the context
								//updateExtensionContext();
							}
							//done initializing
							extension.autologinInitializing = false;
							
							extension.updateBrowserAction()
							
							
							
						});
					});
				}
			});
		}
	};
	//check if refresh cookie exists
	chrome.cookies.getAll({ domain: Conf.DOMAIN, path: '/', name: 'refresh_client_data' }, refreshClientDataCallback);
	//refresh notifcation count callback
	var refreshNotificationCountCallback = function(cookies) {
		//ensure cookie was returned
		if(cookies && cookies.length > 0) {
			cookies.forEach(function(cookie) {
				//check cookie value
				if((cookie.domain == Conf.DOMAIN || cookie.domain == ('.' + Conf.DOMAIN)) && cookie.value == '1') {
					Utils.log('refresh cookie found! refreshing notification count');
					//reset the cookie
					chrome.cookies.set({ url: 'https://api' + Conf.DOMAIN + '/', domain: cookie.domain, path: '/', name: 'refresh_notification_count', value: '0' }, function(updatedCookies) {
						//refresh notification count
						extension.checkNotifications();
					});
				}
			});
		}
	};
	//check if refresh cookie exists
	chrome.cookies.getAll({ domain: Conf.DOMAIN, path: '/', name: 'refresh_notification_count' }, refreshNotificationCountCallback);
};

