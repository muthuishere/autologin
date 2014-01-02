

var captureForm;

// query all forms 

// if form has one password field and one text field and both elements are visible
//call the autologin function to show

var forms = document.querySelectorAll('form');

for (var i = 0, formelement; formelement = forms[i]; i++) {
    //work with element
	
	
	var inputtxtelems=formelement.querySelectorAll('input');
	var inputpwdelems=formelement.querySelectorAll('input[type="password"]');

	if(inputtxtelems.length>1 && inputpwdelems.length==1  ){
	//check visibility
	
	var isVisibleuserElement = inputtxtelems[0].offsetWidth > 0 || inputtxtelems[0].offsetHeight > 0;
	var isVisiblepwdElement = inputpwdelems[0].offsetWidth > 0 || inputpwdelems[0].offsetHeight > 0;

	if(isVisiblepwdElement){
	
			captureForm=formelement
			chrome.extension.sendMessage({action: "captureautologin"}, function(response) {
				
				//console.log("Shown info")
				
				});
				
				//Break loop
				i=forms.length+1;
	}
	
	}
	
}


if (typeof String.prototype.isEqual!= 'function') {
    String.prototype.isEqual = function (str){
        return this.toUpperCase()==str.toUpperCase();
     };
}


function onBeforeAutoLoginSubmit(){

	var inputtxtelems=captureForm.querySelectorAll('input');
	

	
	
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

  if(captureForm.name =="" || captureForm.name == null)
	autoLoginInfo.formelement=	captureForm.getAttribute('id');
  else
	autoLoginInfo.formelement=captureForm.name;
  
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
	
var autoLoginXmlInfo=" <site> <url>"+autoLoginInfo.url+"</url> <loginurl>"+autoLoginInfo.loginurl+"</loginurl> <username>"+autoLoginInfo.username+"</username> <password>"+autoLoginInfo.password+"</password> <userelement>"+autoLoginInfo.userelement+"</userelement> <pwdelement>"+autoLoginInfo.pwdelement+"</pwdelement> <btnelement>"+autoLoginInfo.btnelement+"</btnelement> <formelement>"+autoLoginInfo.formelement+"</formelement> </site>"
 
 
	chrome.extension.sendMessage({action: "addAutoLoginInfo",info:autoLoginXmlInfo}, function(response) {
				
				//console.log("Shown info")
				
				});
	}else{
		
			alert("Could not capture input for auto Login");
		}
	
	return true;
}


function initAutoLoginCapture(){

//Test
	//onBeforeAutoLoginSubmit()

if(undefined != captureForm)
  captureForm.addEventListener('submit', onBeforeAutoLoginSubmit, false);

}

function removeAutoLoginCapture(){

if(undefined != captureForm)
	captureForm.removeEventListener('submit', onBeforeAutoLoginSubmit, false);
}