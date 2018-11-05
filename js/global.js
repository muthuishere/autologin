var globalAutologinHandler = {
	doc: null ,
	initialized: false,
	autologinList: null,
	autologinXMLList: null,
	autologinsites: [],
	lastloggedInDomain: null,
	lastloggedInTimeinMilliseconds: 0,
	poolingDomains: new Array(),
	loggedIn: true,
	addAutoLoginElements: function(obj, authtype) {
			// Find user
			// Set Pooling domains

			var curdomainName = vAPI.getdomainName(obj.url)
			globalAutologinHandler.pushtoPool(curdomainName)

			var elems = obj.elements
			var indices = []

			var invalidxpaths = [];
			var hasParentXpath = false
			var hasValidElems = false

			for (index = 0, len = elems.length; index < len; ++index) {
				var field = elems[index]
				if (field.type === "password" && field.value == "" &&  "" != field.parentxpath ) {
						invalidxpaths.push(field.parentxpath)
				}

				if (field.type === "password" && field.value != "") {
					hasValidElems=true
					if ("" != field.parentxpath)
						hasParentXpath=true
				}
			}

			if (!hasValidElems) {
				//console.log("Invalid Elements , Cannot add")
				return
			}

			////console.log("invalidxpaths",invalidxpaths)
			for (i = 0, xlen = invalidxpaths.length; i < xlen; ++i) {
				var invalidxpath = invalidxpaths[i]

				for (index = 0, len = elems.length; index < len; ++index) {
						var field=elems[index]

						if (field.parentxpath === invalidxpath || field.xpath === invalidxpath) {
								indices.push(index)
						} else if (hasParentXpath && field.type !== "form" && "" == field.parentxpath)
								indices.push(index)
				}
			}

			var username = ""
			var tmpusername = ""
			var captureelems = []
			for (index = 0, len = elems.length; index < len; ++index) {
					if (indices.indexOf(index)  == -1) {
							var field = elems[index]
							captureelems.push(field)

							if (field.type == "text") {
								if (field.value != "" && (field.xpath.toLowerCase().indexOf("user") >= 0 ||  field.xpath.toLowerCase().indexOf("email") >= 0 || field.xpath.toLowerCase().indexOf("login") >= 0 || field.xpath.toLowerCase().indexOf("signin") >= 0 || field.xpath.toLowerCase().indexOf("name") >= 0)) {
									username = field.value
									////console.log("username",username,field.xpath)
								}

							tmpusername= field.value
						 }
					}
			}

			if (username == "")
				username = tmpusername

			obj.user = username
			obj.authtype = authtype
			obj.elements = captureelems

			//checkuser already exists , if yes update

						storage.add(obj)
	},
	updateBasicAuthHandlers: function(usebasicauth) {
			if (usebasicauth) {
				vAPI.onAuthRequired.addListener(globalAutologinHandler.retrieveautologinsites)
			} else {
					vAPI.onAuthRequired.removeListener(globalAutologinHandler.retrieveautologinsites)
			}
	},
  startsWith: function(data,str) {
      return !data.indexOf(str);
  },
	pushtoPool: function(curdomainName) {
			var index = globalAutologinHandler.poolingDomains.indexOf(curdomainName);
			if (index > -1) {
				//console.log ("removing existing domain" + curdomainName)
				globalAutologinHandler.poolingDomains.splice(index, 1);
			}

		 globalAutologinHandler.poolingDomains.push(curdomainName)
		 var MAX_ALLOWED_TIME_DIFFERENCE= 15 * 60 *1000

		 setTimeout(function() {
			 var index = globalAutologinHandler.poolingDomains.indexOf(curdomainName);
				if (index > -1) {
					//console.log ("removing domain" + curdomainName)
					globalAutologinHandler.poolingDomains.splice(index, 1);
				}
		 }, MAX_ALLOWED_TIME_DIFFERENCE)

	},
  canSubmit: function(curlocation) {
		  var curdomainName = vAPI.getdomainName(curlocation)

		  if (globalAutologinHandler.poolingDomains.indexOf(curdomainName) > -1) {
			  ////console.log("Dont allow" + curdomainName)
			  return false
		  }

		  return true
  },
  updateSuccessLogin: function(curlocation) {
  var curdomainName=vAPI.getdomainName(curlocation)
  var curTimeinMs=Date.now()
  globalAutologinHandler.pushtoPool(curdomainName)
  //globalAutologinHandler.lastloggedInDomain=curdomainName
  //globalAutologinHandler.lastloggedInTimeinMilliseconds=curTimeinMs;

  ////console.log("Updating Success Login for domain" + globalAutologinHandler.lastloggedInDomain + " at time" + globalAutologinHandler.lastloggedInTimeinMilliseconds)


  },
  removefromPool: function(curlocation) {
  		var curdomainName = vAPI.getdomainName(curlocation)
  		var index = globalAutologinHandler.poolingDomains.indexOf(curdomainName);

			if (index > -1) {
				////console.log ("removing from pool" + curdomainName)
				globalAutologinHandler.poolingDomains.splice(index, 1);
			}
  },
	retrieveSiteInfo: function(curlocation) {
	   var result = {}
	   result.status = 1;
	   result.info = null;

	   var curdomainName = vAPI.getdomainName(curlocation)
		 var site = storage.get("form",curdomainName)
		 if (site == null)
				return result;

		var flgAutologinEnabled = site.enabled;
		result.info = site;

		if (flgAutologinEnabled == true && globalAutologinHandler.poolingDomains.indexOf(curdomainName) == -1 ) {
			result.status = 0;

			return result;
		}

		if (globalAutologinHandler.poolingDomains.indexOf(curdomainName) != -1) {
			//console.log("Blacklisted domain" + curdomainName)
			result.status=-1;
			//return result;
		}

		if (flgAutologinEnabled == false) {
			//console.log("Disabled domain" + curdomainName)
			result.status=-1;
			//return result;
		}

		return result;
  },
	logmessage: function(aMessage) {

	},
	removeSite: function(autologinRawXML) {
			var parser = new DOMParser();
			var autologinObject = parser.parseFromString(autologinRawXML, "text/xml");

			return globalAutologinHandler.removeSiteObject(autologinObject)
	},
	removeSiteObject: function(autologinObject) {
			var currentURL = globalAutologinHandler.getXMLElementval(autologinObject,"loginurl")
			authtype = autologinObject.getElementsByTagName("site")[0].getAttribute("authtype")

			try {
				var divs = globalAutologinHandler.autologinXMLList.getElementsByTagName("site"), i = divs.length;

				if (i == 0)
					return false;

				while (i--) {
						iurl = globalAutologinHandler.getXMLElementval(divs[i],"loginurl");

						if (vAPI.getdomainName(currentURL) == vAPI.getdomainName(iurl) && authtype == divs[i].getAttribute("authtype")) {
								// Remove site
							  divs[i].parentNode.removeChild(divs[i]);

							  return true;
						}
				}
		 	} catch(exception) {}

			return false;
	},
	getXMLElementval: function(node,elemName) {
			try {
				val = node.getElementsByTagName(elemName)[0].firstChild.nodeValue;
				return val
			} catch(exception) {
				return "";
			}
	},
	try_count : 0,
	last_request_id: null,
	last_tab_id: null,
	authcallback: null,
	authdetails: null,
	authretrycount: 0,
	popupopened: false,
	sendcredentials: function(status,credential,callback) {


	//if(globalAutologinHandler.popupopened)
		//globalAutologinHandler.popupopened=false
		////console.log("status",globalAutologinHandler.last_request_id,"status.requestId ",status.requestId )
		if (status.requestId == globalAutologinHandler.last_request_id && status.tabId == globalAutologinHandler.last_tab_id) {
					++globalAutologinHandler.try_count;
					////console.log("increment try count")

				} else {
					globalAutologinHandler.try_count = 0;
				//	//console.log("increment try count again")
				}

				if (globalAutologinHandler.try_count < 3) {
					//console.log("try_count" + globalAutologinHandler.try_count)
					globalAutologinHandler.last_request_id = status.requestId;
					globalAutologinHandler.last_tab_id = status.tabId;

					//console.log("Sending data to page " ,globalAutologinHandler.try_count,credential )

					callback({authCredentials: {username: credential.username, password: credential.password}});
				} else {

				// Remove autologin credential and send cancel status
					if (credential.input === "autologin")
								storage.removeSite(credential.sitedata)

						callback({cancel: true });
						globalAutologinHandler.try_count = 0;
				}
	},
	retrieveautologinsites: function(details, callback) {
		var status = details
		var url = status.challenger.host;
		//console.log("auth required")

		// TODO: check url has authorization autologinsites in storage or user has set authorization autologinsites

		var credential = storage.getbasicauthdata(url)
		var curdomainName = status.challenger.host

		if (credential != null ) {
				credential.input = "autologin"

				if (credential.username !== "" && credential.password !== "") {
					globalAutologinHandler.authcallback=null;
					globalAutologinHandler.authdetails=null

					// TODO: show popup to retrieve autologin credential
					////console.log("authentication sent from storage ",credential,status)
					globalAutologinHandler.sendcredentials(status, credential, callback)

					return;
				}
		}

		if (globalAutologinHandler.popupopened) {
				callback({cancel: true });
				return;
		}

		globalAutologinHandler.authcallback = null;
		globalAutologinHandler.authdetails = null

		globalAutologinHandler.popupopened = true

		////console.log("setting status ")
		globalAutologinHandler.authcallback = callback;
		globalAutologinHandler.authdetails = status

				////console.log("creating popup")


		globalAutologinHandler.authdetails.sitedata={}
		globalAutologinHandler.authdetails.sitedata.authtype="basic"
		globalAutologinHandler.authdetails.sitedata.url=curdomainName
		globalAutologinHandler.authdetails.sitedata.loginurl=curdomainName
		globalAutologinHandler.authdetails.sitedata.user=""
		globalAutologinHandler.authdetails.sitedata.elements=[]

		var elem = {}
			elem.type = "text"
			elem.value = ""
			elem.event = ""
			elem.xpath = "username"

				globalAutologinHandler.authdetails.sitedata.elements.push(elem)
				elem = {}
					elem.type = "password"
					elem.value = ""
					elem.event = ""
					elem.xpath = "password"
					globalAutologinHandler.authdetails.sitedata.elements.push(elem)

					globalAutologinHandler.authpopup = null;
				// TODO: handle close
				vAPI.windows.open({
					type: 'popup',
					 focused: true,
					url: vAPI.getURL('auth.html'),
					height: 450, width:450

				}, function(win) {
					globalAutologinHandler.authpopup = win
					//console.log("window id" ,win.id)
				});

	},
	initExtension: function() {
		storage.init(function(){
				globalAutologinHandler.initDetails();
		})
	},
	initDetails: function() {
			// Validate and set logged in
			var credential = storage.getCredential();
			var promptrequired = storage.getPromptRequired()

			if (undefined == credential || null == credential || undefined == promptrequired || null == promptrequired ||  promptrequired === 'false'){

				globalAutologinHandler.loggedIn = true

				// No use of promptrequired as there is no credential
				if (promptrequired === 'true')
					storage.setPromptRequired('false')
			} else
					globalAutologinHandler.loggedIn = false



			var usebasicauth= (storage.getUseBasicAuth() === 'true')
			globalAutologinHandler.updateBasicAuthHandlers(usebasicauth)

			//globalAutologinHandler.loadDoc( )
	},
	injectCapture: function(tabId) {
			//console.log("Attempting capture")
			var jscode = 'var extnid="'+ vAPI.getURL("/") + '"';
			vAPI.tabs.injectScript(tabId, {file:"js/captureUI.js", allFrames: false,
      runAt: 'document_end'}, function() {

					vAPI.tabs.injectScript(tabId, {file:"js/capture.js",allFrames: false,
      			runAt: 'document_end'}, function() {
						//script injected
						//console.log("got autoLoginCapture" +tabId)
					});
			});
	},
	processScripts: function(tab) {
			var tabId = tab.id
			//console.log("Checking site for tab",tab.url)
			var  siteInfo = globalAutologinHandler.retrieveSiteInfo(tab.url)
			var status = siteInfo.status


	//console.log("Inject capture check status",siteInfo)

		if (status == 0) {

			if (globalAutologinHandler.loggedIn == false) {
				vAPI.tabs.injectScript(tabId, {file:"js/validate.js",allFrames: false,
            runAt: 'document_end'}, function(details) {
						//script injected
						////console.log("Inserted validate module")
					});

			} else {

			var jscode = 'var extnid="'+ vAPI.getURL("/") + '"';

				//console.log("Injecting automate js ")

						vAPI.tabs.injectScript(tabId, {file:"js/userselect.js",allFrames: false,
            runAt: 'document_end'}, function() {

							vAPI.tabs.injectScript(tabId, {file:"js/automate.js",allFrames: false,
            runAt: 'document_end'}, function() {
										//script injected
										//console.log("Inserted autoLogin")
									});

						});
			}
		} else {
				//console.log("Injecting cAPTURE js ")
				globalAutologinHandler.injectCapture(tabId)
		}
	}
};

var PageActionHandler = {
	injectscripts: function(obj, index) {

		var tabId = obj.tabId
		var scripts = obj.scripts
		var callback = obj.callback

		if (index >= scripts.length) {
			obj.callback()
		}

		vAPI.tabs.injectScript(tabId, {file:scripts[index],allFrames: false,
      runAt: 'document_end'}, function() {
				// Script injected
				index++
				PageActionHandler.injectscripts(obj,index)
		});
	}
};




//globalAutologinHandler.loadXMLDoc(vAPI.getURL('autologin.xml'))

// Return 1 if a > b
// Return -1 if a < b
// Return 0 if a == b
vAPI.compareVersion = function(a, b) {
    if (a === b) {
       return 0;
    }

    var a_components = a.split(".");
    var b_components = b.split(".");

    var len = Math.min(a_components.length, b_components.length);

    // loop while the components are equal
    for (var i = 0; i < len; i++) {
        // A bigger than B
        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
            return 1;
        }

        // B bigger than A
        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
            return -1;
        }
    }

    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length > b_components.length) {
        return 1;
    }

    if (a_components.length < b_components.length) {
        return -1;
    }

    // Otherwise they are the same.
    return 0;
}

vAPI.openFAQ = function() {
	//console.log("opening faq")

	vAPI.tabs.open({
			type: 'normal',
			focused: true,
			url: vAPI.getURL('faq/index.html'),
			height: 450, width:450

		}, function(win) {

		});
}

vAPI.handleInstallUpgrade = function(installData) {
		var data = installData.data

		// Only for Chrome
		if (installData.reason == "update" && vAPI.chrome) {
			// Open FAQ page
			vAPI.openFAQ();

			var versionComparison = vAPI.compareVersion(data.installedVersion, data.existingVersion);
			if (versionComparison == 0) {
					// Equal
					////console.log("INSTALL Equal")
			} else if (versionComparison == 1) {
				//console.log("Upgrade detected")

				var majorversion = parseInt(data.existingVersion.split(".")[0])
				// Check major
				if (majorversion < 3) {
					//console.log("Upgrade autologinsites")
					storage.migrateautologinsites();

					// Upgrade xml elements
				} else if (majorversion < 4) {
					// Upgrade storage
					//console.log("Upgrade storage ")

					storage.migratestorage();
				}
			} else if (vAPI.compareVersion(data.installedVersion,data.existingVersion) == -1) {
				//??Downgrade
				//console.log("INSTALL Downgrade")
			}
		} else if (installData.reason == "install") {
			// Open FAQ page
			vAPI.openFAQ();
		}
		// Handle

		//console.log("INSTALL DATA Listener" , data
}

vAPI.handleUpdateTab = function(curtab) {
		globalAutologinHandler.processScripts(curtab)
}

globalAutologinHandler.initExtension()

vAPI.onLoadAllCompleted();

/*
getautologinsites
		autologinsites

	importdata inp  "result":result
		flgvalid


	updatedefaultcredential  inp "site"	:site


	messager.send({module:"options",action: "removeCredential","site"	:site}



	messager.send({module:"options",action: "updatedefaultcredential","site"	:site}, function(response) {});


	messager.send({module:"options",action: "siteupdates","sitecredentialupdates":sitecredentialupdates,"siteenabledupdates"	:siteenabledupdates}, function(response) {


*/

var handleOptionMsg = function(request, tab, sendResponse) {
	 if (request.action == "hasCredential") {
				var savedCredential = storage.getCredential();
				var result = (savedCredential != "")
					sendResponse({"valid": result});

		} else if (request.action == "addCredential") {
				var credential = request.info;

				storage.setCredential(credential,function() {
					sendResponse({"valid": true });
				})
		}	else if (request.action == "getCaptureOnlyOnFocus") {
						sendResponse({"valid": true , "getCaptureOnlyOnFocus": storage.getCaptureOnlyOnFocus()});

		} else if (request.action == "updatecaptureonlyonfocus") {
				storage.setCaptureOnlyOnFocus(request.usecaptureonlyonfocus, function() {
						var captureonlyonfocus = storage.getCaptureOnlyOnFocus()
						//globalAutologinHandler.updateUsecaptureonlyonfocusHandlers(captureonlyonfocus)
						sendResponse({"valid": true });
				});
		} else if (request.action == "getUseBasicAuth") {
				sendResponse({"valid": true , "usebasicauth": storage.getUseBasicAuth()});

		} else if (request.action == "updateBasicAuthHandlers") {
			//console.log("changing " + request.usebasicAuth)
				storage.setUseBasicAuth(request.usebasicAuth, function() {
						var usebasicauth = storage.getUseBasicAuth()
						globalAutologinHandler.updateBasicAuthHandlers(usebasicauth)
						sendResponse({"valid": true });
				});

		} else if (request.action == "getCredential") {
				sendResponse({"valid": true, "credential": storage.getCredential()});

		} else if (request.action == "getExportData") {
				storage.getExportData(function(curexpdata) {
						sendResponse({"valid": true, "expdata": curexpdata});
				})

		} else if (request.action == "getautologinsites") {
				sendResponse({"valid":true, "autologinsites": storage.autologinsites});

		} else if (request.action == "importdata") {
				var importresp = storage.importdata(request.result)
				sendResponse({"valid": true, "flgvalid": importresp.flgvalid, "msg": importresp.msg});

		}	else if (request.action == "updatedefaultcredential") {
				var flgvalid = storage.updatedefaultcredential(request.site)
				sendResponse({"valid": true });

		} else if (request.action == "removeCredential") {
				var flgvalid = storage.removeCredential(request.site)
				sendResponse({"valid": true });

		} else if (request.action == "removeSite") {
				var flgvalid = storage.removeSite(request.site)
				sendResponse({"valid": true });

		} else if (request.action == "modifysiteenabled") {
				var flgvalid=storage.updatesiteenabled(request.site)
				sendResponse({"valid": true });

		} else if (request.action == "siteupdates") {
				for (var j = 0; j < request.siteenabledupdates.length; j++) {
						var site = request.siteenabledupdates[j]

						//console.log("updating site enable",site);
						storage.updatesiteenabled(site)
				}

				for (j = 0; j < request.sitecredentialupdates.length; j++) {
						var site = request.sitecredentialupdates[j]

						//console.log("updating site updatecredential",site);
						storage.updatecredential(site)
				}

				sendResponse({"valid": true });

		} else if (request.action == "updatePromptAtStartup") {
				storage.setPromptRequired(request.promptrequired);
				sendResponse({"valid": true });

		} else if (request.action == "reloadStorage") {
				storage.init()

				sendResponse({"valid":true });
		} else {
				console.error("Error: unable to handle option module request", request)
		}
}


var handleGlobalMsg= function(request, tab, sendResponse) {
    // //console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");



if (request.module && request.module == "options") {

	return handleOptionMsg(request, tab, sendResponse) ;

} else if (request.action == "inject") {


} else if (request.action == "getData") {


			var site= storage.get("form",request.domain)


			sendResponse({"site": site,"extnid":vAPI.getURL("/")});


	} else if (request.action == "injectAutoLogin") {
			globalAutologinHandler.processScripts(tab)
			sendResponse({"valid": true});

	} else if (request.action == "getPromptAtStartup") {
			promptrequired = storage.getPromptRequired()
			sendResponse({"promptrequired": (promptrequired === 'true') });

	} else if (request.action == "getauthinfo") {
			var data = {}
			data.valid = false;

			if (globalAutologinHandler.authdetails) {
					data.valid = true;
					data.realm = globalAutologinHandler.authdetails.realm;

					if (globalAutologinHandler.authdetails.isProxy) {
						data.url = globalAutologinHandler.authdetails.challenger.host + ":" + globalAutologinHandler.authdetails.challenger.port
					} else
						data.url = globalAutologinHandler.authdetails.url
			}

			sendResponse(data);

	} else if (request.action == "getcapturesettings") {
			// Check in storage
			var site = storage.get("form", request.url)

			var data = {"hiddencapture": (site !=null), "showcaptureonlyonfocus": (storage.getCaptureOnlyOnFocus() == "true")}
			data.extnid = vAPI.getURL("/")

			sendResponse(data);

	} else if (request.action == "hiddencapture") {
			// Check in storage
			var site = storage.get("form", request.url)
			var data = {"hiddencapture": (site !=null)}
			data.extnid = vAPI.getURL("/")

			sendResponse(data);

	} else if (request.action == "basicauth") {
			globalAutologinHandler.popupopened = false
			var data = request.info;
			////console.log("Basic auth details received",data)
			if (data.cancel) {

				//remove iframe on current tab
				//send cancel event
				globalAutologinHandler.authcallback({cancel: true});

				sendResponse({"valid": true });

			} else {
				data.input = "dialog"

					//globalAutologinHandler.addAutoLoginElements(request.info,"form")


				if (data.useAutologin && globalAutologinHandler.authdetails && globalAutologinHandler.authdetails.sitedata) {

					////console.log("saving autologin")
					////console.log(globalAutologinHandler.authdetails)
						for (k = 0; k < globalAutologinHandler.authdetails.sitedata.elements.length; k++) {

							var elem=globalAutologinHandler.authdetails.sitedata.elements[k]
							if (elem.type=="text") {

								globalAutologinHandler.authdetails.sitedata.elements[k].value=data.username
							}
							if (elem.type=="password") {

								globalAutologinHandler.authdetails.sitedata.elements[k].value=data.password
							}

						}

						////console.log("Adding data")
						////console.log(globalAutologinHandler.authdetails.sitedata)
					globalAutologinHandler.addAutoLoginElements(globalAutologinHandler.authdetails.sitedata,"basic")
				}


				globalAutologinHandler.sendcredentials(globalAutologinHandler.authdetails,data,globalAutologinHandler.authcallback)
				sendResponse({"valid":true});

			}

	} else if (request.action == "validateCredential") {
			var userCredential = request.info;
			var savedCredential = storage.getCredential();

			if (userCredential == savedCredential) {
					globalAutologinHandler.loggedIn = true

					sendResponse({"valid": true });
			}

			else{
					globalAutologinHandler.loggedIn = false;
					sendResponse({"valid": false });
			}
	} else if (request.action == "updateCredential") {
			var credential = request.currentCredential;
			var newCredential = request.newCredential;
			var savedCredential = storage.getCredential();

			if (credential == savedCredential) {
					storage.setCredential(newCredential,function(){
						sendResponse({"valid": true });
					})
			}	else
				sendResponse({"valid": "false" }); // NOTE: Should false be in quotes here? It is a boolean everywhere else



	} else if (request.action == "refreshData") {
			globalAutologinHandler.loadDoc()

			sendResponse({});
	} else if (request.action == "cansubmit") {
		var flgResponse = globalAutologinHandler.canSubmit(tab.url)

		if (flgResponse == true) {
			globalAutologinHandler.updateSuccessLogin(tab.url)
		} else {
			globalAutologinHandler.injectCapture(tab.id)
		}

		sendResponse({actionresponse: flgResponse});

	} else if (request.action == "submiterror") {
		globalAutologinHandler.removefromPool(tab.url)

		sendResponse({"valid": "true" }); // NOTE: Same here but for true

	} else if (request.action == "addAutoLoginFormElements") {
		globalAutologinHandler.addAutoLoginElements(request.info, "form")

		sendResponse({});
	} else {
		console.error("Error: unable to handle Global request", request)
	}

};


// Default handler

(function() {

'use strict';

/******************************************************************************/

var onMessage = function(request, sender, callback) {
  	var µb = AppExtn;

		if (undefined == request  || undefined == request.action) {
			 ////console.log("Invalid request", request )
			 return;
		 }

	  var tabId = sender && sender.tab ? sender.tab.id : 0;
	  var tab = sender && sender.tab && sender.tab.url ? sender.tab : null;

		// Firefox special
	  if (null == tab){
		   vAPI.tabs.get(tabId, function(curtab) {
          handleGlobalMsg(request, curtab, callback)
        });
	  } else
			handleGlobalMsg(request, tab, callback)

};


vAPI.messaging.setup(onMessage);

vAPI.net.registerListeners();

/******************************************************************************/

})();
