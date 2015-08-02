
if (undefined == autoLoginCaptureIcon){



var autoLoginCaptureIcon={	
	disableIconURL:"",
	enableIconURL:"",
	hoverIconURL:"",
	backgroundIconURL:"",
	callback:null,	
	startCapture:false,
	init:function(appextnid,callback){
		autoLoginCaptureIcon.callback=callback
	autoLoginCaptureIcon.disableIconURL=appextnid +"images/capture_disable.png"
	autoLoginCaptureIcon.enableIconURL=appextnid +"images/capture_enable.png"
	autoLoginCaptureIcon.hoverIconURL=appextnid +"images/capture_hover.png"
	autoLoginCaptureIcon.backgroundIconURL=appextnid +"images/bg.png"
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
			

			
			var css='\n div#autoLoginCaptureIcon.disable{ \n background:url("'+ autoLoginCaptureIcon.disableIconURL +'") no-repeat center; \n opacity:0.7; \n } \n div#autoLoginCaptureIcon.enable{ \n background:url("'+ autoLoginCaptureIcon.enableIconURL +'") no-repeat center; \n opacity:1.0; \n  }  \n div#autoLoginCaptureIcon.enable:hover{ \n /* background:url("'+ autoLoginCaptureIcon.hoverIconURL +'") no-repeat center; */ \n opacity:0.9; \n }\n  div#autoLoginCaptureIcon.disable:hover{ \n  /* background:url("'+ autoLoginCaptureIcon.hoverIconURL +'") no-repeat center;*/  opacity:1.0; \n}';
		
					style=document.createElement('style');
					if (style.styleSheet)
						style.styleSheet.cssText=css;
					else 
						style.appendChild(document.createTextNode(css));
					document.getElementsByTagName('head')[0].appendChild(style);
					
					
					var divelem=document.createElement("div");
								
						divelem.innerHTML='<div style="position:fixed;top:0px;right:0;"><div id="autoLoginCaptureIcon" style="cursor:pointer;padding-top:186px;width:191px;font-face:Verdana;font-weight:bolder;font-size:11px;text-align:center" class="disable" title="Click to Capture Auto Login Information" > Click to Capture Auto Login Information</div></div>'
						
						
						
						
						document.body.appendChild(divelem);
						document.querySelector("div#autoLoginCaptureIcon").addEventListener('click', autoLoginCaptureIcon.onCaptureAutoLogin, false);
		
			
			
			

			

	},
	onCaptureAutoLogin:function(){
	
	
//console.log("on capture autologin")
	if(autoLoginCaptureIcon.startCapture == false){
	
	//Change Background url
	
	
		document.querySelector("div#autoLoginCaptureIcon").className = "enable";;
		document.querySelector("div#autoLoginCaptureIcon").setAttribute("title","Click to Disable Capturing Auto Login Information");
		document.querySelector("div#autoLoginCaptureIcon").setAttribute("alt","Click to Disable Capturing Auto Login Information");
		document.querySelector("div#autoLoginCaptureIcon").innerHTML="Click to Disable Capturing Auto Login Information";
	//	document.querySelector("a#autoLoginCaptureIconlink").setAttribute("Title","Click to Disable Capturing Auto Login Information");
	
	//initautoLoginCaptureIcon()
	
	autoLoginCaptureIcon.startCapture=true
		
	//	autoLoginCaptureIcon.captureForm.addEventListener('submit', autoLoginCaptureIcon.onBeforeAutoLoginSubmit, true);
		if(null != autoLoginCaptureIcon.callback){
			
			autoLoginCaptureIcon.callback(true)
		}

					
					
	}else{
	
document.querySelector("div#autoLoginCaptureIcon").className = "disable";
document.querySelector("div#autoLoginCaptureIcon").setAttribute("title","Click to Capture Auto Login Information");
document.querySelector("div#autoLoginCaptureIcon").innerHTML="Click to Capture Auto Login Information";
//document.querySelector("a#autoLoginCaptureIconlink").setAttribute("Title","Click to Capture Auto Login Information");
	autoLoginCaptureIcon.startCapture=false
		if(null != autoLoginCaptureIcon.callback){
			
			autoLoginCaptureIcon.callback(false)
		}
	
	
	}
	
	},

	
	
}





}