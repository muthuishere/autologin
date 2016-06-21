var globalMem = {

// LZW-compress a string
	lzw_encode:function(s) {
		var dict = {};
		var data = (s + "").split("");
		var out = [];
		var currChar;
		var phrase = data[0];
		var code = 256;
		for (var i=1; i<data.length; i++) {
			currChar=data[i];
			if (dict[phrase + currChar] != null) {
				phrase += currChar;
			}
			else {
				out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
				dict[phrase + currChar] = code;
				code++;
				phrase=currChar;
			}
		}
		out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
		for (var i=0; i<out.length; i++) {
			out[i] = String.fromCharCode(out[i]);
		}
		return out.join("");
	},

	// Decompress an LZW-encoded string
	lzw_decode:function(s) {
		var dict = {};
		var data = (s + "").split("");
		var currChar = data[0];
		var oldPhrase = currChar;
		var out = [currChar];
		var code = 256;
		var phrase;
		for (var i=1; i<data.length; i++) {
			var currCode = data[i].charCodeAt(0);
			if (currCode < 256) {
				phrase = data[i];
			}
			else {
			   phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
			}
			out.push(phrase);
			currChar = phrase.charAt(0);
			dict[code] = oldPhrase + currChar;
			code++;
			oldPhrase = phrase;
		}
		return out.join("");
		},
getItem:function(item,callback){


chrome.storage.sync.get(item, function(response) {

if(typeof callback === "function"){
		if (!chrome.runtime.error) {
			console.log(response);			
			callback(response.item)
		}else{
			callback("")
		}
		}
	});
	
	
	
	
},
setItem:function(item,val,callback){
 
 var value=lzw_encode(val)
	chrome.storage.sync.set({item:value}, function() {
	
		if(typeof callback === "function"){
		
				if (!chrome.runtime.error) 
					callback(true)
				else
					callback(false)
				
			}
	});
		
}

}

var localMem = {


getItem:function(item,callback){


	callback(localStorage[item])
	

	
	
	
	
},
setItem:function(item,value){
 
 localStorage[item]=value;
 
 if (!chrome.runtime.error) {
			
			callback(true)
		}else{
			callback(false)
		}
		
		
}

}


var storage = {

	autologinsites : [],
	extensionsettings:{},
	

	migrateautologinsites : function () {

		if (localStorage["autologinxml"] == undefined || localStorage["autologinxml"] == "")
			return

		

			var rawxml = Helper.decrypt(localStorage["autologinxml"])

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
		//if(storage.autologinsites.length == 0){
				storage.autologinsites = autologinsites
				storage.extensionsettings.promptrequired=false
				storage.extensionsettings.usebasicauth=true
				storage.extensionsettings.credential=""
				
				if(undefined != localStorage["credential"] && null != localStorage["credential"])
					storage.extensionsettings.credential= Helper.decrypt(localStorage["credential"] )
				
				
				if(undefined != localStorage["promptrequired"] && null != localStorage["promptrequired"])
					storage.extensionsettings.promptrequired= (localStorage["promptrequired"] === 'true')
				
			
					
				storage.updatestorage();
				
		//}
		
			
		
		
		localStorage["autologinxml"] = ""

	},

	setbasicauth:function(flg){
		storage.extensionsettings.usebasicauth=flg
		storage.updatestorage()
	},
	setpromptrequired:function(flg){
		storage.extensionsettings.promptrequired=flg
		storage.updatestorage()
	},
	setcredential:function(cred){
		storage.extensionsettings.credential=cred
		storage.updatestorage()
	},
	getcredential:function(){
		return storage.extensionsettings.credential
	},
	getpromptrequired:function(){
		return storage.extensionsettings.promptrequired
	},
	getbasicauth:function(){
		return storage.extensionsettings.usebasicauth
	},
	updatestorage : function () {

		var bfr=Helper.encrypt(JSON.stringify(storage.autologinsites));
		
		
		
		
		//localStorage["autologinsites"] = bfr
		
		
		globalMem.setItem("autologinsites",bfr)
		storage.extensionsettings.lastmodified=new Date().getTime();		
		bfr=Helper.encrypt(JSON.stringify(storage.extensionsettings));
		
		//localStorage["extensionsettings"] = bfr
		globalMem.setItem("extensionsettings",bfr)
		
		//Update to global

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
									console.log("modifying credentials", site)
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
							console.log("Adding new credentials to site ", site)

					}

					//check user already exists
					//if already exists update
					//else
					//create new element entry


					break;
				}
		}

		if (!isPushed) {
			console.log("Adding new  site ", site)
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
				console.log("Adding site", currentsite)

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
									
									console.log("datainfo",datainfo)

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

							
							console.log("curcredential",curcredential)

								var obj = {}
								obj.authtype = site.authtype
								obj.url = site.url
								obj.user = storage.autologinsites[i].credentials[k].user

								 var curcredential = storage.getuserdata(obj)
								 
								
										

								console.log("storage.autologinsites[i].credentials[k]",storage.autologinsites[i].credentials[k])
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

	sync:function(){
	
	storage.extensionsettings.promptrequired=false
	storage.extensionsettings.usebasicauth=true
	storage.extensionsettings.credential=""
	
	globalMem.getItem("autologinsites",function(item){
	
		if("" != item && null != item && undefined !=item){
			
			storage.autologinsites = JSON.parse(Helper.decrypt(item));
		}
	
	})
	
	globalMem.getItem("extensionsettings",function(item){
	
		if("" != item && null != item && undefined !=item){
			
			storage.extensionsettings = JSON.parse(Helper.decrypt(item));
		}
		
	})
	
	

		
	},
	init : function () {

	storage.sync()
	/*
		if (localStorage["autologinsites"] == undefined || localStorage["autologinsites"] == "") {		
		
			localStorage["autologinsites"] = []
		} else
			autologinsites = JSON.parse(Helper.decrypt(localStorage["autologinsites"]));
			
			*/

	}
}
