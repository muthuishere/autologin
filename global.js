

var globalAutologinHandler = {
	doc:null ,
	initialized:false,
	autologinList:null,	
	autologinXMLList:null,
	lastloggedInDomain:null,	
	lastloggedInTimeinMilliseconds:0,
	blacklistDomains:new Array(),
	

	
ismatchURL:function(currentURL,elemname){
		

docxml=globalAutologinHandler.autologinXMLList;
	
		try{


var divs = docxml.getElementsByTagName("site"), i=divs.length;
  
  if(i == 0)
	  return false;

while (i--) {
			
		
		iurl=globalAutologinHandler.getXMLElementval(divs[i],elemname);
		
		if(globalAutologinHandler.getdomainName(currentURL) == globalAutologinHandler.getdomainName(iurl)){
					//alert(divs[i].url)
						  return divs[i];
		}
						  

		}

		 }catch(exception){
			 
			alert("Issue" + exception) 

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
  

  var curdomainName=globalAutologinHandler.getdomainName(curlocation)
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
  var curdomainName=globalAutologinHandler.getdomainName(curlocation)
  var curTimeinMs=Date.now()
  globalAutologinHandler.lastloggedInDomain=curdomainName
  globalAutologinHandler.lastloggedInTimeinMilliseconds=curTimeinMs;
  
  console.log("Updating Success Login for domain" + globalAutologinHandler.lastloggedInDomain + " at time" + globalAutologinHandler.lastloggedInTimeinMilliseconds)
  
  
  },
  
   canInjectURL: function(curlocation) {
   
   if(globalAutologinHandler.autologinList == null){
			
		  return false;
	  }
  
  
    var curdomainName=globalAutologinHandler.getdomainName(curlocation)
	if(globalAutologinHandler.getXmlObjectForPage(curlocation) != false &&  globalAutologinHandler.blacklistDomains.indexOf(curdomainName) == -1 )  {
	
	
	return true
	
		
		
	
	}
	if(globalAutologinHandler.blacklistDomains.indexOf(curdomainName) != -1)
		console.log("Blacklisted domain" + curdomainName)
	
	 return false;
	
	
   },
  
  
	logmessage:function(aMessage) {


//  alert(aMessage)

console.log(aMessage)

	
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
  globalAutologinHandler.logmessage("getResposnseasJSON" + i );
  if(i == 0)
	  return null;
	  

while (i--) {
	
	 var partner= {}; 
partner.url=globalAutologinHandler.getXMLElementval(divs[i],"url");

	  partner.loginurl=globalAutologinHandler.getXMLElementval(divs[i],"loginurl");
	 // partner.username=globalAutologinHandler.getXMLElementval(divs[i],"username");
	
		   partner.password=globalAutologinHandler.getXMLElementval(divs[i],"password");
	  partner.userelement=globalAutologinHandler.getXMLElementval(divs[i],"userelement");
	  partner.pwdelement=globalAutologinHandler.getXMLElementval(divs[i],"pwdelement");
	  
	  
	  partner.btnelement=globalAutologinHandler.getXMLElementval(divs[i],"btnelement");
	  partner.formelement=globalAutologinHandler.getXMLElementval(divs[i],"formelement");
	   
		jsonresp.push(partner);
//alert(globalAutologinHandler.dump(partner) );
}

dummyresp=JSON.stringify(jsonresp);

globalAutologinHandler.autologinList=dummyresp;

    globalAutologinHandler.logmessage(dummyresp);

		return true;  
		 }catch(exception){
			 
			alert("decode issue" + exception) 
			return null;
		 }



	},
	loadXMLDoc:function(dname) { 


	  xhttp=new XMLHttpRequest(); 

	xhttp.open("GET",dname,false); 
	xhttp.send(); 
	
	globalAutologinHandler.updateResponse( xhttp.responseXML)
	}, 
	servercallback:function(flgError,req){
		
		if(flgError == 1){
			alert(req);
			return;
		}
//	alert(req.responseText);
//return req.responseText
		globalAutologinHandler.updateResponse(req.responseXML)
		
		},	
			
	


getdomainName:function(str){
	var    a      = document.createElement('a');
         a.href = str;
return a.hostname

	 //return str.replace(/\/+$/, '');
}
  

	 
	
};

globalAutologinHandler.loadXMLDoc(chrome.extension.getURL('autologin.xml'))

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete" && globalAutologinHandler.canInjectURL(tab.url)) {
        chrome.tabs.executeScript(tabId, {file:"autoLogin.js"}, function() {
            //script injected
        });
    }
});



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
				
				
	 if (request.action == "cansubmit"){
	
	
	var flgResponse=globalAutologinHandler.canSubmit(sender.tab.url)
	
	if(flgResponse == true)
		globalAutologinHandler.updateSuccessLogin(sender.tab.url)
		
	sendResponse({actionresponse: flgResponse});
	
	
	}else if (request.action == "success"){
	
	globalAutologinHandler.updateSuccessLogin(sender.tab.url)
	sendResponse({actionresponse: "success"});
	}
     
  });