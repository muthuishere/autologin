

var globalAutologinHandler = {
	doc:null ,
	initialized:false,
	autologinList:null,	
	autologinXMLList:null,
	lastloggedInDomain:null,	
	lastloggedInTimeinMilliseconds:0,
	blacklistDomains:new Array(),
	loggedIn:true,
	
	
	
	addAutoLoginInfo:function(autoLoginInfo){
	
	var rawxml=""
	console.log("addAutoLoginInfo")
	if( localStorage["autologinxml"] == undefined  ||  localStorage["autologinxml"] == "")
		rawxml="<root></root>"
	else
		rawxml=Helper.decrypt(localStorage["autologinxml"])
	
	
	
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
  
  console.log("Updating Success Login for domain" + globalAutologinHandler.lastloggedInDomain + " at time" + globalAutologinHandler.lastloggedInTimeinMilliseconds)
  
  
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
globalAutologinHandler.loadDoc()

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete" ){
	
	var status=globalAutologinHandler.canInjectURL(tab.url)
		if(  status == 0) {
			chrome.tabs.executeScript(tabId, {file:"scripts/autoLogin.js"}, function() {
				//script injected
			});
		}else if( status == 1) {
		
			var jscode='var extnid="'+ chrome.extension.getURL("/") + '"';
		
		console.log("extn id" +jscode)
			chrome.tabs.executeScript(tabId, {code:jscode,allFrames :false}, function() {
						//script injected
						chrome.tabs.executeScript(tabId, {file:"scripts/autoLoginCapture.js"}, function() {
							//script injected
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
			
	
	
	}else if (request.action == "updatePromptAtStartup"){
	
			
			
			localStorage["promptrequired"]= request.promptrequired;
			
				sendResponse({"valid":true });
			
	
	
	} else if (request.action == "hasCredential"){
	
			
			
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
	
	
	}else if (request.action == "success"){
	
	globalAutologinHandler.updateSuccessLogin(sender.tab.url)
	sendResponse({actionresponse: "success"});
	}
     
  });
  
  
  
// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {

	PageActionHandler.handleClick(tab);

});

