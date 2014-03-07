
var autoLoginCapture={
	captureForm:null,
	init:function(){
			// query all forms 

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
				}
					
				
				
			}

			if(!flgCaptured){

			//No Captured check for whole body
				autoLoginCapture.captureElementforForm(document.querySelector('body'))

			}

	},
	captureElementforForm:function(formelement){
				
		try{
		var inputtxtelems=formelement.querySelectorAll('input');
			
			var inputpwdelems=formelement.querySelectorAll('input[type="password"]');

			if(inputtxtelems.length>1 && inputpwdelems.length==1  ){
			//check visibility
			
			var isVisibleuserElement = inputtxtelems[0].offsetWidth > 0 || inputtxtelems[0].offsetHeight > 0;
			var isVisiblepwdElement = inputpwdelems[0].offsetWidth > 0 || inputpwdelems[0].offsetHeight > 0;

			if(isVisiblepwdElement){
			
					autoLoginCapture.captureForm=formelement
					
					//Create a floating div and show
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
	onBeforeAutoLoginSubmit:function(){
		
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
							
					}else if(elemType.isEqual("text")){
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
	}
	
}

function initAutoLoginCapture(){

		if(undefined != autoLoginCapture.captureForm)
		  autoLoginCapture.captureForm.addEventListener('submit', autoLoginCapture.onBeforeAutoLoginSubmit, false);
	

}

function removeAutoLoginCapture(){

if(undefined != autoLoginCapture.captureForm)
			autoLoginCapture.captureForm.removeEventListener('submit', autoLoginCapture.onBeforeAutoLoginSubmit, false);
	
}






if (typeof String.prototype.isEqual!= 'function') {
    String.prototype.isEqual = function (str){
        return this.toUpperCase()==str.toUpperCase();
     };
}




window.addEventListener("load", function(e) { autoLoginCapture.init(); }, false); 

