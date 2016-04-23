if (undefined == basicauth){

var basicauth={

	startCapture:false,
	onCaptureAutoLogin:function(startCapture){
		basicauth.startCapture=startCapture
		
	},
	init:function(){
	
	document.querySelector("input#username").focus()
	
	  chrome.runtime.sendMessage({
            action: "getauthinfo"
        }, function (response) {
		
		if(!response.valid){
			alert("Corrupt data")
			window.close();
			return
		}
			basicauth.initauth(response)
        });

		
	
	},
	initauth:function(response){
		
		
		 document.querySelector("#pagetitle").innerHTML="The Page "+response.url+" requires username & password"
		 
		 if(response.realm)
			document.querySelector("#realm").innerHTML="Sign In , The realm says " + response.realm
		else
			document.querySelector("#realm").innerHTML="Sign In "
		 
		var extnid=vAPI.getURL("/") 
		
		//autoLoginCaptureIcon.init(extnid,basicauth.onCaptureAutoLogin)
	
		 document.querySelector("#btnlogin").addEventListener('click', function(event){
		
				var data ={}
				data.cancel =false
				data.username= document.querySelector("input#username").value
				data.password=document.querySelector("input#password").value
				data.useAutologin=document.querySelector("input#chkuseautologin").checked
				
				
				chrome.extension.sendMessage({action: "basicauth",info:data}, function(response) {
						window.close()
				 });
		
		 }, false);
		 document.querySelector("#btncancel").addEventListener('click', function(event){
		
		//console.log("sending auth info cancel ")
		var data ={}
		data.cancel =true
		
		
		chrome.extension.sendMessage({action: "basicauth",info:data}, function(response) {});
		
				window.close()
		
		 }, false);

	}
	
	
}
window.addEventListener('load', basicauth.init);

window.addEventListener("beforeunload", function (event) {
  
		
		
		var data ={}
		data.cancel =true
		
		
		chrome.extension.sendMessage({action: "basicauth",info:data}, function(response) {});
		
		
});


//document.body.addEventListener("load", basicauth.init(), false);


}