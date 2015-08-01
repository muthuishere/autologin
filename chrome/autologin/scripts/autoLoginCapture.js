
if (undefined == autoLoginCapture){




var autoLoginCapture={
	captureForm:null,	
	elems:[],
	startCapture:false,
	disableIconURL:"",
	enableIconURL:"",
	hoverIconURL:"",
	backgroundIconURL:"",
	alreadySubmitted:false,
	getXPath:function(elm){
		
		 var allNodes = document.getElementsByTagName('*'); 
    for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) 
    { 
        if (elm.hasAttribute('id')) { 
                var uniqueIdCount = 0; 
                for (var n=0;n < allNodes.length;n++) { 
                    if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++; 
                    if (uniqueIdCount > 1) break; 
                }; 
                if ( uniqueIdCount == 1) { 
                    segs.unshift('id("' + elm.getAttribute('id') + '")'); 
                    return segs.join('/'); 
                } else { 
                    segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]'); 
                } 
        } else if (elm.hasAttribute('class')) { 
            segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]'); 
        } else { 
            for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) { 
                if (sib.localName == elm.localName)  i++; }; 
                segs.unshift(elm.localName.toLowerCase() + '[' + i + ']'); 
        }; 
    }; 
    return segs.length ? '/' + segs.join('/') : null; 
		
	},
	getXPathold:function ( element )
	{
		var xpath = '';
		for ( ; element && element.nodeType == 1; element = element.parentNode )
		{
			var id = $(element.parentNode).children(element.tagName).index(element) + 1;
			id > 1 ? (id = '[' + id + ']') : (id = '');
			xpath = '/' + element.tagName.toLowerCase() + id + xpath;
		}
		return xpath;
	},	
	getElementByXpath:function  (path) {
		
		 var evaluator = new XPathEvaluator(); 
    var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
    return  result.singleNodeValue; 
	
		/*return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; */
	},	
	setelemvalue:function(element,value){
		
		for (index = 0, len = autoLoginCapture.elems.length; index < len; ++index) {
				var elem= autoLoginCapture.elems[index];
				if(autoLoginCapture.elems[index].xpath == autoLoginCapture.getXPath(element)){
					if( undefined !== value)
						autoLoginCapture.elems[index].value=value
					
					return;
				}
				
			}
	},		
	checkpasswordhasvalue:function(){
		
		for (index = 0, len = autoLoginCapture.elems.length; index < len; ++index) {
				var elem= autoLoginCapture.elems[index];
				if(autoLoginCapture.elems[index].type == "password" && autoLoginCapture.elems[index].value != ""){
					
					
					return true;
				}
				
			}
			return false;
			
	},	
	updateElements:function(){
		
		for (index = 0, len = autoLoginCapture.elems.length; index < len; ++index) {
				
				
					var elem= autoLoginCapture.getElementByXpath(autoLoginCapture.elems[index].xpath )
					if(elem.value)
					autoLoginCapture.elems[index].value=elem.value
					
				}
				
			
	},
	setelemevent:function(element,evt){
		
		for (index = 0, len = autoLoginCapture.elems.length; index < len; ++index) {
				var elem= autoLoginCapture.elems[index];
				if(autoLoginCapture.elems[index].xpath == autoLoginCapture.getXPath(element)){
					
					autoLoginCapture.elems[index].event=evt
					return;
				}
				
			}
	},	
	init:function(){
		
	autoLoginCapture.disableIconURL=extnid +"images/capture_disable.png"
	autoLoginCapture.enableIconURL=extnid +"images/capture_enable.png"
	autoLoginCapture.hoverIconURL=extnid +"images/capture_hover.png"
	autoLoginCapture.backgroundIconURL=extnid +"images/bg.png"
	// if form has one password field and one text field and both elements are visible
	//call the autologin function to show

	
	//set lostfocus for all elements
	//set key press events for all input elements
		//if keypress event is enter , save all values
			//xpath & value
			// elem				
				// xpath
				// value
				// event
			
			
	var flgCaptured=false
			var forms = document.querySelectorAll("input,select,textarea button");

			for (var i = 0, formelement; formelement = forms[i]; i++) {
			
			
			
			if(autoLoginCapture.isVisible(formelement) && formelement.getAttribute("type") !== "hidden"){
			
			
				var elem={}

					elem.xpath=autoLoginCapture.getXPath(formelement)
					val=""
					if(formelement.value && undefined != formelement.value)
						val=formelement.value
					
					elem.type="text"
					elem.value=val
					elem.event=""
					
					if(formelement.getAttribute("type")){
						elem.type=formelement.getAttribute("type").toLowerCase()		
						
							if( formelement.getAttribute("type").toLowerCase()  === "password"){
								flgCaptured=true
								
								if(formelement.form){
									var parentform=formelement.form
									var parentformelem={}
									parentformelem.xpath=autoLoginCapture.getXPath(parentform)
									parentformelem.type="form"
									parentformelem.event=""
									parentformelem.value=""
									
									
									autoLoginCapture.elems.push(parentformelem)
									parentform.addEventListener('submit', function(e){
										
										console.log("Form submit validation")
										//if password element has value dont do anything or capture all input and send it to background
										if(autoLoginCapture.checkpasswordhasvalue() == false )
												autoLoginCapture.updateElements();
										
										if( autoLoginCapture.alreadySubmitted == false){
											 
											console.log("Updating through form submit")
												
												autoLoginCapture.setelemevent(e.target,"submit")
												autoLoginCapture.sendtoBackground()
										}
										
				
									}, false);
									
								}
									
								}
				
				
						
					}
			
			
				
					autoLoginCapture.elems.push(elem)
					
					formelement.addEventListener('blur',function(e){
					
					
					//send xpath & value to background page
					
					
								autoLoginCapture.setelemvalue(e.target,e.target.value)
					
							  e = e || window.event;
							 if (e.returnValue === false || e.isDefaultPrevented)
							 {
								  
								 //do stuff, like validation or something, then you could:
								 e.cancelBubble = true;
								 if (e.stopPropagation)
								 {
									 e.stopPropagation();
								 }
							 }
					
					
					}, false)
					
					
					formelement.addEventListener('keypress',function(e){
					
					//if keypress is enter
					//send xpath & value to background page and enterkey
					
					// event is submit
							
					  e = e || window.event;
					  
					  if (e.keyCode == 13) {
						  autoLoginCapture.setelemevent(e.target,"enter")
						  autoLoginCapture.sendtoBackground()
							  
					  }else					  
						autoLoginCapture.setelemvalue(e.target,e.target.value)
					
					
							 if (e.returnValue === false || e.isDefaultPrevented)
							 {
								  
								 //do stuff, like validation or something, then you could:
								 e.cancelBubble = true;
								 if (e.stopPropagation)
								 {
									 e.stopPropagation();
								 }
							 }
							 
					
					}, false)
					
					formelement.addEventListener('click',function(e){
					autoLoginCapture.setelemevent(e.target,"click")
					autoLoginCapture.sendtoBackground()
					//check element is button
					
					//send element
					//event click
					
					}, false)
					
					
					
			
			}
			
			}
			
		if(flgCaptured){
			
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
						document.querySelector("div#autologincapture").addEventListener('click', autoLoginCapture.onCaptureAutoLogin, false);
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
	
	//initAutoLoginCapture()
	
	
		
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
	removeAutoLoginCapture:function(){


//			autoLoginCapture.captureForm.removeEventListener('submit', autoLoginCapture.onBeforeAutoLoginSubmit, false);
			

	
},
	isVisible:function(elem){
		if(elem.style.visibility == "hidden")
			return false
			
			
		return elem.offsetWidth > 0 || elem.offsetHeight > 0;
	},
	captureElementforForm:function(formelement){
				
		try{
		
		if(undefined == formelement || null == formelement)
		return;
		
		var inputtxtelems=formelement.querySelectorAll('input');
			
			var inputpwdelems=formelement.querySelectorAll('input[type="password"]');

			if(inputtxtelems.length>1 && inputpwdelems.length==1  ){
			//check visibility
			
			console.log("Elements available")
			var isVisibleuserElement =autoLoginCapture.autoLoginCapture.isVisible(inputtxtelems[0])// .offsetWidth > 0 || inputtxtelems[0].offsetHeight > 0;
			var isVisiblepwdElement = autoLoginCapture.autoLoginCapture.isVisible(inputpwdelems[0]) //inputpwdelems[0].offsetWidth > 0 || inputpwdelems[0].offsetHeight > 0;

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
	sendtoBackground:function(){
		
		
	if(autoLoginCapture.startCapture == true){
		 
		 //console.log(autoLoginXmlInfo)
		 
		 var data={}
		  data.url=document.location.toString().split('?')[0]
		  data.loginurl = document.location.toString().split('?')[0]
		  data.elements = autoLoginCapture.elems
		  
		  
			chrome.extension.sendMessage({action: "addAutoLoginElements",info:data}, function(response) {
						
						console.log("Updated data ")
						
						});
			}else{
				
					console.log("Not required");
				}
			
			autoLoginCapture.alreadySubmitted=true;
			return true;
	},

	onBeforeAutoLoginSubmitold:function(event){
		
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
						
					}else if(autoLoginCapture.autoLoginCapture.isVisible(inputelement) == true && (elemType.isEqual("submit") || elemType.isEqual("button"))){
					
					
					
					
					
					
					if(elemType.isEqual("submit")  || inputelement.value.ispartof("submit,log,enter,sign") ){
					//console.log("getting for " + inputelement.value)
						if(inputelement.getAttribute('name') != null )
								autoLoginInfo.btnelement=inputelement.getAttribute('name')
						else if(inputelement.getAttribute('id') != null )
								autoLoginInfo.btnelement=inputelement.getAttribute('id')
							
							}
					}else if(elemType.isEqual("text") || elemType.isEqual("email")){
					
					if(inputelement.value != ""){
					
						autoLoginInfo.userelement=inputelement.name;
						autoLoginInfo.username=inputelement.value;
						
						}
						
					}
			}
			
			if(autoLoginInfo.userelement =="" && bfrInputElement !=null){
					autoLoginInfo.userelement=bfrInputElement.name;
						autoLoginInfo.username=bfrInputElement.value;
			}
			
			if(autoLoginInfo.userelement !="" && autoLoginInfo.pwdelement !=""){
			
		var autoLoginXmlInfo=" <site> <url>"+autoLoginInfo.url+"</url> <loginurl>"+autoLoginInfo.loginurl+"</loginurl> <username>"+autoLoginInfo.username+"</username> <password>"+autoLoginInfo.password+"</password> <userelement>"+autoLoginInfo.userelement+"</userelement> <pwdelement>"+autoLoginInfo.pwdelement+"</pwdelement> <enabled>true</enabled><btnelement>"+autoLoginInfo.btnelement+"</btnelement> <formelement>"+autoLoginInfo.formelement+"</formelement> </site>"
		 
		 //console.log(autoLoginXmlInfo)
		 
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
	
	
	if( null == btnelem || null == btnelem.outerHTML || btnelem.outerHTML.ispartof("clear,cancel,reset") == true )
		return;
	
	
		var btnhandler=""
		
		//console.log(btnelem.outerHTML.toLowerCase())
	
		if(btnelem.outerHTML.toLowerCase().indexOf("onclick") >0 ){
		
			btnhandler=btnelem.getAttributeNode('onclick').nodeValue
			btnelem.getAttributeNode('onclick').nodeValue=""
			
		}
		
		
		//verify onclick attribute exists
		
			btnelem.addEventListener("click", function(event){
				autoLoginCapture.onBeforeAutoLoginSubmit(event)
				eval(btnhandler)
			}, false);
		
	
	
	}
	
	
	
}


function initAutoLoginCapture(){

//console.log("Starting listener" +  autoLoginCapture.captureForm)

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








if (typeof String.prototype.isEqual!= 'function') {
    String.prototype.isEqual = function (str){
        return this.toUpperCase()==str.toUpperCase();
     };
}

if (typeof String.prototype.ispartof!= 'function') {
    String.prototype.ispartof = function (str){
		//Split comma delimeted strings and verify 
		
		   var lst=str.split(",")
			

			for(i=0;i<lst.length;i++){

			if(this.toUpperCase().indexOf(lst[i].toUpperCase()) >= 0)
				return true;
			
			}

        return false ;
     };
}

autoLoginCapture.init();



}