
// Import the page-mod API
var pageMod = require("sdk/page-mod");
// Import the self API
var self = require("sdk/self");
 
// Create a page mod
// It will run a script whenever a ".org" URL is loaded
// The script replaces the page contents with a message
pageMod.PageMod({
  include: "*.org",
  contentScriptFile: self.data.url("./scripts/jquery-1.7.min.js"),
  contentScript: '$("body").html("<h1>Page matches ruleset</h1>");'
   contentScriptFile: data.url("./scripts/element-getter.js"),
  onAttach: function(worker) {
    
    worker.port.on("observe", function(request) {
      handlerequest(request,worker);
    });
	
});




self.port.on("observe", function(request) {


  document.body.innerHTML = "<h1>" + message + "</h1>";
});


function sendResponse(worker,evt){


}

  function handlerequest(request,worker) {
    // console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");
				
				
	 if (request.action == "captureautologin"){
	
			PageActionHandler.setCaptureReady(sender.tab)
			chrome.pageAction.show(sender.tab.id);
			
	
	
	}else if (request.action == "getData"){
	
	
			var rawxml= Helper.decrypt(localStorage["autologinxml"] );
			
	
	  worker.port.emit("clientobserver", {"xml": rawxml});
	
	}else if (request.action == "injectAutoLogin"){
	
	
			chrome.tabs.executeScript(sender.tab.id, {file:"scripts/autoLogin.js"}, function() {
					//script injected
				});
			
		
	  worker.port.emit("clientobserver", {"valid": true});
	
	
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
	
	
	}else if (request.action == "success"){
	
	globalAutologinHandler.updateSuccessLogin(sender.tab.url)
	sendResponse({actionresponse: "success"});
	}
     
  }