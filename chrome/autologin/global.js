


var globalAutologinHandler = {
	doc:null ,
	initialized:false,
	autologinList:null,	
	autologinXMLList:null,
	lastloggedInDomain:null,	
	lastloggedInTimeinMilliseconds:0,
	
	blacklistDomains:new Array(),
	loggedIn:true,
	test:function(){
		
		var rawxml='<root><site authtype="form"><url>http://localhost:9999/auto.html</url> <loginurl>http://localhost:9999/auto.html</loginurl><enabled>true</enabled><elements><element><event/><xpath>//input[contains(@id,"Username") or contains(@name,"Username")]</xpath><value>example@gmail.com</value><type>text</type></element><element><event/><xpath>//input[contains(@id,"Password") or contains(@name,"Password")]</xpath><value>123456</value><type>password</type></element><element><event>click</event><xpath>//*[contains(@id,"mybutton") or contains(@name,"mybutton")]</xpath><value></value><type>button</type></element><element><event>submit</event><xpath>//*[contains(@id,"_TCSLoginUserForm") or contains(@name,"_TCSLoginUserForm")]</xpath><value></value><type>form</type></element></elements></site><site authtype="form"><url>https://github.com/login</url> <loginurl>https://github.com/login</loginurl><enabled>true</enabled><elements><element><event/><xpath>//input[contains(@id,"login") or contains(@name,"login")]</xpath><value>muthuishere@gmail.com</value><type>text</type></element><element><event/><xpath>//input[contains(@id,"password") or contains(@name,"password")]</xpath><value>Gangster1</value><type>password</type></element><element><event>click</event><xpath>//*[contains(@id,"commit") or contains(@name,"commit")]</xpath><value></value><type>button</type></element></elements></site><site authtype="form"><url>http://127.0.0.1:9999/auto.html</url> <loginurl>http://127.0.0.1:9999/auto.html</loginurl><enabled>true</enabled><elements><element><event/><xpath>//input[contains(@id,"Username") or contains(@name,"Username")]</xpath><value>user</value><type>text</type></element><element><event/><xpath>//input[contains(@id,"Password") or contains(@name,"Password")]</xpath><value>password</value><type>password</type></element><element><event>click</event><xpath>//*[contains(@id,"mybutton") or contains(@name,"mybutton")]</xpath><value></value><type>button</type></element><element><event>submit</event><xpath>//*[contains(@id,"_TCSLoginUserForm") or contains(@name,"_TCSLoginUserForm")]</xpath><value></value><type>form</type></element></elements></site></root>'
		
		localStorage["autologinxml"]=Helper.encrypt(rawxml)
		
	},

		migrate:function(){
		
		if( localStorage["autologinxml"] == undefined  ||  localStorage["autologinxml"] == "")
			return
		
		
		var rawxml=Helper.decrypt(localStorage["autologinxml"])
		
			if(rawxml.indexOf("<elements>") > 0){
				
				console.log("XML already migrated")
				return 
			}
			
		
	
		  var parser = new DOMParser();
            var docxml = parser.parseFromString(rawxml, "text/xml");
			
			var legacyjson = new Array();
			var migratedXML = "<root>";
			
			var divs = docxml.getElementsByTagName("site"), i=divs.length;
			  //globalAutologinHandler.logmessage("getResposnseasJSON" + i );
			  if(i == 0)
				  return null;
	  

			while (i--) {
			
				var partner={}
				partner.url=globalAutologinHandler.getXMLElementval(divs[i],"url");

				  partner.loginurl=globalAutologinHandler.getXMLElementval(divs[i],"loginurl");
				 partner.username=globalAutologinHandler.getXMLElementval(divs[i],"username");
				
					   partner.password=globalAutologinHandler.getXMLElementval(divs[i],"password");
				  partner.userelement=globalAutologinHandler.getXMLElementval(divs[i],"userelement");
				  partner.pwdelement=globalAutologinHandler.getXMLElementval(divs[i],"pwdelement");
				  
				  
				  partner.btnelement=globalAutologinHandler.getXMLElementval(divs[i],"btnelement");
				  partner.enabled=globalAutologinHandler.getXMLElementval(divs[i],"enabled");
				  partner.formelement=globalAutologinHandler.getXMLElementval(divs[i],"formelement");
				   
				   	if(partner.url == "")
					continue;
				
				
				//migratedXML  += "<site authtype='form'>";
				migratedXML  += '<site authtype="form">';
				migratedXML  += "<url>"+partner.url+"</url> <loginurl>"+partner.loginurl+"</loginurl><enabled>"+ partner.enabled +"</enabled><elements>"
				
				
				//Uselement
				migratedXML  += "<element>"
				
				migratedXML  += "<event/>"
				
			migratedXML  += '<xpath>' + '//input[contains(@id,"'+  partner.userelement +'") or contains(@name,"'+  partner.userelement +'")]' +'</xpath>';
			//migratedXML  += "<xpath>" + "//input[contains(@id,'"+  partner.userelement +"') or contains(@name,'"+  partner.userelement +"')]" +"</xpath>";
				migratedXML  += "<value>" + partner.username  +"</value>"
				migratedXML  += "<type>text</type>"
				
				migratedXML  += "</element>"
				
				//Password
				migratedXML  += "<element>"				
				migratedXML  += "<event/>"				
				migratedXML  += '<xpath>' + '//input[contains(@id,"'+  partner.pwdelement +'") or contains(@name,"'+  partner.pwdelement +'")]' +'</xpath>';
				migratedXML  += "<value>" + partner.password  +"</value>"
				migratedXML  += "<type>password</type>"				
				migratedXML  += "</element>"
				
				//Button
				if(partner.btnelement !== ""){
					migratedXML  += "<element>"	
					
					migratedXML  += "<event>click</event>"				
					migratedXML  += '<xpath>' + '//*[contains(@id,"'+  partner.btnelement +'") or contains(@name,"'+  partner.btnelement +'")]' +'</xpath>';
					migratedXML  += "<value></value>"
					migratedXML  += "<type>button</type>"				
					migratedXML  += "</element>"
					
				}
				//form
				if(partner.formelement !== ""){
					migratedXML  += "<element>"	
					
					migratedXML  += "<event>submit</event>"				
					migratedXML  += '<xpath>' + '//*[contains(@id,"'+  partner.formelement +'") or contains(@name,"'+  partner.formelement +'")]' +'</xpath>';
					migratedXML  += "<value></value>"
					migratedXML  += "<type>form</type>"				
					migratedXML  += "</element>"
					
				}
				
			
				
				
				migratedXML  += "</elements>"
				migratedXML  += "</site>";
			}
			migratedXML  += "</root>";

		//Change old raw xml
		console.log(migratedXML)
		localStorage["autologinxml"]=Helper.encrypt(migratedXML)
	},
	
	printraw:function(){
		
		var rawxml=Helper.decrypt(localStorage["autologinxml"])
		console.log(rawxml)
	},
	addAutoLoginElements:function(obj){
	


				
		console.log(obj)
		var autoLoginXmlInfo=" <site authtype='form'> <url>"+obj.url+"</url> <loginurl>"+obj.loginurl+"</loginurl><enabled>true</enabled><elements>"
		
	var elems=obj.elements
			for (index = 0, len = elems.length; index < len; ++index) {
				autoLoginXmlInfo += "<element>"
				
				 autoLoginXmlInfo += "<event>"+ elems[index].event +"</event>"
				 autoLoginXmlInfo += "<xpath>"+ elems[index].xpath +"</xpath>"
				 autoLoginXmlInfo += "<value>"+ elems[index].value +"</value>"
				 autoLoginXmlInfo += "<type>"+ elems[index].type +"</type>"
				 
				 
				autoLoginXmlInfo += "</element>"
				
			}
			autoLoginXmlInfo += "</elements></site>"
			

	
	
	var autoLoginInfo=autoLoginXmlInfo
	var rawxml=""
	
	if( localStorage["autologinxml"] == undefined  ||  localStorage["autologinxml"] == "")
		rawxml="<root></root>"
	else
		rawxml=Helper.decrypt(localStorage["autologinxml"])
	
	
	//console.log("Start addAutoLoginInfo with XML " + rawxml)	
	
	//Set Autologin List first
	  var parser = new DOMParser();
     var docxml = parser.parseFromString(rawxml, "text/xml");
	globalAutologinHandler.updateResponse( docxml)
	
	//Remove from Autologin Object Autologin List first
	var removeResponse=globalAutologinHandler.removeSite(autoLoginInfo)
	
	//Site removed , Update XML
	if(removeResponse == true){
	
	  var oSerializer = new XMLSerializer();
	rawxml = oSerializer.serializeToString(globalAutologinHandler.autologinXMLList);
		// console.log("After removal" + rawxml)					
							
	}
	
		
	rawxml=rawxml.replace("</root>",autoLoginInfo + "</root>");
		
		
		localStorage["autologinxml"]= Helper.encrypt(rawxml);
		globalAutologinHandler.loadDoc();
	
	},
	addAutoLoginInfo:function(autoLoginInfo){
	
	var rawxml=""
	
	if( localStorage["autologinxml"] == undefined  ||  localStorage["autologinxml"] == "")
		rawxml="<root></root>"
	else
		rawxml=Helper.decrypt(localStorage["autologinxml"])
	
	
	//console.log("Start addAutoLoginInfo with XML " + rawxml)	
	
	//Set Autologin List first
	  var parser = new DOMParser();
     var docxml = parser.parseFromString(rawxml, "text/xml");
	globalAutologinHandler.updateResponse( docxml)
	
	//Remove from Autologin Object Autologin List first
	var removeResponse=globalAutologinHandler.removeSite(autoLoginInfo)
	
	//Site removed , Update XML
	if(removeResponse == true){
	
	  var oSerializer = new XMLSerializer();
	rawxml = oSerializer.serializeToString(globalAutologinHandler.autologinXMLList);
		// console.log("After removal" + rawxml)					
							
	}
	
		
	rawxml=rawxml.replace("</root>",autoLoginInfo + "</root>");
		
		
		localStorage["autologinxml"]= Helper.encrypt(rawxml);
		globalAutologinHandler.loadDoc();
	
	},
ismatchURL:function(currentURL,elemname){
		

docxml=globalAutologinHandler.autologinXMLList;
	
		try{


var divs = docxml.getElementsByTagName("site"), i=divs.length;
  
  if(i == 0)
	  return false;

while (i--) {
			
		
		iurl=globalAutologinHandler.getXMLElementval(divs[i],elemname);
		
		if(Utils.getdomainName(currentURL) == Utils.getdomainName(iurl)){
					//alert(divs[i].url)
						  return divs[i];
		}
						  

		}

		 }catch(exception){
			 
			console.log("Issue" + exception) 

		 }

			return false;

	},

getXmlObjectForPage: function(currentURL) {
	  
	  
	 
	  if(globalAutologinHandler.autologinList == null){
	  	globalAutologinHandler.logmessage("autologinList null");
		  return false;
	  }

	var flgReturn=globalAutologinHandler.ismatchURL(currentURL,"loginurl");
	  return flgReturn;
	  
  },
  
 
   startsWith:function (data,str) {
        return !data.indexOf(str);
    },


   jq: function(formulae) {
	    $mb = jQuery.noConflict();		
	   return $mb(formulae, document);
   },
     hasalreadyloggedin: function(formulae) {
	   
	   if(formulae == "")
	   		return false;
	   

try{	  
	  var elemhtml=globalAutologinHandler.jq(formulae);
	  
	  if (null != elemhtml.html())
	  	return true;
	  
}catch(exception){
	
}

return false;
	
 
  
  },
  canSubmit:function(curlocation) {
  

  var curdomainName=Utils.getdomainName(curlocation)
	var curTimeinMs=Date.now()
	
	var timedifference=curTimeinMs -  globalAutologinHandler.lastloggedInTimeinMilliseconds
	var MAX_ALLOWED_TIME_DIFFERENCE=60 *1000
	
  if(null != globalAutologinHandler.lastloggedInDomain  && curdomainName == globalAutologinHandler.lastloggedInDomain   &&  timedifference <  MAX_ALLOWED_TIME_DIFFERENCE){
  globalAutologinHandler.blacklistDomains.push(curdomainName)
  return false
  }
  return true
  
  },
  updateSuccessLogin: function(curlocation) {
  var curdomainName=Utils.getdomainName(curlocation)
  var curTimeinMs=Date.now()
  globalAutologinHandler.lastloggedInDomain=curdomainName
  globalAutologinHandler.lastloggedInTimeinMilliseconds=curTimeinMs;
  
  //console.log("Updating Success Login for domain" + globalAutologinHandler.lastloggedInDomain + " at time" + globalAutologinHandler.lastloggedInTimeinMilliseconds)
  
  
  },
  
  
  
   retriveSiteInfo: function(curlocation) {
   
   var result={}
   result.status=1;
   result.info=null;
   
   if(globalAutologinHandler.autologinList == null){
			
			
		  return result;
	  }
 
  
    var curdomainName=Utils.getdomainName(curlocation)
	var curXMLObject=globalAutologinHandler.getXmlObjectForPage(curlocation) 
	
	var flgAutologinEnabled=true;
	
	if(curXMLObject != false){
	var enabledautologinValue =  globalAutologinHandler.getXMLElementval(curXMLObject,"enabled"); 
	
	if(null == enabledautologinValue || ""== enabledautologinValue || enabledautologinValue == "true")
		flgAutologinEnabled=true
	else
		flgAutologinEnabled=false
	}
	if(curXMLObject != false &&  flgAutologinEnabled == true && globalAutologinHandler.blacklistDomains.indexOf(curdomainName) == -1 )  {
	
		result.status=0;
		result.info=curXMLObject
		return result;
		
		
	
	}
	if(globalAutologinHandler.blacklistDomains.indexOf(curdomainName) != -1){
		
		console.log("Blacklisted domain" + curdomainName)	
		result.status=-1;
		//return result;
		
	
	}
	
	if(flgAutologinEnabled == false){
	
		console.log("Disabled domain" + curdomainName)	
		result.status=-1;
		//return result;
		
	}
	
	return result;
	
	
   },
  // returns 
  //0 - If Script can be injected
  //-1 - If URL is blacklisted
  //1- for remaining status
   canInjectURL: function(curlocation) {
   
   if(globalAutologinHandler.autologinList == null){
			
		  return 1;
	  }
 
  
    var curdomainName=Utils.getdomainName(curlocation)
	var curXMLObject=globalAutologinHandler.getXmlObjectForPage(curlocation) 
	
	var flgAutologinEnabled=true;
	
	if(curXMLObject != false){
	var enabledautologinValue =  globalAutologinHandler.getXMLElementval(curXMLObject,"enabled"); 
	
	if(null == enabledautologinValue || ""== enabledautologinValue || enabledautologinValue == "true")
		flgAutologinEnabled=true
	else
		flgAutologinEnabled=false
	}
	if(curXMLObject != false &&  flgAutologinEnabled == true && globalAutologinHandler.blacklistDomains.indexOf(curdomainName) == -1 )  {
	
	
	return 0;
	
		
		
	
	}
	if(globalAutologinHandler.blacklistDomains.indexOf(curdomainName) != -1){
		
		console.log("Blacklisted domain" + curdomainName)	
		return -1;
	
	}
	
	if(flgAutologinEnabled == false){
	
		console.log("Disabled domain" + curdomainName)	
		return -1;
	}
	
	return 1;
	
	
   },
  
  
	logmessage:function(aMessage) {


//  alert(aMessage)

//console.log(aMessage)

	
},



removeSite:function(autologinRawXML){
		
   var parser = new DOMParser();
   var autologinObject = parser.parseFromString(autologinRawXML, "text/xml");
   
   var currentURL= globalAutologinHandler.getXMLElementval(autologinObject,"loginurl")
   


	
		try{


var divs = globalAutologinHandler.autologinXMLList.getElementsByTagName("site"), i=divs.length;
  
  if(i == 0)
	  return false;

while (i--) {
			
		
		iurl=globalAutologinHandler.getXMLElementval(divs[i],"loginurl");
		
		if(Utils.getdomainName(currentURL) == Utils.getdomainName(iurl)){
					//alert(divs[i].url)
						 // return divs[i];
						 
						 //remove site
						  divs[i].parentNode.removeChild(divs[i]);
						   
		
						  return true;
						  
		}
						  

		}

		 }catch(exception){
			 
			console.log("Issue" + exception) 

		 }

			return false;

	},
	
	getXMLElementval:function(node,elemName){
		
		try{
			val= node.getElementsByTagName(elemName)[0].firstChild.nodeValue;
			return val
		}catch(exception){
			return "";	
		}
	},
	updateResponse:function(docxml){
		
var dummyresp='';

globalAutologinHandler.autologinXMLList=docxml;
		var jsonresp = new Array();


		try{

  globalAutologinHandler.logmessage(docxml );
  console.log(docxml.innerHTML)
var divs = docxml.getElementsByTagName("site"), i=divs.length;
console.log(i)
  //globalAutologinHandler.logmessage("getResposnseasJSON" + i );
  if(i == 0)
	  return null;
	  

while (i--) {
	
	 var partner= {}; 
partner.url=globalAutologinHandler.getXMLElementval(divs[i],"url");

	  partner.loginurl=globalAutologinHandler.getXMLElementval(divs[i],"loginurl");
	   partner.enabled=globalAutologinHandler.getXMLElementval(divs[i],"enabled");
	  partner.fields =[];
	  
	  var elems = divs[i].getElementsByTagName("element");
	  
	  for( k=0;k< elems.length ;k++){
		  
		  var field={}
		 field.xpath= globalAutologinHandler.getXMLElementval(elems[k],"xpath");
		 field.type= globalAutologinHandler.getXMLElementval(elems[k],"type");
		 field.value= globalAutologinHandler.getXMLElementval(elems[k],"value");
		 field.event= globalAutologinHandler.getXMLElementval(elems[k],"event");
		 partner.fields.push(field)
	  }
	  
	 
	  
	   
		jsonresp.push(partner);

}

console.log(jsonresp)

dummyresp=JSON.stringify(jsonresp);

globalAutologinHandler.autologinList=dummyresp;

    //globalAutologinHandler.logmessage(dummyresp);

		return true;  
		 }catch(exception){
			 
			console.log("decode issue" + exception) 
			return null;
		 }



	},
	updateResponseold:function(docxml){
		
var dummyresp='';

globalAutologinHandler.autologinXMLList=docxml;
		var jsonresp = new Array();


		try{

  globalAutologinHandler.logmessage(docxml );
var divs = docxml.getElementsByTagName("site"), i=divs.length;
  //globalAutologinHandler.logmessage("getResposnseasJSON" + i );
  if(i == 0)
	  return null;
	  

while (i--) {
	
	 var partner= {}; 
partner.url=globalAutologinHandler.getXMLElementval(divs[i],"url");

	  partner.loginurl=globalAutologinHandler.getXMLElementval(divs[i],"loginurl");
	 partner.username=globalAutologinHandler.getXMLElementval(divs[i],"username");
	
		   partner.password=globalAutologinHandler.getXMLElementval(divs[i],"password");
	  partner.userelement=globalAutologinHandler.getXMLElementval(divs[i],"userelement");
	  partner.pwdelement=globalAutologinHandler.getXMLElementval(divs[i],"pwdelement");
	  
	  
	  partner.btnelement=globalAutologinHandler.getXMLElementval(divs[i],"btnelement");
	  partner.enabled=globalAutologinHandler.getXMLElementval(divs[i],"enabled");
	  partner.formelement=globalAutologinHandler.getXMLElementval(divs[i],"formelement");
	   
		jsonresp.push(partner);

}

dummyresp=JSON.stringify(jsonresp);

globalAutologinHandler.autologinList=dummyresp;

    //globalAutologinHandler.logmessage(dummyresp);

		return true;  
		 }catch(exception){
			 
			console.log("decode issue" + exception) 
			return null;
		 }



	},
	loadXMLDoc:function(dname) { 


	  xhttp=new XMLHttpRequest(); 

	xhttp.open("GET",dname,false); 
	xhttp.send(); 
	
	
	localStorage["autologinxml"] =Helper.encrypt(xhttp.responseText);
	globalAutologinHandler.loadDoc();
	}, 
	loadDoc:function() { 
	
	
	if( localStorage["autologinxml"] == undefined  ||  localStorage["autologinxml"] == "")
	return;
	
			var rawxml= Helper.decrypt(localStorage["autologinxml"] );
			
			
			  var parser = new DOMParser();
            var docxml = parser.parseFromString(rawxml, "text/xml");
	
	globalAutologinHandler.updateResponse( docxml)
	
	
	}, 
	try_count : 0,
	last_request_id:null,
	last_tab_id:null,
	retrieveCredentials : function (status) {
		var url = status.url;
		console.log("auth required")
		console.log(status)
		
		//TODO check url has authorization credentials in storage or user has set authorization credentials
		
		 var  siteInfo = globalAutologinHandler.retriveSiteInfo(url)
		var domainxml=siteInfo.info 
		
		var curdomainName=Utils.getdomainName(url)
		
		console.log(domainxml)
		
		if (domainxml && domainxml.getAttribute("authtype") == "basic") {

		var credential = {};
		
		 var elems = divs[i].getElementsByTagName("element");
				  
				  for( k=0;k< elems.length ;k++){
					  
					  var field={}
					 field.xpath= autoLoginOptions.getXMLElementval(elems[k],"xpath");
					 field.type= autoLoginOptions.getXMLElementval(elems[k],"type");
					
					 field.value= autoLoginOptions.getXMLElementval(elems[k],"value");
					
					  if(field.type === "password"){
						 credential.password= field.value
						
					 }
					 
					  if(field.type === "text"){
						 credential.username= field.value
						
					 }
					
				  }
		//domainxml get username password
			
			//credential.username = "mnavaneethakrishnan@corpuk.net"
				//credential.password = "July#2015"

				if (status.requestId == globalAutologinHandler.last_request_id && status.tabId == globalAutologinHandler.last_tab_id) {
					++globalAutologinHandler.try_count;
				} else {
					globalAutologinHandler.try_count = 0;
				}

				if (globalAutologinHandler.try_count < 2) {

					console.log("try_count" + globalAutologinHandler.try_count)
					globalAutologinHandler.last_request_id = status.requestId;
					globalAutologinHandler.last_tab_id = status.tabId;

					//cb(" ", success_color, credential, status.tabId);
					console.log("sent credentials" + url)
					 globalAutologinHandler.lastloggedInDomain=curdomainName
					return {
						authCredentials : {
							username : credential.username,
							password : credential.password
						}
					};

				} else {
					globalAutologinHandler.lastloggedInDomain=""
					console.log("try_count exceeded")
				}
		}

		return {};
	},
	authcallback:null,
	authretrycount:0,
	
	initExtension:function() { 
	
	//validate and set logged in
	var credential=localStorage["credential"]
	var promptrequired=localStorage["promptrequired"]
	
	if(undefined == credential || null == credential || undefined == promptrequired || null == promptrequired ||  promptrequired === 'false')
		globalAutologinHandler.loggedIn=true
	else
			globalAutologinHandler.loggedIn=false
			
			chrome.webRequest.onAuthRequired.addListener(function(details, callback){
				// Prompt the user to enter credentials. Call 

					globalAutologinHandler.authcallback=callback;
					/*
						chrome.tabs.insertCSS(null, {file:"scripts/autoLoginCredentials.js"}, function() {
									//script injected
								});
						*/
						
				chrome.tabs.executeScript(null, {file:"scripts/autoLoginAuth.js"}, function() {
					
				});
					
					


				/* chrome.windows.create({'url': 'auth.html', 'type': 'popup'}, function(window) {
					
						//callback({authCredentials: {username: xxx, password: xxx}});		
						});
				*/
				//
				// when they are ready.
			}, {urls : ["<all_urls>"]}, ['asyncBlocking']);


		//	chrome.webRequest.onAuthRequired.addListener(globalAutologinHandler.retrieveCredentials, {
//			urls : ["<all_urls>"]
//		}, ["blocking","responseHeaders"]);
		
		// chrome.webRequest.onBeforeRequest.addListener(function(details){
			// console.log("received onBeforeRequest")
			// console.log(details)
			
		// }, {
			// urls : ["<all_urls>"]
		// }, ["blocking"]);
		
		// chrome.webRequest.onHeadersReceived.addListener(function(details){
			// console.log("received onHeadersReceived")
			// console.log(details)
			
		// },
			// {"urls":["*://*/*"]},
			// ["responseHeaders"]);
		// chrome.webRequest.onSendHeaders.addListener(function(details) {
			
			// //check details.url is not stored already , 
					// //if its stored validate user password
					// console.log(" received onSendHeaders")
			// console.log(details)
					
			// var headers=""
			
				// //console.log(details.url, details.requestHeaders);
				// for(var i = 0; i < details.requestHeaders.length; ++i) {
					// var header = details.requestHeaders[i];
					// headers = headers +  "," + header.name 
					// if(header.name == "Authorization") {
						// // this is my quick effort for parsing the auth value
						// // formatted like "Basic [base64 of 'user:pass']"
						// var b64val = header.value.split(" ")[1];
						// var credArray = atob(b64val).split(":");
						// var user = credArray[0];
						// var pass = credArray[1];

						// console.log("Basic Auth")
						// console.log(user)
						// console.log(pass)
						
						
						// // now do something with user/pass
					// }
				// }
				// console.log(headers)
			// },
			// {"urls":["*://*/*"]},
			// ["requestHeaders"]);
			
			console.log("globalAutologinHandler.loggedIn" +globalAutologinHandler.loggedIn);
			
	globalAutologinHandler.loadDoc( )
	
	
	}
	
			
	



  

	 
	
};

var Utils={

	getdomainName:function(str){
			var    a      = document.createElement('a');
			 a.href = str;
			return a.hostname
	}

};


  var PageActionHandler = {
  
  
	setCaptureInProgress:function(tab){
		
		var domainName=Utils.getdomainName(tab.url)
		
		chrome.pageAction.setIcon({tabId:tab.id,path:"images/autologin-19-capture.png"} , function() {
		
				chrome.pageAction.setTitle({tabId :tab.id,title:"Capture in progress for" + domainName})
				
				chrome.tabs.executeScript(tab.id, {code:"initAutoLoginCapture()",allFrames :false}, function() {
						//script injected
				});
		
		})
		
	},
	setCaptureReady:function( tab){
		
		var domainName=Utils.getdomainName(tab.url)
		chrome.pageAction.setIcon({tabId :tab.id,path:"images/autologin-19.png"} , function() {
		
		
				chrome.pageAction.setTitle({tabId :tab.id,title:"Add AutoLogin for " +domainName })
				
				
				chrome.tabs.executeScript(tab.id, {code:"removeAutoLoginCapture()",allFrames :false}, function() {
				//script injected
				});
				
		
		})
		
	},
	handleClick:function(tab){
	

		chrome.pageAction.getTitle({tabId :tab.id}, function (result){
			if(result.indexOf("Add AutoLogin") >=0){
				//
				PageActionHandler.setCaptureInProgress(tab)
			}else{
				PageActionHandler.setCaptureReady(tab)
			
			}

		});

	

	
	}
  
  };

//globalAutologinHandler.loadXMLDoc(chrome.extension.getURL('autologin.xml'))

globalAutologinHandler.initExtension()
globalAutologinHandler.printraw()

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
 
    if(tab.url !== undefined && changeInfo.status == "complete" ){
	
	 if(tab.url.indexOf("chrome") == 0  ){
	  
			return;
		}
  
  var  siteInfo = globalAutologinHandler.retriveSiteInfo(tab.url)
	var status=siteInfo.status
		if(  status == 0) {
		
			if(globalAutologinHandler.loggedIn==false){
			/*
			chrome.tabs.insertCSS(null, {file:"scripts/autoLoginCredentials.js"}, function() {
						//script injected
					});
			*/
	chrome.tabs.executeScript(tabId, {file:"scripts/autoLoginCredentials.js"}, function() {
						//script injected
					});
					
	
					
						
					

				
				
			}else{
				chrome.tabs.executeScript(tabId, {file:"scripts/autoLogin.js"}, function() {
					//script injected
				});
			}
		}else if( status == 1) {
		
		//console.log("got complete")
			var jscode='var extnid="'+ chrome.extension.getURL("/") + '"';
		
		
			chrome.tabs.executeScript(tabId, {code:jscode,allFrames :false}, function() {
						//script injected
						chrome.tabs.executeScript(tabId, {file:"scripts/autoLoginCapture.js"}, function() {
							//script injected
						//	console.log("got autoLoginCapture" +tabId)
						});
			
				});
				
				
			
		}
	}
});



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");
				
				
	 if (request.action == "captureautologin"){
	
			PageActionHandler.setCaptureReady(sender.tab)
			chrome.pageAction.show(sender.tab.id);
			 // Return nothing to let the connection be cleaned up.
		  sendResponse({});
	
	
	}else if (request.action == "getData"){
	
	
			var rawxml= Helper.decrypt(localStorage["autologinxml"] );
			
	sendResponse({"xml": rawxml});
	
	
	}else if (request.action == "injectAutoLogin"){
	
	
			chrome.tabs.executeScript(sender.tab.id, {file:"scripts/autoLogin.js"}, function() {
					//script injected
				});
			
		sendResponse({"valid":true});
	
	
	}else if (request.action == "validateCredential"){
	
			var userCredential=request.info;
			
			var savedCredential= Helper.decrypt(localStorage["credential"] );
			
	
			if(userCredential == savedCredential){
			
			globalAutologinHandler.loggedIn=true
			
			sendResponse({"valid":true});
			}
				
			else{
			globalAutologinHandler.loggedIn=false;
				sendResponse({"valid":false });
				}
	
	
	}else if (request.action == "addCredential"){
	
			var credential=request.info;
			
			localStorage["credential"]= Helper.encrypt(credential);
			
				sendResponse({"valid":true });
			
	
	
	}else if (request.action == "updateCredential"){
	
			var credential=request.currentCredential;
			
			var newCredential=request.newCredential;
			
			var savedCredential= Helper.decrypt(localStorage["credential"] );
			
			if(credential == savedCredential){
				localStorage["credential"]= Helper.encrypt(newCredential);
				sendResponse({"valid":"true" });
				}
			else
				sendResponse({"valid":"false" });
			
	
	
	}else if (request.action == "getPromptAtStartup"){
	
			
			promptrequired=localStorage["promptrequired"]
			
			
				sendResponse({"promptrequired":(promptrequired === 'true') });
			
	
	
	}else if (request.action == "updatePromptAtStartup"){
	
			
			
			localStorage["promptrequired"]= request.promptrequired;
			
				sendResponse({"valid":true });
			
	
	
	}else if (request.action == "hasCredential"){
	
			
			
			var savedCredential= Helper.decrypt(localStorage["credential"] );
			
			var result=(savedCredential != "")
			
				sendResponse({"valid":result});
			
	
	}else if (request.action == "refreshData"){
	
	globalAutologinHandler.loadDoc()
			
	sendResponse({});
	
	
	}else if (request.action == "cansubmit"){
	
	
	var flgResponse=globalAutologinHandler.canSubmit(sender.tab.url)
	
	if(flgResponse == true)
		globalAutologinHandler.updateSuccessLogin(sender.tab.url)
		
	sendResponse({actionresponse: flgResponse});
	
	
	}else if (request.action == "addAutoLoginInfo"){
	
	
	globalAutologinHandler.addAutoLoginInfo(request.info)
	
		
	sendResponse({});
	
	
	}else if (request.action == "addAutoLoginElements"){
	
	
	globalAutologinHandler.addAutoLoginElements(request.info)
	
		
	sendResponse({});
	
	
	}else if (request.action == "success"){
	
	globalAutologinHandler.updateSuccessLogin(sender.tab.url)
	sendResponse({actionresponse: "success"});
	}
     
  });
  
  

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
       globalAutologinHandler.migrate()
    }
});
