
if (undefined == autoLoginCapture){



var autoLoginCapture={
	captureForm:null,	
	startCapture:false,
	disableIconURL:"",
	enableIconURL:"",
	hoverIconURL:"",
	backgroundIconURL:"",
	alreadySubmitted:false,
		
		
	init:function(){
		
	autoLoginCapture.disableIconURL=extnid +"images/capture_disable.png"
	autoLoginCapture.enableIconURL=extnid +"images/capture_enable.png"
	autoLoginCapture.hoverIconURL=extnid +"images/capture_hover.png"
	autoLoginCapture.backgroundIconURL=extnid +"images/bg.png"
	// if form has one password field and one text field and both elements are visible
	//call the autologin function to show

			var forms = document.querySelectorAll('form');

			var flgCaptured=false
			for (var i = 0, formelement; formelement = forms[i]; i++) {
				//work with element
				
				var res=autoLoginCapture.captureElementforForm(formelement)
						
						if(res){
						
						flgCaptured=true
						i=formelement.length+1;//to break
						
						break;
						}
					
				
				
			}

			if(!flgCaptured){

			//No Captured check for whole body
				autoLoginCapture.captureElementforForm(document.querySelector('body'))

			}

	},
	onCaptureAutoLogin:function(){
	
	
//console.log("on capture autologin")
	if(autoLoginCapture.startCapture == false){
	
	//Change Background url
	
	
		document.querySelector("div#autologincapture").className = "enable";;
		document.querySelector("div#autologincapture").setAttribute("title","Click to Disable Capturing Auto Login Information");
		document.querySelector("div#autologincapture").setAttribute("alt","Click to Disable Capturing Auto Login Information");
		document.querySelector("div#autologincapture").innerHTML="Click to Disable Capturing Auto Login Information";
	//	document.querySelector("a#autologincapturelink").setAttribute("Title","Click to Disable Capturing Auto Login Information");
	
	initAutoLoginCapture()
	
	
		
	//	autoLoginCapture.captureForm.addEventListener('submit', autoLoginCapture.onBeforeAutoLoginSubmit, true);
		
	autoLoginCapture.startCapture = true
	
					
					
	}else{
	
document.querySelector("div#autologincapture").className = "disable";
document.querySelector("div#autologincapture").setAttribute("title","Click to Capture Auto Login Information");
document.querySelector("div#autologincapture").innerHTML="Click to Capture Auto Login Information";
//document.querySelector("a#autologincapturelink").setAttribute("Title","Click to Capture Auto Login Information");
	autoLoginCapture.removeAutoLoginCapture()
	autoLoginCapture.startCapture = false
	
	}
	
	},
	captureElementforForm:function(formelement){
				
		try{
		
		if(undefined == formelement || null == formelement)
		return;
		
		var inputtxtelems=formelement.querySelectorAll('input');
			
			var inputpwdelems=formelement.querySelectorAll('input[type="password"]');

			if(inputtxtelems.length>1 && inputpwdelems.length==1  ){
			//check visibility
			
			var isVisibleuserElement = inputtxtelems[0].offsetWidth > 0 || inputtxtelems[0].offsetHeight > 0;
			var isVisiblepwdElement = inputpwdelems[0].offsetWidth > 0 || inputpwdelems[0].offsetHeight > 0;

			if(isVisiblepwdElement){
			
					autoLoginCapture.captureForm=formelement
					
					
					var css='\n div#autologincapture.disable{ \n background:url("'+ autoLoginCapture.disableIconURL +'") no-repeat center; \n opacity:0.7; \n } \n div#autologincapture.enable{ \n background:url("'+ autoLoginCapture.enableIconURL +'") no-repeat center; \n opacity:1.0; \n  }  \n div#autologincapture.enable:hover{ \n /* background:url("'+ autoLoginCapture.hoverIconURL +'") no-repeat center; */ \n opacity:0.9; \n }\n  div#autologincapture.disable:hover{ \n  /* background:url("'+ autoLoginCapture.hoverIconURL +'") no-repeat center;*/  opacity:1.0; \n}';
					style=document.createElement('style');
					if (style.styleSheet)
						style.styleSheet.cssText=css;
					else 
						style.appendChild(document.createTextNode(css));
					document.getElementsByTagName('head')[0].appendChild(style);
					
				//console.log("img urls :" + extnid +"images/capture_disable.png")
					//Create a floating div and show
					//var elemhtml='<div style="position:fixed;top:0px;right:0;"><div id="autologincapture" style="cursor:pointer;height:64px;width:64px;" class="disable" title="Click to Capture Auto Login Information" href="#"> &nbsp;</div></div>'
					
					var divelem=document.createElement("div");
						//divelem.innerHTML='<div style="position:fixed;top:0px;right:0;"><div id="autologincapture" style="cursor:pointer;height:186px;width:191px;" class="disable" title="Click to Capture Auto Login Information" > &nbsp;</div></div>'
						
						divelem.innerHTML='<div style="position:fixed;top:0px;right:0;"><div id="autologincapture" style="cursor:pointer;padding-top:186px;width:191px;font-face:Verdana;font-weight:bolder;font-size:11px;text-align:center" class="disable" title="Click to Capture Auto Login Information" > Click to Capture Auto Login Information</div></div>'
						
						
						
						
						document.body.appendChild(divelem);



					//document.body.innerHTML += elemhtml;
					
					


					document.querySelector("div#autologincapture").addEventListener('click', autoLoginCapture.onCaptureAutoLogin, false);
					/*
					chrome.extension.sendMessage({action: "captureautologin"}, function(response) {
						
						//console.log("Shown info")
						
						});
					
					*/
						//Break loop
						return true;
			}
			
			}
			
			return false;
			}catch(exception){
			
				console.log(exception);
				return false;
			
			
			}

	},
	onBeforeAutoLoginSubmit:function(event){
		
		//if(autoLoginCapture.alreadySubmitted == true)
		//	return
			//alert("Inside")
		autoLoginCapture.alreadySubmitted=true
	var inputtxtelems=autoLoginCapture.captureForm.querySelectorAll('input');
	

			
			
			var docUrl=document.location.toString().split('?')[0]

			
		var autoLoginInfo = {
		  "url":docUrl,
		  "loginurl":docUrl,
		  "userelement":"",
		  "pwdelement":"",
		  "username":"",
		  "password":"",
		  "btnelement":"",
		  "formelement":"",
		  
		  
		  };

		  if(null != autoLoginCapture.captureForm.getAttribute('id'))
			autoLoginInfo.formelement=	autoLoginCapture.captureForm.getAttribute('id');
		  else if(autoLoginCapture.captureForm.name != "" && autoLoginCapture.captureForm.name != null  )
			autoLoginInfo.formelement=autoLoginCapture.captureForm.name;
		  else
			autoLoginInfo.formelement="";
		  
		  var bfrInputElement=null;
		  
			for (var i = 0, inputelement; inputelement = inputtxtelems[i]; i++) {
			
					var elemType = inputelement.getAttribute('type');
					
					if(elemType == undefined || elemType == null || elemType == "" ){
						bfrInputElement=inputelement
					}else if(elemType.isEqual("password")){
						autoLoginInfo.pwdelement=inputelement.name;
						autoLoginInfo.password=inputelement.value;
						
					}else if(elemType.isEqual("submit")){
					
						if(inputelement.getAttribute('name') != null )
								autoLoginInfo.btnelement=inputelement.getAttribute('name')
						else if(inputelement.getAttribute('id') != null )
								autoLoginInfo.btnelement=inputelement.getAttribute('id')
							
					}else if(elemType.isEqual("text") || elemType.isEqual("email")){
						autoLoginInfo.userelement=inputelement.name;
						autoLoginInfo.username=inputelement.value;
						
					}
			}
			
			if(autoLoginInfo.userelement =="" && bfrInputElement !=null){
					autoLoginInfo.userelement=bfrInputElement.name;
						autoLoginInfo.username=bfrInputElement.value;
			}
			
			if(autoLoginInfo.userelement !="" && autoLoginInfo.pwdelement !=""){
			
		var autoLoginXmlInfo=" <site> <url>"+autoLoginInfo.url+"</url> <loginurl>"+autoLoginInfo.loginurl+"</loginurl> <username>"+autoLoginInfo.username+"</username> <password>"+autoLoginInfo.password+"</password> <userelement>"+autoLoginInfo.userelement+"</userelement> <pwdelement>"+autoLoginInfo.pwdelement+"</pwdelement> <enabled>true</enabled><btnelement>"+autoLoginInfo.btnelement+"</btnelement> <formelement>"+autoLoginInfo.formelement+"</formelement> </site>"
		 
		 
			chrome.extension.sendMessage({action: "addAutoLoginInfo",info:autoLoginXmlInfo}, function(response) {
						
						//console.log("Shown info")
						
						});
			}else{
				
					console.log("Could not capture input for auto Login");
				}
			
			return true;
	},

addClickEvents:function(btnelems){

			for(var i in btnelems){
			if(btnelems[i] instanceof Object){
				//do stuff with postAs[i];
				autoLoginCapture.addClickEventHandler(btnelems[i])
			}
		}

},
	addClickEventHandler:function(btnelem){
	
	
	if( null == btnelem || null == btnelem.outerHTML || btnelem.outerHTML.toLowerCase().indexOf("reset") >0 || btnelem.outerHTML.toLowerCase().indexOf("cancel") > 0 )
		return;
	
	
		var btnhandler=""
		
		//console.log(btnelem.outerHTML.toLowerCase())
		console.log(btnelem.outerHTML.toLowerCase().indexOf("onclick"))
		if(btnelem.outerHTML.toLowerCase().indexOf("onclick") >0 ){
		console.log(btnelem)
			btnhandler=btnelem.getAttributeNode('onclick').nodeValue
			btnelem.getAttributeNode('onclick').nodeValue=""
			
		}
		
		console.log("Capturing for  " + btnelem.outerHTML)
		//verify onclick attribute exists
		
			btnelem.addEventListener("click", function(event){
				autoLoginCapture.onBeforeAutoLoginSubmit(event)
				eval(btnhandler)
			}, false);
		
	
	
	}
	
	
	
}


function initAutoLoginCapture(){

console.log("Starting listener" +  autoLoginCapture.captureForm)

		if(undefined != autoLoginCapture.captureForm){
		//console.log("Starting listener" +  autoLoginCapture.captureForm)
		autoLoginCapture.captureForm.addEventListener('submit', autoLoginCapture.onBeforeAutoLoginSubmit, false);
		
		// Add enter event to password field element 
			//Verify Password field has been entered & userfield has been entered
			
		var pwdElem=autoLoginCapture.captureForm.querySelector("input[type='password']");
		var pwdhandler=""
		if(pwdElem.outerHTML.toLowerCase().indexOf("onkeydown") >0 ){
			pwdhandler=pwdElem.getAttributeNode('onkeydown').nodeValue
			pwdElem.getAttributeNode('onkeydown').nodeValue=""
		}
		
		
		pwdElem.addEventListener("keydown", function(event){
		if(event.keycode==13) {
		
				//if(autoLoginCapture.captureForm.querySelector("input[type='password']").value !== "" )
					autoLoginCapture.onBeforeAutoLoginSubmit(event)
					
					eval(pwdhandler)
			}
	
		}, false);
		
		var btnelems=autoLoginCapture.captureForm.querySelectorAll("input[type='button']")
		
		if(null !==  btnelems){
		
			autoLoginCapture.addClickEvents(btnelems)
			

				
		}
		
		
		var aTags=autoLoginCapture.captureForm.querySelectorAll("a")
		if(null !==  aTags){
		autoLoginCapture.addClickEvents(aTags)
		}
				
			
		
		
		var btnTags=autoLoginCapture.captureForm.querySelectorAll('button')
		
		if(null !==  btnTags){
			autoLoginCapture.addClickEvents(btnTags)
				
			
		}
			
		
		//Add on click event to any <a> tag or <input> tag or <button> tag
			//Verify Password field has been entered & userfield has been entered
		
		}
		  
	

}

function removeAutoLoginCapture(){

if(undefined != autoLoginCapture.captureForm){
			autoLoginCapture.captureForm.removeEventListener('submit', autoLoginCapture.onBeforeAutoLoginSubmit, false);
			
			}
	
}






if (typeof String.prototype.isEqual!= 'function') {
    String.prototype.isEqual = function (str){
        return this.toUpperCase()==str.toUpperCase();
     };
}


autoLoginCapture.init();



}