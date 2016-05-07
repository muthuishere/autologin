
vAPI.EXTENSION_VERSION = vAPI.app.version;

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const {Services} = Cu.import('resource://gre/modules/Services.jsm', null);

//firefox
/******************************************************************************/

var getTabBrowser = function(win) {
    return vAPI.fennec && win.BrowserApp || win.gBrowser || null;
};




vAPI.onAuthRequired={};

vAPI.onAuthRequired.addListener = function(callback) {
   
 
 
};

vAPI.windows={};

vAPI.windows.open = function(details,callback) {
	
	//chrome.windows.create(details,callback)
}
vAPI.onAuthRequired.removeListener = function(callback) {
   
// chrome.webRequest.onAuthRequired.removeListener(callback)
						
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
   setInterval(callback,timeout)
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
var issueAlert = function (alertID, alertOptions, callbackFunction) {
	//see if user has notifications api

	if (lastAlertId !== alertID) {
		if (Utils.UserAgentDetect.browserVersion >= 22) {

			var listener = {
				observe : function (subject, topic, data) {
					//alert("subject=" + subject + ", topic=" + topic + ", data=" + data);
					lastAlertId = null
						if (typeof callbackFunction === 'function') {
							callbackFunction(alertID);
						}
				}
			}

			var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);

			try {
				var myIconURL = vAPI.getURL(alertOptions.iconUrl);
				
				alertsService.showAlertNotification(myIconURL, alertOptions.title, alertOptions.message, true, "", listener, alertOptions.alert);

			} catch (e) {
				// This can fail on Mac OS X
			
				
				//TODO alert
			//	extension.window.showalert(alertOptions.alert)
					var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
					prompts.alert(null, alertOptions.title, alertOptions.message);

				if (typeof callbackFunction === 'function') {
					callbackFunction(null);
				}

			}

		}
	}
};

