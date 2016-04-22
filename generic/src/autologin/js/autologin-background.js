
var µb = µBlock;



var extension =
{
	userLoggedIn : true,
	autologinActive : false,
	notificationCount:0,
	
	autologinContextMenus :
	{
		mnuAutologinContext : null,
		//TODO can be removed
		handleReportAd : function (details, tab)
		{
			
			if (tab === undefined)
				return;
			
			var script = "" +
				"				var getLastRightClickInfoMessageData = {" +
				"							messageType : 'instruction'," +
				"							instruction : 'identifylastrightclickad'," +
				"							url:document.URL" +
				"						};" +
				"				  backgroundPort.onMessage(getLastRightClickInfoMessageData);"
				
				Utils.log("Sending Report Ad information to page ");
			vAPI.tabs.injectScript(tab.id,
			{
				code : script
			},null
			);
			
		},
		
		handleWhitelistChange : function (details, tab)
		{
			
			Utils.log("received message")
			var tabDomain = Utils.parseUri(tab.url).hostname;
			
				
				var isWhitelisted = (Conf.USER_DOMAIN_WHITELISTS.indexOf(tabDomain) >= 0)
				
				if (isWhitelisted)
					extension.removeWhitelist(tab)
				else
					extension.addWhitelist(tab)
						
						
		},
		handleAddIntentions : function (details, tab)
		{
			
			if (tab === undefined)
				return;
			
			Utils.log(details)
			Utils.log(tab)
			
			//"var messager = vAPI.messaging.channel('contentscript-end.js');"
			
			var script = "" +
				"				var getLastRightClickInfoMessageData = {" +
				"							messageType : 'instruction'," +
				"							instruction : 'identifylastrightclickintention'," +
				"							url:document.URL" +
				"						};" +
				"				  autologinContent.backgroundPort.onMessage(getLastRightClickInfoMessageData);"
				
				
			vAPI.tabs.injectScript(tab.id,
			{
				code : script
			},null
			);
			
		},		
		updateContext:function(tabId) {
        
		
		
		
		//Utils.log("Updating context"+tabId)
        var pageStore = µb.pageStoreFromTabId(tabId);
        if ( pageStore === null ) 
            return;
        
		var tabContext = µb.tabContextManager.lookup(tabId);
		Utils.log("Changing context menu" , tabContext)
		extension.autologinContextMenus.refresh({"id":tabId,"url": tabContext.normalURL})
	
			
		
		},
		//Refresh Context menu
		refresh : function (tab)
		{
			// This needs to be local scope: we can't reuse it for more than one
			// menu creation call.
			vAPI.contextMenu.removeAll();
			
			console.log("Attempting to add menu " + tab.url)
			if (!extension.autologinActive)
			{
				Utils.log("Autologin not active")
				return;
			}
			
			 if (tab.url && tab.url.indexOf("about") == 0) {

						return
			  }
			  
			  console.log("Attempting to add menu mnuAutologinContext")
			
			var tabDomain = Utils.parseUri(tab.url).hostname;
			var isWhitelisted = (Conf.USER_DOMAIN_WHITELISTS.indexOf(tabDomain) >= 0)
			
			var mnuAutologinContext =
			{
				id : 'mnuAutologinContext',
				title : 'Autologin',
				isParent : true,
				contexts : ['page', 'editable', 'frame', 'link', 'image', 'video'],
				documentUrlPatterns : ['https://*/*', 'http://*/*']
			};
			
			vAPI.contextMenu.create(mnuAutologinContext);
			
			var mnuIntentions =
			{
				id : 'mnuIntentions',
				title : 'Add to Intentions',
				parentId : 'mnuAutologinContext',
				contexts : ['image'],
				documentUrlPatterns : ['https://*/*', 'http://*/*']
			};
			
			vAPI.contextMenu.create(mnuIntentions, extension.autologinContextMenus.handleAddIntentions);
			
			var label = 'Add ' + tabDomain + ' to Whitelist';
			if (isWhitelisted)
				label = 'Remove ' + tabDomain + ' from Whitelist';
			
			Utils.log("menu label"+ label)
			var mnuChangeWhitelist =
			{
				id : 'mnuChangeWhitelist',
				title : label,
				parentId : 'mnuAutologinContext',
				contexts : ['page'],
				documentUrlPatterns : ['https://*/*', 'http://*/*']
			};
			
			vAPI.contextMenu.create(mnuChangeWhitelist, extension.autologinContextMenus.handleWhitelistChange);
			
			//Report Ad only on non whitelisted domains
			if (!isWhitelisted)
			{
				
				var mnuReportAd =
				{
					id : 'blockElement',
					title : 'Report Ad',
					parentId : 'mnuAutologinContext',
					contexts : ['page', 'editable', 'frame', 'link', 'image', 'video'],
					documentUrlPatterns : ['https://*/*', 'http://*/*']
				};
				
				vAPI.contextMenu.create(mnuReportAd, µBlock.contextMenu.onContextMenuClicked);
				
			}
			
			//vAPI.contextMenu.remove();
			
			
		}
		
},



	handlebrowserAction:function(){
		var url=extension.hasAutologinTab()
		Utils.log("handlebrowserAction",url)
		var details={}
		details.active=true

		if(null != url){
			
			details.url=url
			details.select=true
		}else{

		
		if(extension.userLoggedIn) {
						if(extension.notificationCount > 0)
							details.url=Conf.NOTIFICATIONS_URL					
						else
							details.url=Conf.APP_URL
					}
					else {
						details.url=Conf.LOGIN_URL
					}
					
					
				
					 
		}
		vAPI.tabs.open(details);
	},
	hasAutologinTab:function(){
		var µb= µBlock
		var tabIds=Object.keys(µb.pageStores);

			var foundurl=null
			for(var i=0;i<tabIds.length;i++){


				var tabHostName=µBlock.pageStores[tabIds[i]].tabHostname

				if(tabHostName.indexOf(Conf.DOMAIN) >= 0) {
					
					 var tabContext = µb.tabContextManager.lookup(tabIds[i]);
							foundurl=tabContext.normalURL
					break;


				}

			}
			
			return foundurl;

	},
handlebackgroundrequest : function (details)
{
	
	var blocked = false
		//ensure autologin is active and frame should be tracked for blocking
		
		var tabId = details.tabId;
	
	if (!extension.autologinActive)
		return "";
	
	//get request info
	
	var elType = Utils.ELEMENT_TYPES.fromOnBeforeRequestType(details.type);
	var frameDomain = details.rootHostname
		
	
	
		if (elType == Utils.ELEMENT_TYPES.object
		|| elType == Utils.ELEMENT_TYPES.media
		|| elType == Utils.ELEMENT_TYPES.xmlhttprequest || elType == Utils.ELEMENT_TYPES.subdocument
			 || (elType == Utils.ELEMENT_TYPES.other && frameDomain.indexOf('espn.go.com') == -1 && frameDomain.indexOf('cnn.com') == -1 && frameDomain.indexOf('cbsnews.com') == -1))
			blocked = autologinData['adBlockingRules'].matches(details.url, elType, frameDomain);
		
		
		
		
		if (blocked && frameDomain === "www.hulu.com" && /ads\.hulu\.com/.test(details.url))
			blocked = false;
		
		if (blocked)
			Utils.log("blocking " + "sb:||" + details.requestHostname)
			
			return (blocked == false) ? "" : "sb:||" + details.requestHostname;
		
},

/**************************************************************************************************
* Purpose: 
*	Checks the API for notifications and updates the browser action icon
*
* Params: None.
*
* Returns: None.
**************************************************************************************************/
checkNotifications:function() {
	if(extension.userLoggedIn) {
		Utils.log('checking for notifications');
		
		extension.ajax({
			url: Conf.API_URL + Conf.NOTIFICATION_COUNT_PATH,
			success: function(result, status, xhr) {
				var currentCount=0;
				if(result.success === true) {
					Utils.log(result.data + ' active notifications');
					//save the notification count
					currentCount=parseInt(result.data);
					
			
				}
				
					if(extension.notificationCount != currentCount){
					
						//Update badge
						extension.notificationCount = currentCount;
					
						vAPI.tabs.get(null, function(tab) {
							if ( tab )
							   extension.updateBadge(tab)
							
						});
					}
					
				
			}
		});
	}
},
updateBadge:function(tab){

Utils.log("updating badge" , tab)
var tabId= tab.id

 if ( vAPI.isBehindTheSceneTabId(tabId) ) {
	 
	 
            return;
        }
		
		
		
		var tabDomain = Utils.parseUri(tab.url).hostname;
		

		

		
		
			
var status = "off"
		var label='You are not logged in to Autologin! Click the button to log in.'
		Utils.log("checking logging in",extension.userLoggedIn)
		var badge = ""
	if (extension.userLoggedIn) {

		if (extension.autologinActive &&  !extension.autologinInitializing ) {
			status = "active"
			 label=vAPI.app.name + " v"+ vAPI.app.version 
			 

			 var isWhitelisted = (Conf.USER_DOMAIN_WHITELISTS.indexOf(tabDomain) >= 0)
			 
			 
				if (isWhitelisted){
					status = "whitelist"
					label=vAPI.app.name + " v"+ vAPI.app.version  +  ' (Whitelisted)'
				}

				if (extension.notificationCount > 0) {
						badge=extension.notificationCount +""
							label = 'You have Autologin notifications! Click here to open the Autologin Dashboard and view your notifications.'

					}
		} else {
			label=vAPI.app.name + " v"+ vAPI.app.version  +  ' (Initializing)'
			status = "init"
		}
	}
	
	var detail={}
	detail.status=status
	detail.badge=badge
	detail.label=label
	
        vAPI.setAutologinIcon(tabId, detail);
		Utils.log("Set Autologin icon completed",detail)
},
addWhitelist : function (tab)
{
	
	if (tab == undefined)
		return
		
		//TODO get id
		//get the tab domain
		var tabDomain = Utils.parseUri(tab.url).hostname;
	
	var tabID = tab.id
		
		Utils.log('Adding whitelist record for domain ' + tabDomain);
	//create the userDomainWhitelists record
	var userDomainWhitelist =
	{
		domain : tabDomain
	};
	extension.ajax(
	{
		method : 'POST',
		url : Conf.API_URL + Conf.DOMAIN_WHITELIST_ADD_PATH,
		data : JSON.stringify(userDomainWhitelist),
		success : function (result, status, xhr)
		{
			if (result.success)
			{
				//add domain to conf
				Conf.USER_DOMAIN_WHITELISTS.push(tabDomain);
				//refresh the context
				var µb = µBlock;
				
				//Get active tab & refresh
				
				var  pageStore = µb.pageStoreFromTabId(tabID);
				if ( pageStore ) {
				
				//false should be whitelist
					pageStore.toggleNetFilteringSwitch(tabDomain, 'page', false);
					//extension.updateBadge({"id":tabID})
					Utils.log("Updating badge")
					 µb.updateBadgeAsync(tabID)
					
				}else{
					Utils.log("No Page store")
				}
			
				
				extension.autologinContextMenus.refresh(tab)
				var tabhost = tabDomain
					//extension.tabs.addwhiteList(tabID, tabhost)
					
					//notify user
					var notificationOptions =
				{
					type : 'basic',
					title : 'Whitelist Added',
					message : 'Successfully added ' + tabDomain + ' to your whitelist. You will need to refresh any open pages for the new whitelisting to take effect.',
					alert : 'Successfully added ' + tabDomain + ' to your whitelist. You will need to refresh any open pages for the new whitelisting to take effect.',
					iconUrl : 'img/browsericons/autologinLogo128.png'
				};
				issueAlert('addWhitelistSuccess', notificationOptions);
			}
			else
			{
				//api failure, notify user
				var notificationOptions =
				{
					type : 'basic',
					title : 'Whitelist Error',
					message : 'Whoops! Something unexpected happened while adding ' + tabDomain + ' to your whitelist. Please try again, or contact our support team at admin@autologin.com.',
					alert : 'Whoops! Something unexpected happened while adding ' + tabDomain + ' to your whitelist. Please try again, or contact our support team at admin@autologin.com.',
					iconUrl : 'img/browsericons/autologinLogo128.png'
				};
				issueAlert('AddWhitelistSuccess', notificationOptions);
			}
		}
	}
	);
	
	extension.whiteListProcessing = false
},

removeWhitelist : function (tab)
{
	
	if (tab == undefined)
		return
		
		var tabDomain = Utils.parseUri(tab.url).hostname;
	
	var tabID = tab.id
		
		Utils.log('Removing whitelist record for domain ' + tabDomain);
	//find the whitelist record
	var whitelistRecord = null;
	Conf.USER_DOMAIN_WHITELISTS.forEach(function (userDomainWhitelist)
	{
		if (tabDomain == userDomainWhitelist)
		{
			whitelistRecord = userDomainWhitelist;
		}
	}
	);
	if (whitelistRecord)
	{
		
		extension.ajax(
		{
			method : 'POST',
			url : Conf.API_URL + Conf.DOMAIN_WHITELIST_REMOVE_PATH,
			data : JSON.stringify(
			{
				domain : whitelistRecord
			}
			),
			success : function (result, status, xhr)
			{
				if (result.success)
				{
					//remove record from conf
					Conf.USER_DOMAIN_WHITELISTS.splice(Conf.USER_DOMAIN_WHITELISTS.indexOf(whitelistRecord), 1);
					//refresh the context
					var pageStore = µb.pageStoreFromTabId(tabID);
					if ( pageStore ) {
					
					//false should be whitelist
						pageStore.toggleNetFilteringSwitch(tabDomain, 'page', true);
					//	extension.updateBadge({"id":tabID})
							Utils.log("Updating badge")
							µb.updateBadgeAsync(tabID)
					}
					
					
					extension.autologinContextMenus.refresh(tab)
					//notify the user
					var notificationOptions =
					{
						type : 'basic',
						title : 'Whitelist Removed',
						message : 'Successfully removed ' + tabDomain + ' from your whitelist. You will need to refresh any open pages for the new whitelisting to take effect.',
						alert : 'Successfully removed ' + tabDomain + ' from your whitelist. You will need to refresh any open pages for the new whitelisting to take effect.',
						iconUrl : 'img/browsericons/autologinLogo128.png'
					};
					issueAlert('removeWhitelistSuccess', notificationOptions);
				}
				else
				{
					//api issue, notify user
					var notificationOptions =
					{
						type : 'basic',
						title : 'Whitelist Error',
						message : 'Whoops! Something unexpected happened while removing ' + tabDomain + ' from your whitelist. Please try again, or contact our support team at admin@autologin.com.',
						alert : 'Whoops! Something unexpected happened while removing ' + tabDomain + ' from your whitelist. Please try again, or contact our support team at admin@autologin.com.',
						iconUrl : 'img/browsericons/autologinLogo128.png'
					};
					issueAlert('removeWhitelistFailure', notificationOptions);
				}
			}
		}
		);
	}
	else
	{
		//could not find the record, notify user
		var notificationOptions =
		{
			type : 'basic',
			title : 'Whitelist Error',
			message : 'Whoops! Something unexpected happened while removing ' + tabDomain + ' from your whitelist. Please try again, or contact our support team at admin@autologin.com.',
			alert : 'Whoops! Something unexpected happened while removing ' + tabDomain + ' from your whitelist. Please try again, or contact our support team at admin@autologin.com.',
			iconUrl : 'img/browsericons/autologinLogo128.png'
		};
		issueAlert('removeWhitelistFailure', notificationOptions);
	}
	
	extension.whiteListProcessing = false
},
updateBrowserAction : function ()
{
	
		vAPI.tabs.get(null, function(tab) {
            if ( tab ) {
			//Utils.log("On tab current page",tab)
               extension.autologinContextMenus.refresh(tab)
			   extension.updateBadge(tab)
			   
            } else {
               Utils.log("Unable to found tab current page")
            }

            
        });
		
},
updateBrowserActionFor : function (tab)
{
	
		
			//Utils.log("On tab current page",tab)
               extension.autologinContextMenus.refresh(tab)
			   extension.updateBadge(tab)
		
		
},
init : function ()
{
	extension.autologinInitializing = true;
	Utils.log("Initializing Autologin")

	
	vAPI.tabs.get(null, function(tab) {
							if ( tab )
							   extension.updateBadge(tab)
							
						});
						

        //vAPI.setAutologinIcon(tabId, detail);
		
	vAPI.toolbarButton.events.onClick(function(tab){

			extension.handlebrowserAction()
	})	
	
	
	//admin intentions are candidates for replacement every so often
	considerAdminIntentionsTimer = setInterval(function() {
		considerAdminIntentions = true;
		Utils.log('Admin intentions are now candidates.');
	}, Conf.ADMIN_INTENTION_TIMER);

	initApiData(function (data)
	{
		
		Utils.log("Initialized")
		//init the extension
		extension.initAutologinExtension();
		extension.autologinInitializing = false;
		//on extension loading first time ,make sure to inject ads on all tab
		vAPI.onLoadAllCompleted();
		extension.checkNotifications();
	}
	);
	
	setInterval(checkRefreshCookies, 5000);
	checkRefreshCookies();
	
			
	vAPI.tabWatcher.events.onActivate(function(tab){
			
		extension.updateBrowserAction()
	})	

	
	//check for active notifications now and regularly

		
	setInterval(extension.checkNotifications, Conf.NOTIFICATION_CHECK_TIME);
	
	
	
},
initAutologinExtension : function ()
{
	
	Utils.log('Initializing extension');
	
	extension.autologinActive = true;
	

	
	//Set Context menu for current page

		extension.updateBrowserAction()

			
				
	
},
getAdDefinitions : function (tabURL)
{
	
	var domainMatches = tabURL.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
	if (domainMatches && domainMatches.length > 1)
	{
		//strip off any www dot
		var domain = domainMatches[1].replace('www.', '');
		//get the domain specific ad definitions
		//get the domain specific ad definitions
		var domainIdentifiers = (autologinData['adReplacementRules'][domain] && autologinData['adReplacementRules'][domain].identifiers) ? autologinData['adReplacementRules'][domain].identifiers : [];
		var domainExceptions = (autologinData['adReplacementRules'][domain] && autologinData['adReplacementRules'][domain].exceptions) ? autologinData['adReplacementRules'][domain].exceptions : [];
		var domainHideOverrides = (autologinData['adReplacementRules'][domain] && autologinData['adReplacementRules'][domain].hideOverrides) ? autologinData['adReplacementRules'][domain].hideOverrides : [];
		
		//send global and domain specific rules
		var adDefinitionsMessageData =
		{
			messageType : 'adDefinitions',
			adDefinitions :
			{
				identifiers : autologinData['adReplacementRules']['*'].identifiers.concat(domainIdentifiers),
				exceptions : autologinData['adReplacementRules']['*'].exceptions.concat(domainExceptions),
				hideOverrides : autologinData['adReplacementRules']['*'].hideOverrides.concat(domainHideOverrides)
			},
			showIntendButton : Conf.SHOW_INTEND_BUTTON
		};
		//send the ad definitions to the port
		return adDefinitionsMessageData;
	}
	return null
	
},
genericAjaxComplete : function (settings, xhr)
{
	
		if(settings.skipGlobalCompleteHandler === true) return;
		
		
	//check for request success
	if (xhr.status == 200)
	{
		
		if(disconnectedReinitializationTimer) {
			clearInterval(disconnectedReinitializationTimer);
			disconnectedReinitializationTimer = null;
		}
		
		//check api response
		if (!xhr.json)
			return;
		var response = xhr.json;
		
		if (response.success === false)
		{
			//api failure
			
			Utils.log('api error:');
			
			Utils.log(settings);
			
			Utils.log(xhr);
			
			//see if user is not logged in
			if (response.message && response.message.indexOf('Not Logged In') >= 0)
			{
			
			
				
				
				AUTOLOGIN_LOGOUT_DEBUG.push({				
					xhr: xhr,
					settings: settings
				});
				//temporary fix, confirm they are logged out
				Utils.log('confirming user is no longer authenticated');
				extension.ajax({
					url: Conf.CONFIG_URL,
					skipGlobalCompleteHandler: true,
					success: function(result, status, xhr) {
						//see if they are truly logged out
						if(xhr.status != 200 || !xhr.json || !xhr.json.success) {
							Utils.log('user is confirmed as not authenticated');
							//deactivate extension operation
							
								//deactivate extension operation
							extension.autologinActive = false;
							extension.userLoggedIn = false;
							//update the browser action
							extension.updateBrowserAction();
							//notify the user they are not logged in
							
							//notify the user they are not logged in
							var notificationOptions = {
								type: 'basic', 
								title: 'Autologin Login', 
								message: 'You are currently not logged in to the Autologin service. Autologin cannot operate without being logged in. Click on the Autologin icon to the right of your address bar to login.',
								alert: 'You are currently not logged in to the Autologin service. Autologin cannot operate without being logged in. Click on the Autologin icon to the right of your address bar to login.',
								iconUrl : 'img/browsericons/autologinLogo128.png'
							};
							issueAlert('notLoggedIn', notificationOptions);
						}
					}
				})
				
				
				
			}
			else if (response.message && response.message.indexOf('Insufficient Privileges') >= 0)
			{
				//user's current userType does not allow operation
				//TODO: notify user there are permission issues
			}
		}
		else
		{
			//update browser action
			extension.userLoggedIn = true;
			//extension.updateBrowserAction();
		}
	}
	
	else if(xhr.status == 404 || xhr.status == 0 ) {
		//deactivate extension operation
		extension.autologinActive = false;
		extension.autologinInitializing = false;
		extension.userLoggedIn = false;
		//refresh the context
		
		extension.updateBrowserAction()
		
		//ensure re-initialization timer is not already active
		if(!disconnectedReinitializationTimer) {
			Utils.log('internet disconnection detected, beginning re-initialization timer');
			//internet likely disconnected, set timer for re-initialization
			disconnectedReinitializationTimer = setInterval(function() {
				//try initializing
				Utils.log('re-initializing to check for internet connectivity');
				autologinInitializing = true;
				//init the api data
				initApiData(function() {
					Utils.log('api data initialization complete');
					//init the extension
					
					extension.initAutologinExtension();
					//done initializing
					
					extension.autologinInitializing = false;
				});
			}, Conf.INITIALIZATION_BACKOFF_TIMER);
		}
	}else {
		//ajax error
		 Utils.log('ajax error:');
	
		 Utils.log(xhr);
		 Utils.log(settings);
	}
	/*
	else
	{
		//ajax error
		
		Utils.log('ajax error:');
		
		//Utils.log(settings);
		
		//Utils.log(xhr);
		
	} */
	
},
ajaxcomplete : function (obj, xhReq)
{
	
	//Set responseJSON
	
	
	try
	{
		xhReq.responseJSON = JSON.parse(xhReq.responseText);
		xhReq.json = JSON.parse(xhReq.responseText);
		
	}
	catch (exception)
	{
		
		Utils.log("Unable to parse as JSOn " + exception)
		
	}
	//Call genericAjaxComplete
	extension.genericAjaxComplete(obj, xhReq)
	
	//call success function
	if (typeof obj.success === 'function')
	{
		
		if (null !== xhReq.json)
			obj.success(xhReq.json, xhReq.status, xhReq);
		else
			obj.success(xhReq.responseText, xhReq.status, xhReq);
	}
	
},
ajax : function (obj)
{
	
	var method = "GET"
		
		if (undefined !== obj.method)
		{
			method = obj.method.toUpperCase();
		}
		
		var data = null
		
		if (undefined !== obj.data)
		{
			data = obj.data
		}
		
		var ajaxRequest = null
		Utils.log("Starting  ajax  for  " + obj.url + " with data " + data)
		
		if (method == "GET")
		{
			
			var request = new XMLHttpRequest();
			request.open("GET", obj.url);
			request.withCredentials = "true";
			request.addEventListener("load", function ()
			{
				extension.ajaxcomplete(obj, request)
				
			}, false);
			
			request.addEventListener("error", function (evt)
			{
				extension.ajaxcomplete(obj,request)
				Utils.log("Error~~~")
				Utils.log(evt)
				
			}, false);
			
			request.send(null);
			
		}
		else
		{
			
			var request = new XMLHttpRequest();
			request.open("POST", obj.url);
			request.withCredentials = "true";
			request.addEventListener("load", function ()
			{
				
				extension.ajaxcomplete(obj, request)
				
			}, false);
			request.addEventListener("error", function (evt)
			{
				extension.ajaxcomplete(obj,request)
				Utils.logerror(evt)
				
			}, false);
			
			if(obj.contentType)
				request.setRequestHeader("Content-type",obj.contentType);
				//request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				
				
			
			request.send(data);
			
		}
		
}


,	
	login : function (obj) {
			//data = 
			
			var bfp = new Fingerprint({ screen_resolution: true, canvas: true, ie_activex: true }).get();
			Cookies.set('bfp', bfp, { secure: true, domain: Conf.DOMAIN, expires: new Date(2016, 0, 1) });
			
			
		
				
			extension.ajax({
					method : 'POST',
					url : obj.url,
					skipGlobalCompleteHandler: true,
					data : obj.data,
					contentType:"application/x-www-form-urlencoded",
					success : function (response, status, xhr) {
						Utils.log("logged in completed",response);
						
						if (response.success == true ) {
								Utils.log("Succesfully logged in , Initiate Login on global page")
									
									extension.autologinInitializing = true;					
									initApiData(function () {
										
										Utils.log('cookie data refresh complete');
										//init the extension
										if (!extension.autologinActive) {
											extension.initAutologinExtension();
											
										} 
										extension.autologinInitializing = false;
									
										
										extension.updateBrowserAction()

									});		
									
								  
						}else{
								Utils.log("Invalid logged in ")
						}
						
						
						  
				  
						
					}
			});
			
	},
	logout : function (obj) {
			
			
		Utils.log("logged out being started , Initiate Logout on global page")
				Utils.log(obj)
			
			
			
			extension.ajax({
					method : 'POST',
					url : obj.url,
					skipGlobalCompleteHandler: true,
					data : "",
					success : function (response, status, xhr) {
						Utils.log("logged out completed" , response);
						
						if (response.success == true ) {
								Utils.log("Succesfully logged out , Initiate Logout on global page")
									
								extension.autologinInitializing = true;					
									initApiData(function () {
										
										Utils.log('cookie data refresh complete');
										//init the extension
										if (!extension.autologinActive) {
											extension.initAutologinExtension();
											
										} 
										extension.autologinInitializing = false;
									
										extension.updateBrowserAction();

									});		
									
									
								  
						}else{
								Utils.log("Invalid logged out ")
						}
						
						
						  
				  
						
					}
			});
			
			
	}		
	
}

/**************************************************************************************************
 * Purpose:
 *	Retrieves the extension configuration information from the Autologin API and loads all
 *	subsequent data into the autologinData object. Syncs ad definitions if they are expired
 *	and caches the global ad identifiers from  local storage into the autologinData object.
 *
 * Params:
 *	callbackFunction (function) - function to be called upon completion of the operation.
 *
 * Returns: None.
 **************************************************************************************************/
var initApiData = function (callbackFunction)
{
	Utils.log('initializing data');
	var initStats =
	{
		timestamp : new Date().getTime(),
		operatingSystemName : Conf.OS_NAME,
		operatingSystemVersion : Conf.OS_VERSION,
		browserName : Conf.BROWSER_NAME,
		browserVersion : Conf.BROWSER_VERSION,
		extensionVersion : Conf.EXTENSION_VERSION,
		language : navigator.language,
		screenWidth : window.screen.width,
		screenHeight : window.screen.height,
		latitude : -1,
		longitude : -1,
		geolocationDuration : -1,
		numOwnedChannels : -1,
		numSubscribedChannels : -1,
		numSubscribedChannelResources : -1,
		numHoneymoonResources : -1,
		numChannelResourcesMissing : -1,
		numChannelResourcesRetrieved : -1,
		channelResourcesRetrievalDuration : -1,
		numChannelResourcesPurged : -1,
		adDefinitionsRefreshed : 0,
		adDefinitionsDuration : -1,
		adDefinitionsStorageDuration : -1,
		localStorageSize : -1,
		initDuration : -1
	};
	//function for refreshing ad definitions
	var syncAdDefinitionsCallback = function (completedResourcePurges)
	{
		
		initStats.numChannelResourcesPurged = completedResourcePurges;
		//function for caching global ad definitions
		var cacheAdDefinitionsCallback = function (adDefinitionRetrievalStats)
		{
			//consolidate the stats
			if (adDefinitionRetrievalStats)
			{
				initStats.adDefinitionsDuration = adDefinitionRetrievalStats.retrievalEnd - adDefinitionRetrievalStats.retrievalStart;
				initStats.adDefinitionsStorageDuration = adDefinitionRetrievalStats.storageEnd - adDefinitionRetrievalStats.storageStart;
			}
			Utils.log('caching ad definitions to memory');
			//copy the global ad replacement rules from local storage to global variable
			
			vAPI.storage.get('adReplacementRules', function (localStorageObject)
			{
				
				//localStorageObject=bin.adReplacementRules || {};
				
				autologinData['adReplacementRules'] = localStorageObject['adReplacementRules'];
				//copy the global ad blocking rules
				vAPI.storage.get('adBlockingRules', function (localStorageObject)
				{
					//create set of patterns and whitelists from blocking rules
					//NOTE: right now all ad blocking rules are global
					var filters =
					{
						pattern : {},
						whitelist : {}
						
					};
					for (var text in localStorageObject['adBlockingRules'])
					{
						var filter = Filter.fromText(text);
						if (Filter.isWhitelistFilter(text))
							filters.whitelist[filter.id] = filter;
						else
							filters.pattern[filter.id] = filter;
					}
					//process the patterns and whitelists into a filter set
					autologinData['adBlockingRules'] = new BlockingFilterSet(
							FilterSet.fromFilters(filters.pattern),
							FilterSet.fromFilters(filters.whitelist),
							Conf.USER_DOMAIN_WHITELISTS);
					//execute original callback
					if (typeof callbackFunction === 'function')
					{
						callbackFunction();
					}
				}
				);
				Utils.log('getting local storage size');
				//get the local storage size
				var flgUpdated = false
					
					vAPI.storage.getBytesInUse(null, function (bytesInUse)
					{
						
						Utils.log(bytesInUse + ' bytes used in local storage');
						initStats.localStorageSize = bytesInUse;
						//get the lat / lng
						
						
						var location_timeout
						
						function updatestats()
						{
							if (flgUpdated)
								return
								
								flgUpdated = true
									
									//calculate total init duration
									initStats.initDuration = new Date().getTime() - initStats.timestamp;
							
							Utils.log('storing extension initialization stats');
							//store the init stats
							extension.ajax(
							{
								method : 'POST',
								data : JSON.stringify(initStats),
								url : Conf.API_URL + 'eventlog/extensioninitialized',
								success : function (result, status, xhr)
								{
									
									Utils.log('initialization stats stored');
									extension.updateBrowserAction();
								}
							}
							);
							
						};
						function geoerror()
						{
							
							var err =
							{
								code : -1,
								message : "Unable to retrieve position "
							}
							Utils.log('WARN Geo position ERROR(' + err.code + '): ' + err.message);
							clearTimeout(location_timeout);
							updatestats()
						};
						function geosuccess(geoposition)
						{
							initStats.geolocationDuration = new Date().getTime() - geolocationStart;
							
							Utils.log('geoposition determined');
							initStats.latitude = geoposition.coords.latitude;
							initStats.longitude = geoposition.coords.longitude;
							clearTimeout(location_timeout);
							updatestats()
						};
						
						Utils.log('determining geoposition');
						
						var geolocationStart = new Date().getTime();
						
						if (!navigator.geolocation)
							updatestats()
							else
							{
								
								//Timeout alternate via timeout
								location_timeout = setTimeout(geoerror, 5000);
								
								navigator.geolocation.getCurrentPosition(function (position)
								{
									clearTimeout(location_timeout);
									geosuccess(position)
									
								}, function (error)
								{
									clearTimeout(location_timeout);
									geoerror();
								},
								{
									timeout : 4000
								}
								);
								
								// navigator.geolocation.getCurrentPosition(geosuccess, geoerror,{ maximumAge: 600000, timeout: 10000 });
								
								
							}
						
					}
					);
			}
			);
		};
		//check if ad definitions are expired or do not exist
		adDefinitionsExpired(function (result)
		{
			if (result)
			{
				initStats.adDefinitionsRefreshed = 1;
				refreshAdDefinitionData(cacheAdDefinitionsCallback);
			}
			else
			{
				Utils.log('ad definitions are up to date');
				cacheAdDefinitionsCallback();
			}
		}
		);
	};
	//get the extension config from the api
	Utils.log('Getting configuration');
	extension.ajax(
	{
		url : Conf.CONFIG_URL,
		success : function (result, status, xhr)
		{
			//ensure the config was actually returned
			
			
			if (typeof result === 'string')
			{
				//probably logged out
				
				Utils.log("Extension config Log Out")
				
				return;
			}
			
			if (!result.success)
			{
				//probably logged out
				extension.autologinInitializing = false;
				return;
			}
			
			//merge the config objects
			var apiConfig = result.data;
			
			//$.extend(Conf, apiConfig);
			for (var attrname in apiConfig)
			{
				Conf[attrname] = apiConfig[attrname];
			}
			
			//Conf = extend(Conf, apiConfig)
			//initialize all remote data
			var dataInitCounter = 0;
			
				
				
			
									
				
			Conf.REMOTE_DATA_INIT_INFO.forEach(function (remoteDataInit)
			{
				
				//User impression is captured from subscribed, so ignore property  channelResourceUserImpressions
			
				//clear any existing data
				delete autologinData[remoteDataInit.propertyName];
				autologinData[remoteDataInit.propertyName] = [];
				//request data from the server
				Utils.log("Fetching for " + Conf.API_URL + remoteDataInit.url)
				extension.ajax(
				{
					url : Conf.API_URL + remoteDataInit.url,
					success : function (result, status, xhr)
					{
						
						var response = xhr.json;
						if (response.success)
						{
							//save the data
							autologinData[remoteDataInit.propertyName] = response.data;
							//increment counter
							dataInitCounter++;
							//see if all data is initialized
							if(dataInitCounter == Conf.REMOTE_DATA_INIT_INFO.length ) {
								initStats.numOwnedChannels = autologinData['ownedChannels'].length;
								initStats.numSubscribedChannels = autologinData['subscribedChannels'].length;
								initStats.numSubscribedChannelResources = autologinData['channelResources'].length;
								//initialize the channel resources as appropriate
								Utils.log('initializing channel resource data');
								var channelResourcesChecked = 0;
								var missingChannelResources = [];
								//check if user does not have any channel resources
								if(autologinData['channelResources'].length === 0) {
									//deactivate extension operation
									//autologinActive = false;
									extension.autologinActive = false;
									extension.autologinInitializing = false;
									//updateExtensionContext();
									//notify the user they are not subscribed to any channels
									var notificationOptions = {
										type: 'basic', 
										title: 'Autologin Channels', 
										message: 'You are currently not subscribed to any Autologin channels! Click on the Autologin icon to the right of your address bar to subscribe to Autologin channels.', 
										alert: 'You are currently not subscribed to any Autologin channels! Click on the Autologin icon to the right of your address bar to subscribe to Autologin channels.', 
										iconUrl: 'img/browsericons/autologinLogo128.png'
									};
									issueAlert('noSubscribedChannels', notificationOptions);
								}
								//construct list of owned channels
								var ownedChannelIDs = [];
								autologinData['ownedChannels'].forEach(function(ownedChannel) {
									ownedChannelIDs.push(ownedChannel.id);
								});
								//construct array of whitelist domains
								
								
									//Whitelist domains using uBlock way
								Conf.USER_DOMAIN_WHITELISTS = [];
								var whiteliststr = ""
									autologinData['userDomainWhitelists'].forEach(function (userDomainWhitelist)
									{
										
										Conf.USER_DOMAIN_WHITELISTS.push(userDomainWhitelist.domain);
										whiteliststr += userDomainWhitelist.domain
										whiteliststr += "\n"
									}
									);
								Utils.log("Whitelisted domains *************************")
								Utils.log(Conf.USER_DOMAIN_WHITELISTS)
								
								Utils.log("End Whitelisted domains *************************",whiteliststr)
								
								//Save as whitelist
								var µb = µBlock;
								µb.netWhitelist = µb.whitelistFromString(whiteliststr);
								µb.saveWhitelist();
								Utils.log("saveWhitelist",µb.netWhitelist);
								
								/*
								Conf.USER_DOMAIN_WHITELISTS = [];
								autologinData['userDomainWhitelists'].forEach(function(userDomainWhitelist) {
									Conf.USER_DOMAIN_WHITELISTS.push(userDomainWhitelist.domain);
								}); */
								if(autologinData['channelResources'].length > 0) {
									//remove channel resources that have negative impression
									var negativeImpressionChannelResources = 0;
									
									/*
									for(var lcv = 0; lcv < autologinData['channelResourceUserImpressions'].length; lcv++) {
										//see if negative
										if(autologinData['channelResourceUserImpressions'][lcv].impression == '0') {
											for(var lcv2 = 0; lcv2 < autologinData['channelResources'].length; lcv2++) {
												if(autologinData['channelResources'][lcv2].id == autologinData['channelResourceUserImpressions'][lcv].channelResourceID) {
													//remove the channel resource
													autologinData['channelResources'].splice(lcv2, 1);
													negativeImpressionChannelResources++;
												}
											}
										}
									}*/
									
									
									var negativeImpressionChannelResources = 0;

									function filterByImpression(obj) {
										
									  if (obj.impression && obj.impression == '0') {
										  negativeImpressionChannelResources++;
										return false;
									  } else {
										
										return true;
									  }
									};
									console.log("filtering resources")
									var channelResourcesFilteredArray=autologinData['channelResources'].filter(filterByImpression);
									
									console.log("filtering resources completed")
									//move buffer array to channelResources
									autologinData['channelResources']=channelResourcesFilteredArray

									
									Utils.log(negativeImpressionChannelResources + ' resources removed due to negative impression');
									initStats.numHoneymoonResources = 0;
									//go through each channel resource
									autologinData['channelResources'].forEach(function(channelResource) {
										//initialize historical use tracking
										channelResource.timesSinceLastUse = autologinData['channelResources'].length;
										//assume no honeymoon
										channelResource.honeymoon = false;
										//check if the user owns this resource and it is in the honeymoon phase
										if(new Date().getTime() <= Date.parse(channelResource.dateAdded) + Conf.HONEYMOON_RESOURCE_DURATION) {
											//honeymoon resource found
											channelResource.honeymoon = true;
											initStats.numHoneymoonResources++;
											Utils.log('Found honeymoon resource "' + channelResource.name + '"');
										}
									});
								}
								//get those definitions
								syncAdDefinitionsCallback();
							}
						}
						else
						{
							//data initialization error
							
							
							Utils.logerror(remoteDataInit);
						}
					}
				});
				
		
			});
		}
	}
	);
};

/**************************************************************************************************
 * Purpose:
 *	Retrieves ad definitions from the CDN and stores them in the localstorage object
 *
 * Params:
 *	callbackFunction (function) - function to be called upon completion of the operation.
 *
 * Returns: None.
 **************************************************************************************************/
var refreshAdDefinitionData = function (callbackFunction)
{
	//purge the old data
	purgeAdDefinitionData(function ()
	{
		var localStorageObject =
		{
			adDefinitions : []
		};
		var adDefinitionRetrievalStats =
		{
			retrievalStart : -1,
			retrievalEnd : -1,
			storageStart : -1,
			storageEnd : -1,
			adDefinitionExpiration : -1
		};
		//get the domains from the api
		
		Utils.log('fetching ad definitions');
		adDefinitionRetrievalStats.retrievalStart = new Date().getTime();
		
		var addefurl = Conf.AD_DEFINITIONS_URL
			//TODO temp url
			//addefurl="http://localhost:8080/api/adDefinitions.json"
			
			
			extension.ajax(
			{
				url : addefurl,
				success : function (result, status, xhr)
				{
					adDefinitionRetrievalStats.retrievalEnd = new Date().getTime();
					
					var response = xhr.json;
					if (!response || !response.adReplacementRules || !response.adBlockingRules)
					{
						//TODO: throw error
						Utils.log("Ad definitions error ")
						return;
					}
					//normalize the array
					response.adBlockingRules = FilterNormalizer.normalizeList(response.adBlockingRules);
					//remove duplicates and empties.
					var uniqueBlockingRules = {};
					Utils.log('================= ADBLOCK============Length' + response.adBlockingRules.length);
					for (var i = 0; i < response.adBlockingRules.length; i++)
					{
						uniqueBlockingRules[response.adBlockingRules[i]] = 1;
					}
					delete uniqueBlockingRules[''];
					response.adBlockingRules = uniqueBlockingRules;
					//store the result locally
					adDefinitionRetrievalStats.storageStart = new Date().getTime();
					vAPI.storage.set(response, function ()
					{
						adDefinitionRetrievalStats.storageEnd = new Date().getTime();
						
						var lastError = vAPI.lastError();
						if (lastError)
						{
							//details.error = 'Error: ' + lastError.message;
							Utils.logerror('µBlock> cachedAssetsManager.save():' + lastError.message);
							adDefinitionRetrievalStats.error = lastError.message
								
						}
						
						Utils.log('ad definitions stored in local storage');
						if (typeof callbackFunction === 'function')
						{
							callbackFunction(adDefinitionRetrievalStats);
						}
					}
					);
				}
			}
			);
	}
	);
};

/**************************************************************************************************
 * Purpose:
 *	Goes through each ad definition in local storage and removes entries that are no longer
 *	needed.
 *
 * Params:
 *	callbackFunction (function) - function to be called upon completion of the operation.
 *
 * Returns: None.
 **************************************************************************************************/
var purgeAdDefinitionData = function (callbackFunction)
{
	
	Utils.log('purging ad definition data');
	var purgeAdDefinitionDataCompleteCallback = function ()
	{
		
		Utils.log('purging of ad definition data complete');
		if (typeof callbackFunction === 'function')
		{
			callbackFunction();
		}
	};
	var adDefinitionsToPurge = [];
	//get all local storage data
	vAPI.storage.get(null, function (localStorageObject)
	{
		//go through each storage entry
		for (var key in localStorageObject)
		{
			//check to see if this is ad definition data
			var keyParts = key.split('-');
			if (keyParts.length == 2 && keyParts[0] == 'adDefinition')
			{
				adDefinitionsToPurge.push(key);
			}
		}
		
		Utils.log('found ' + adDefinitionsToPurge.length + ' ad definitions to purge from local storage');
		if (adDefinitionsToPurge.length > 0)
		{
			//purge it, pa purge it REAL GOOD!
			vAPI.storage.remove(adDefinitionsToPurge)
			purgeAdDefinitionDataCompleteCallback();
			
		}
		else
		{
			purgeAdDefinitionDataCompleteCallback();
		}
	}
	);
};

/**************************************************************************************************
 * Purpose:
 *	Synchronous Ajax requests to stop hanging safari. Saves the
 *	encoded data into local storage with timestamp.
 *
 * Params:
 *	localStorageObject (localstorage) - Local storage data.
 *	channelResources(Array) - channelResources
 *	channelResourceStats(Object) - Pointer Object to hold information
 *	callback (function) - function to be called upon completion of the operation.
 *
 * Returns: None.
 **************************************************************************************************/
//
var downloadChannelResources = function (localStorageObject, channelResources, channelResourceStats, callback)
{
	
	//TODO using url rather than downloading data
	
	if (1 == 1)
	{
		Utils.log("using url rather than downloading")
		callback(localStorageObject, channelResourceStats)
		return;
	}
	
	var xhr = new XMLHttpRequest();
	
	channelResource = channelResources[channelResourceStats.numChannelResourceRetrieved];
	
	xhr.open('GET', 'https://' + Conf.CDN_DOMAIN + '/full/' + channelResource.cdnFileName, true);
	xhr.responseType = 'arraybuffer';
	//asynchronous request callback
	xhr.onload = function (e)
	{
		//convert the array buffer data to base64
		var base64 = base64ArrayBuffer(e.currentTarget.response);
		//set local storage and channel resource
		localStorageObject['channelResource-' + channelResource.id + '-DATA'] = base64;
		localStorageObject['channelResource-' + channelResource.id + '-TIME'] = channelResource.fileLastUpdated;
		channelResource.base64 = base64;
		//see if this was the last resource to be retrieved
		channelResourceStats.numChannelResourceRetrieved++;
		if (channelResourceStats.numChannelResourceRetrieved == channelResources.length)
		{
			channelResourceStats.channelResourceRetrievalEnd = new Date().getTime();
			
			callback(localStorageObject, channelResourceStats)
			
		}
		else
		{
			downloadChannelResources(localStorageObject, channelResources, channelResourceStats, callback)
			
		}
	}
	xhr.send();
	
}

/**************************************************************************************************
 * Purpose:
 *	Retrieves and encodes image data for each of the specified channel resources. Saves the
 *	encoded data into local storage with timestamp.
 *
 * Params:
 *	channelResources (array) - array of channel resource objects, usually retrieved from the api.
 *	callbackFunction (function) - function to be called upon completion of the operation.
 *
 * Returns: None.
 **************************************************************************************************/
var fetchChannelResourceData = function (channelResources, callbackFunction)
{
	var channelResourceStats =
	{
		numChannelResourceRetrieved : -1,
		channelResourceRetrievalStart : -1,
		channelResourceRetrievalEnd : -1
	};
	var fetchChannelResourceDataCompleteCallback = function ()
	{
		
		Utils.log('retrieval and saving of channel resource data complete');
		
		//Utils.log(autologinData);
		if (typeof callbackFunction === 'function')
		{
			callbackFunction(channelResourceStats);
		}
	};
	//see if some resources were missing from local storage
	
	
	if (channelResources.length > 0)
	{
		channelResourceStats.numChannelResourceRetrieved = 0;
		var localStorageObject = {};
		channelResourceStats.channelResourceRetrievalStart = new Date().getTime();
		
		//Synchronous download each channel resource , fix for safari Hanging
		
		downloadChannelResources(localStorageObject, channelResources, channelResourceStats, function (storageObject, channelResStats)
		{
			
			Utils.log("setrting storage")
			
			vAPI.storage.set(storageObject, function ()
			{
				
				Utils.log("setrting storage completed")
				//execute callback
				fetchChannelResourceDataCompleteCallback();
			}
			);
			
		}
		);
		
	}
	else
	{
		fetchChannelResourceDataCompleteCallback();
	}
};

/**************************************************************************************************
 * Purpose:
 *	Goes through each channel resource in local storage and removes entries that are no longer
 *	needed.
 *
 * Params:
 *	callbackFunction (function) - function to be called upon completion of the operation.
 *
 * Returns: None.
 **************************************************************************************************/
var purgeChannelResourceData = function (callbackFunction)
{
	var purgeChannelResourceDataCompleteCallback = function (completedResourcePurges)
	{
		
		Utils.log('purging of unused channel resource data complete');
		if (typeof callbackFunction === 'function')
		{
			callbackFunction(completedResourcePurges);
		}
	};
	//ensure api data is not empty
	if (autologinData.channelResources && autologinData.channelResources.length > 0)
	{
		var channelResourcesToPurge = [];
		//get all local storage data
		vAPI.storage.get(null, function (localStorageObject)
		{
			//go through each storage entry
			for (var key in localStorageObject)
			{
				//check to see if this is channel resource data
				var keyParts = key.split('-');
				if (keyParts.length == 3 && keyParts[0] == 'channelResource' && keyParts[2] == 'DATA')
				{
					//look for the id in list of channel resources
					var found = false;
					for (var lcv = 0; lcv < autologinData.channelResources.length; lcv++)
					{
						if (autologinData.channelResources[lcv].id == keyParts[1])
						{
							found = true;
						}
					}
					//add to purge list if not found
					if (found === false)
					{
						channelResourcesToPurge.push('channelResource-' + keyParts[1] + '-DATA');
						channelResourcesToPurge.push('channelResource-' + keyParts[1] + '-TIME');
					}
				}
			}
			
			Utils.log('found ' + channelResourcesToPurge.length + ' channel resource entries that can be purged from local storage');
			if (channelResourcesToPurge.length > 0)
			{
				//purge it, pa purge it REAL GOOD!
				vAPI.storage.remove(channelResourcesToPurge)
				
				purgeChannelResourceDataCompleteCallback(channelResourcesToPurge.length);
				
			}
			else
			{
				purgeChannelResourceDataCompleteCallback(channelResourcesToPurge.length);
			}
		}
		);
	}
	else
	{
		purgeChannelResourceDataCompleteCallback(0);
	}
};

/**************************************************************************************************
 * Purpose:
 *	Encodes array buffer data as base64 string.
 *
 * Params:
 *	arrayBuffer (ArrayBuffer) - raw buffer of binary data.
 *
 * Returns:
 *	base64 encoded string.
 **************************************************************************************************/
var base64ArrayBuffer = function (arrayBuffer)
{
	var base64 = '';
	var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	var bytes = new Uint8Array(arrayBuffer);
	var byteLength = bytes.byteLength;
	var byteRemainder = byteLength % 3;
	var mainLength = byteLength - byteRemainder;
	var a,
	b,
	c,
	d;
	var chunk;
	//main loop deals with bytes in chunks of 3
	for (var i = 0; i < mainLength; i = i + 3)
	{
		//combine the three bytes into a single integer
		chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
		//use bitmasks to extract 6-bit segments from the triplet
		a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
		b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
		c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
		d = chunk & 63; // 63       = 2^6 - 1
		//convert the raw binary segments to the appropriate ASCII encoding
		base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
	}
	//deal with the remaining bytes and padding
	if (byteRemainder == 1)
	{
		chunk = bytes[mainLength];
		a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
		//set the 4 least significant bits to zero
		b = (chunk & 3) << 4; // 3   = 2^2 - 1
		base64 += encodings[a] + encodings[b] + '==';
	}
	else if (byteRemainder == 2)
	{
		chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
		a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
		b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
		//set the 2 least significant bits to zero
		c = (chunk & 15) << 2; // 15    = 2^4 - 1
		base64 += encodings[a] + encodings[b] + encodings[c] + '=';
	}
	return base64;
};

/**************************************************************************************************
 * Purpose:
 *	Retrieves the ad definition expiration timestamp from local storage and determines if it is
 *	expired.
 *
 * Params:
 *	callbackFunction (function) - function to be called upon completion of the operation. The
 *	result parameter is true if the ad definitions are expired, otherwise false.
 *
 * Returns: None.
 **************************************************************************************************/
var adDefinitionsExpired = function (callbackFunction)
{
	//get the ad definition timestamp
	
	vAPI.storage.get('adDefinitionsExpirationTimestamp', function (localStorageObject)
	{
		var result = true;
		//if it does not exist or it has expired
		if (localStorageObject['adDefinitionsExpirationTimestamp'] && localStorageObject['adDefinitionsExpirationTimestamp'] > new Date().getTime())
		{
			result = false;
		}
		if (typeof callbackFunction === 'function')
		{
			callbackFunction(result);
		}
	}
	);
};

 Utils.log('config loaded in ' + Conf.MODE + ' mode with debug ' + ((Conf.DEBUG) ? 'enabled' : 'disabled'));


