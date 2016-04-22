
Conf.EXTENSION_VERSION = vAPI.app.version;

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const {Services} = Cu.import('resource://gre/modules/Services.jsm', null);

//firefox
/******************************************************************************/

var getTabBrowser = function(win) {
    return vAPI.fennec && win.BrowserApp || win.gBrowser || null;
};

vAPI.setAutologinIcon = function(tabId, detail) {
	
	
	var win 
	if(detail.ownerWindow)		
		win=detail.ownerWindow
	else
		win = Services.wm.getMostRecentWindow('navigator:browser');
		
    var curTabId = vAPI.tabs.getTabId(getTabBrowser(win).selectedTab);
    var tb = vAPI.toolbarButton;

    // from 'TabSelect' event
    if ( tabId === undefined ) {
        tabId = curTabId;
    } else if ( detail.badge !== undefined ) {
		
        tb.tabs[tabId] = { badge: detail.badge, img:detail.status,label:detail.label  };
    }

    if ( tabId === curTabId ) {
        tb.updateAutologinState(win, tabId);
    }
};

vAPI.toolbarButton.updateAutologinState = function(win, tabId) {
    var button = win.document.getElementById(this.id);

    if ( !button ) {
        return;
    }

    var data = this.tabs[tabId];

    button.setAttribute('badge', data && data.badge || '');

	
	if( data && data.img && button.classList.contains(data.img) == false){
		
		
	button.classList.remove('off');
	button.classList.remove('active');
	button.classList.remove('init');
	button.classList.remove('whitelist');
	 button.classList.add(data.img);
	  button.setAttribute('label', data.label);
	}
	
	
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
				console.log(e)

				Utils.log("Unable to show notification api  " + alertOptions.alert + ", Using acive window alert");
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


var customCookies={

		getAll : function (object,callbackFunction) {

			
			var cookies=[]

			var cookieManager = Cc["@mozilla.org/cookiemanager;1"].getService(Ci.nsICookieManager);

		


			var count = cookieManager.enumerator;
			while (count.hasMoreElements()) {
				var cookie = count.getNext();
				
				if (cookie instanceof Ci.nsICookie) {
			
			
			
				if(cookie.host.toString().indexOf(object.domain) >=0 && cookie.name.toString() == object.name ){
					//console.log( cookie.name + " domain" + cookie.host.toString())
		
					
					cookies.push(cookie)
					}
				}
			}

			// 
			if (typeof callbackFunction === 'function') {
						callbackFunction(cookies);
				}
		},
		set:function(object,callbackFunction){
		
		
			
			
			this.remove(object);
			
				var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
				var cookieUri = ios.newURI(object.url, null, null);
				var cookieSvc = Cc["@mozilla.org/cookieService;1"].getService(Ci.nsICookieService);
				cookieSvc.setCookieString(cookieUri, null,object.name + "=" + object.value +";", null);
				
				if (typeof callbackFunction === 'function') {
				var cookie=cookieSvc.getCookieString(cookieUri, null)
				
						callbackFunction(cookie);
				}

		},
		remove:function(object){
		
				
		
		var cookieManager = Cc["@mozilla.org/cookiemanager;1"].getService(Ci.nsICookieManager);
			var count = cookieManager.enumerator;
			while (count.hasMoreElements()) {
				var cookie = count.getNext();
				
				if (cookie instanceof Ci.nsICookie) {
			
				if(cookie.host.toString().indexOf(object.domain) >=0 && cookie.name.toString() == object.name ){
					
					cookieManager.remove(cookie.host,cookie.name,cookie.path,false)
					//Utils.log("removing cookie " + object )
					}
				}
			}

			
			
		}


}

/**************************************************************************************************
 * Purpose:
 *	Checks the refresh_client_data cookie to determine if the extension and data should be
 *	re-initialized.
 *
 * Params: None.
 *
 * Returns: None.
 **************************************************************************************************/
var checkRefreshCookies = function () {
	var cookieCallback = function (cookies) {
		//ensure cookie was returned
		if (cookies && cookies.length > 0) {
			cookies.forEach(function (cookie) {
				//check cookie value
				if (cookie.host == Conf.DOMAIN && cookie.value == '1') {
					
					Utils.log('refresh cookie found! refreshing data from api');
					//reset the cookie
					customCookies.set({
						url : 'https://api' + Conf.DOMAIN + '/',
						domain : cookie.host,
						path : '/',
						name : 'refresh_client_data',
						value : '0'
					}, function (updatedCookies) {
						//refresh api data
						initApiData(function () {
							
							Utils.log('cookie data refresh complete');
							//init the extension
							if (!extension.autologinActive) {
								extension.initAutologinExtension();
								
							} else {
								//just refresh the context menus
								//refreshContextMenus();
								//updateContextMenus()
							}
							extension.autologinInitializing = false;
						//	updateExtensionBadge();
						vAPI.tabs.get(null, function(tab) {
							if ( tab )
							   extension.updateBadge(tab)
							
						});
						

						});

					});
				}
			});
		}
	};
	//check if refresh cookie exists
	customCookies.getAll({
		domain : Conf.DOMAIN,
		path : '/',
		name : 'refresh_client_data'
	}, cookieCallback);
};

