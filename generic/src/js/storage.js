
var storage = {

	autologinsites : [],
	credential:null,
	promptrequired:'false',
	usebasicauth:'false',
	getExportData:function(callback){
		
		
		vAPI.storage.get("autologinsites", function (localStorageObject)
			{

					callback(localStorageObject["autologinsites"])
			
			
			});
			
	},
	  log: function (aMessage) {


        //  alert(aMessage)

		try{
			console.log(aMessage)
		}catch(exception){}

    },
	  logerror: function (aMessage) {


        //  alert(aMessage)

		try{
			console.log(aMessage)
		}catch(exception){}

    },
	
	
	getUseBasicAuth:function(){
		
		return storage.usebasicauth;
	},
	setUseBasicAuth:function(flgUseBasicAuth,callback){
		
			var data={'usebasicauth':flgUseBasicAuth}
		var response={}
		vAPI.storage.set(response, function ()
					{
						
						
						var lastError = vAPI.lastError();
						if (lastError)
						{
							//details.error = 'Error: ' + lastError.message;
							storage.logerror('save usebasicauth error:' + lastError.message);
							response={'status':1,"msg":"Unable to save information ,Storage error "}
						
								
						}else{
							
							storage.usebasicauth=	flgUseBasicAuth
							response={"status":0,"msg":"Success"}
						}
						
						if(typeof callback === 'function') {
							callback(response)
						}
						
					});
					
		
	},
	getCredential:function(){
		
		return Helper.decrypt(storage.credential)
	},
	getPromptRequired:function(){
		
		
		return storage.promptrequired
	},
	setCredential:function(pwd,callback){
		
		var data={'credential':Helper.encrypt(pwd)}
		
		var response={}
		
		vAPI.storage.set(response, function ()
					{
						
						
						var lastError = vAPI.lastError();
						if (lastError)
						{
							//details.error = 'Error: ' + lastError.message;
							storage.logerror('save credential error:' + lastError.message);
							
							response={'status':1,"msg":"Unable to save credential ,Storage error "}
								
						}else{
							
							storage.credential=	Helper.encrypt(pwd)
							response={"status":0,"msg":"Success"}
						}
						
						if(typeof callback === 'function') {
							callback(response)
						}
					});
		
		
	},
	setPromptRequired:function(flgPromptRequired,callback){
		
			var data={'promptrequired':flgPromptRequired}
		var response={}
		vAPI.storage.set(response, function ()
					{
						
						
						var lastError = vAPI.lastError();
						if (lastError)
						{
							//details.error = 'Error: ' + lastError.message;
							storage.logerror('save promptrequired error:' + lastError.message);
							response={'status':1,"msg":"Unable to save information ,Storage error "}
						
								
						}else{
							
							storage.promptrequired=	flgPromptRequired
							response={"status":0,"msg":"Success"}
						}
						
						if(typeof callback === 'function') {
							callback(response)
						}
						
					})
					
		
	},
	importdata:function(rawdata){
		
		//decrypt data
		
		var jsonobj;
		
		try{
			
		var data =Helper.decrypt(rawdata)
			
			jsonobj=JSON.parse(data);
			
			
		}catch(exception){
			
			return false;
		}
		// check entries greater than zero and valid entries , return true or false
		
		storage.autologinsites = jsonobj
		
		console.log(storage.autologinsites )
		
		storage.updatestorage();
		return true;
	},
		migrateautologinsites : function () {

		if (localStorage["autologinxml"] == undefined || localStorage["autologinxml"] == "")
			return

		if (localStorage["autologinsites"] !== undefined && localStorage["autologinsites"] !== ""){
				
				//Migrate storage only 
			storage.autologinsites = JSON.parse(Helper.migrantdecrypt(localStorage["autologinsites"]));
			
			//set credential
			if (localStorage["credential"] !== undefined && localStorage["credential"] !== "")
				storage.setCredential(Helper.migrantdecrypt(localStorage["credential"]))
				
			
			//set prompt required
			if (localStorage["promptrequired"] !== undefined && localStorage["promptrequired"] !== "")
				storage.setPromptRequired(localStorage["promptrequired"])
			
			
			//set use basic auth
			if (localStorage["usebasicauth"] !== undefined && localStorage["usebasicauth"] !== "")
				storage.setUseBasicAuth(localStorage["usebasicauth"])
			
			
			storage.updatestorage();
			localStorage["autologinsites"]=""
			return
			
			}
			
			
			

			var rawxml = Helper.migrantdecrypt(localStorage["autologinxml"])

				var parser = new DOMParser();
		var docxml = parser.parseFromString(rawxml, "text/xml");

		var legacyjson = new Array();

		var divs = docxml.getElementsByTagName("site"),
		i = divs.length;

		if (i == 0)
			return;

		var autologinsites = [];
		
		while (i--) {

			var partner = {}
			partner.url = globalAutologinHandler.getXMLElementval(divs[i], "url");

			partner.loginurl = globalAutologinHandler.getXMLElementval(divs[i], "loginurl");
			partner.username = globalAutologinHandler.getXMLElementval(divs[i], "username");

			partner.password = globalAutologinHandler.getXMLElementval(divs[i], "password");
			partner.userelement = globalAutologinHandler.getXMLElementval(divs[i], "userelement");
			partner.pwdelement = globalAutologinHandler.getXMLElementval(divs[i], "pwdelement");

			partner.btnelement = globalAutologinHandler.getXMLElementval(divs[i], "btnelement");
			partner.enabled = globalAutologinHandler.getXMLElementval(divs[i], "enabled");
			partner.formelement = globalAutologinHandler.getXMLElementval(divs[i], "formelement");

			if (partner.url == "")
				continue;

			var site = {}
			site.authtype = 'form'
				site.url =  Utils.getdomainName(partner.url)
				site.loginurl = partner.loginurl
				site.enabled = (partner.enabled == "true")

				var credentials = []

				var credential = {}
			credential.user = partner.username
				credential.defaultsite = true

				var elements = []

				elements.push({
					"event" : "",
					"xpath" : '//input[contains(@id,"' + partner.userelement + '") or contains(@name,"' + partner.userelement + '")]',
					"value" : partner.username,
					"type" : "text"
				})

				elements.push({
					"event" : "",
					"xpath" : '//input[contains(@id,"' + partner.pwdelement + '") or contains(@name,"' + partner.pwdelement + '")]',
					"value" : partner.password,
					"type" : "password"
				})

				//Button
				if (partner.btnelement !== "") {

					elements.push({
						"event" : "click",
						"xpath" : '//*[contains(@id,"' + partner.btnelement + '") or contains(@name,"' + partner.btnelement + '")]',
						"value" : "",
						"type" : "button"
					})

				}
				//form
				if (partner.formelement !== "") {

					elements.push({
						"event" : "submit",
						"xpath" : '//*[contains(@id,"' + partner.formelement + '") or contains(@name,"' + partner.formelement + '")]',
						"value" : "",
						"type" : "form"
					})

				}

				credential.elements = elements
				credentials.push(credential)
				site.credentials = credentials
				autologinsites.push(site)
		}

		//delete localStorage["autologinxml"]
		storage.autologinsites = autologinsites
			storage.updatestorage();
			localStorage["backupautologinxml"]=localStorage["autologinxml"]
		localStorage["autologinxml"] = ""

	},
	
saveitem:function(response){
	
			vAPI.storage.set(response, function ()
					{
						
						
						var lastError = vAPI.lastError();
						if (lastError)
						{
							//details.error = 'Error: ' + lastError.message;
							storage.logerror('save Item error:' + lastError.message);
						
								
						}
						
						storage.log('ad definitions stored in local storage');
						});
				
					
					
	},
	getitem:function(item,callbackFunction){
		
		vAPI.storage.get(item, function (localStorageObject)
			{

				if (typeof callbackFunction === 'function')
				{
					callbackFunction(localStorageObject[item]);
				}
			});
	},
	updatestorage : function () {

		var localStorage_autologinsites = Helper.encrypt(JSON.stringify(storage.autologinsites));
		
		var data={'autologinsites':localStorage_autologinsites}
		
		storage.saveitem(data)

	},
	getCredentialAtIndex : function (index) {

		if (index < storage.autologinsites.length)
			return storage.autologinsites[index];
		else
				return null

	},

	add : function (site) {

		var isPushed = false;
		//console.log("Adding credentials", site)
		for (i = 0; i < storage.autologinsites.length; i++) {

			cursite = storage.autologinsites[i]

				if (cursite.authtype == site.authtype && cursite.url == site.url) {

					//Iterate credentials
					isPushed = true;
					var isUserModfied = false;
					for (k = 0; k < storage.autologinsites[i].credentials.length; k++) {

						var curcredential = storage.autologinsites[i].credentials[k]

							if (curcredential.user == site.user && storage.autologinsites[i].credentials[k].elements.length == site.elements.length) {

								isUserModfied = true
									delete storage.autologinsites[i].credentials[k].elements
									storage.autologinsites[i].credentials[k].elements = site.elements
									//console.log("modifying credentials", site)
									break
							}

					}
					//basic auth requires only one credential
					if (!isUserModfied && site.authtype != "basic" ) {

						var credential = {}
						credential.user = site.user
							credential.defaultsite = false
							credential.elements = site.elements
							storage.autologinsites[i].credentials.push(credential)
							//console.log("Adding new credentials to site ", site)

					}

					//check user already exists
					//if already exists update
					//else
					//create new element entry


					break;
				}
		}

		if (!isPushed) {
			//console.log("Adding new  site ", site)
			var currentsite = {}
			currentsite.authtype = site.authtype
				currentsite.url = site.url
				currentsite.loginurl = site.loginurl
				currentsite.enabled = true
				currentsite.credentials = []

				var credential = {}
			credential.user = site.user
				credential.defaultsite = true
				credential.elements = site.elements

				currentsite.credentials.push(credential)
				//console.log("Adding site", currentsite)

				storage.autologinsites.push(currentsite)

		}

		storage.updatestorage();

	},
	credentialExistsForUser : function (site) {

		for (i = 0; i < storage.autologinsites.length; i++) {

			cursite = storage.autologinsites[i]
				if (cursite.authtype == site.authtype && cursite.url == site.url) {

					for (k = 0; k < storage.autologinsites[i].credentials.length; k++) {

						var curcredential = storage.autologinsites[i].credentials[k]

							if (curcredential.user == site.user) {

								return true

							}

					}

					break;

				}
		}

		return false
	},
	get : function (authtype, url) {

		var resultsite = null

			for (i = 0; i < storage.autologinsites.length; i++) {

				cursite = storage.autologinsites[i]
					if (cursite.authtype == authtype && cursite.url == url) {

						resultsite = cursite
					}
			}

			return resultsite

	},
	getbasicauthdata : function ( url) {

		var credential=null
			var site = storage.get("basic",url)

			if(null != site){
			
			 credential = {}
				credential.sitedata = {
					"authtype" : "basic",
					"url" : url
				}
				var elems = site.credentials[0].elements

					for (index = 0, len = elems.length; index < len; ++index) {

						var field = elems[index]

							if (field.type === "password") {
								credential.password = field.value

							}

							if (field.type === "text") {
								credential.username = field.value

							}

					}
		}
	return credential

	},
	changeflag : function (authtype, url, flgenabled) {

		for (i = 0; i < storage.autologinsites.length; i++) {

			cursite = storage.autologinsites[i]
				if (cursite.authtype == authtype && cursite.url == url) {

					storage.autologinsites[i].enabled = flgenabled
				}
		}

		storage.updatestorage();

	},

	getuserdata : function (site) {

	
		for (index = 0; index < storage.autologinsites.length; index++) {

			cursite = storage.autologinsites[index]

				if (cursite.authtype == site.authtype && cursite.url == site.url) {

					for (credIndex = 0; credIndex < storage.autologinsites[index].credentials.length; credIndex++) {

						var credential = storage.autologinsites[index].credentials[credIndex]

							if (credential.user == site.user) {
								var datainfo = {}
								datainfo.user = ""

									for (elemIndex = 0; elemIndex < storage.autologinsites[index].credentials[credIndex].elements.length; elemIndex++) {

										var field = storage.autologinsites[index].credentials[credIndex].elements[elemIndex]

											if (field.type === "password") {

													datainfo.password = field.value
													datainfo.pwdxpath = field.xpath
													datainfo.pwdIndex = elemIndex
											}

											if (field.type === "text" && site.user == field.value) {
												datainfo.userxpath = field.xpath
													datainfo.user = site.user
													datainfo.userIndex = elemIndex
											}

									}
									
									//console.log("datainfo",datainfo)

									if (datainfo.user != "")
										return datainfo
							}

					}
				}
		}

		return null
	},

		updatedefaultcredential : function (site) {

		for (i = 0; i < storage.autologinsites.length; i++) {

			cursite = storage.autologinsites[i]

				if (cursite.authtype == site.authtype && cursite.url == site.url) {

					
						for (k = 0; k < storage.autologinsites[i].credentials.length; k++) {

							var curcredential = storage.autologinsites[i].credentials[k]
							
							
								if(site.defaultsite == true && curcredential.user != site.user )
									storage.autologinsites[i].credentials[k].defaultsite=false
								
								
								if (curcredential.user == site.user ) {
									storage.autologinsites[i].credentials[k].defaultsite=site.defaultsite
									
								}

						}
						storage.updatestorage();
					
				}
		}

	},
	updatesiteenabled : function (site) {
		
		
		for (i = 0; i < storage.autologinsites.length; i++) {

			cursite = storage.autologinsites[i]

				if (cursite.authtype == site.authtype && cursite.url == site.url && undefined != site.enabled ) {

					storage.autologinsites[i].enabled = site.enabled
					storage.updatestorage();
					}
		}
		
	},
	updatecredential : function (site) {

		for (i = 0; i < storage.autologinsites.length; i++) {

			cursite = storage.autologinsites[i]

				if (cursite.authtype == site.authtype && cursite.url == site.url) {

				
					
						for (k = 0; k < storage.autologinsites[i].credentials.length; k++) {

							
							//console.log("curcredential",curcredential)

								var obj = {}
								obj.authtype = site.authtype
								obj.url = site.url
								obj.user = storage.autologinsites[i].credentials[k].user

								 var curcredential = storage.getuserdata(obj)
								 
								
										

								//console.log("storage.autologinsites[i].credentials[k]",storage.autologinsites[i].credentials[k])
								if (null != curcredential && curcredential.userxpath == site.userxpath &&  curcredential.pwdxpath == site.pwdxpath) {

									storage.autologinsites[i].credentials[k].elements[curcredential.userIndex].value = site.changeduser
										storage.autologinsites[i].credentials[k].elements[curcredential.pwdIndex].value = site.changedpassword
										//console.log("Updated storage data" , site)
										storage.updatestorage();
										return;
								}

						}

					
				}
		}

	},

	removeCredential : function (site) {

		var isCredentialRemoved = false;

		for (i = 0; i < storage.autologinsites.length; i++) {

			cursite = storage.autologinsites[i]

				if (cursite.authtype == site.authtype && cursite.url == site.url) {

					for (k = 0; k < storage.autologinsites[i].credentials.length; k++) {

						var curcredential = storage.autologinsites[i].credentials[k]

							if (curcredential.user == site.user) {

								isCredentialRemoved = true
									storage.autologinsites[i].credentials.splice(k, 1); //  [k].elements
								break;

							}

					}

					break;
				}
		}

		if (isCredentialRemoved) {

			// storage.autologinsites.splice(removeIndex,1);
			storage.updatestorage();
		}

	},
	removeSite : function (site) {

		var removeIndex = -1

			for (i = 0; i < storage.autologinsites.length; i++) {

				cursite = storage.autologinsites[i]

					if (cursite.authtype == site.authtype && cursite.url == site.url) {
						removeIndex = i
							break;
					}
			}

			if (removeIndex >= 0) {

				storage.autologinsites.splice(removeIndex, 1);
				storage.updatestorage();
			}

	},

	init : function (callback) {


		
		vAPI.storage.get(null, function (localStorageObject)
		{
			//go through each storage entry
			for (var key in localStorageObject)
			{
				
				if(key == "autologinsites")
					storage.autologinsites=JSON.parse(Helper.decrypt(localStorageObject["autologinsites"]));
				else if(key == "usebasicauth")
					storage.usebasicauth=localStorageObject['usebasicauth'];
				else if(key == "credential")
					storage.credential=localStorageObject['credential'];
				else if(key == "promptrequired")
					storage.promptrequired=localStorageObject['promptrequired'];
				
				
			}
			
			if(typeof callback === 'function') 
				callback();
			
		});
		
	
			
		
		/*
		var localStorage_autologinsites = Helper.encrypt(JSON.stringify(storage.autologinsites));
		
		var data={'autologinsites':localStorage_autologinsites}
		
		storage.saveitem(data)
		*/
		
		

	}
}
