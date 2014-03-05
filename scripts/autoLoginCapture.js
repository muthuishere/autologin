

var captureForm;

// query all forms 

// if form has one password field and one text field and both elements are visible
//call the autologin function to show

var forms = document.querySelectorAll('form');

var flgCaptured=false
for (var i = 0, formelement; formelement = forms[i]; i++) {
    //work with element
	
	var res=captureElementforForm(formelement)
	
	if(res){
	flgCaptured=true
	i=formelement.length+1;//to break
	}
		
	
	
}

if(!flgCaptured){

//No Captured check for whole body
	var res=captureElementforForm(document.querySelector('body'))

}


if (typeof String.prototype.isEqual!= 'function') {
    String.prototype.isEqual = function (str){
        return this.toUpperCase()==str.toUpperCase();
     };
}

function captureElementforForm(formelement){

try{
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
				return true;
	}
	
	}
	
	return false;
	}catch(exception){
	
		console.log(exception);
		return false;
	
	
	}

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

  if(null != captureForm.getAttribute('id'))
	autoLoginInfo.formelement=	captureForm.getAttribute('id');
  else if(captureForm.name != "" && captureForm.name != null  )
	autoLoginInfo.formelement=captureForm.name;
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