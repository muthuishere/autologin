
if (undefined == autoLoginCaptureIconCheck){



var autoLoginCaptureIconCheck={	
	disableIconURL:"",
	enableIconURL:"",
	hoverIconURL:"",
	backgroundIconURL:"",
	callback:null,	
	startCapture:false,
	init:function(appextnid,callback,pwdelem){
		autoLoginCaptureIconCheck.callback=callback
	autoLoginCaptureIconCheck.disableIconURL=appextnid +"images/capture_disable.png"
	autoLoginCaptureIconCheck.enableIconURL=appextnid +"images/capture_enable.png"
	autoLoginCaptureIconCheck.hoverIconURL=appextnid +"images/capture_hover.png"
	autoLoginCaptureIconCheck.backgroundIconURL=appextnid +"images/bg.png"
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
			

			
			var css='\n div#autoLoginCaptureIconCheck.disable{ \n background:url("'+ autoLoginCaptureIconCheck.disableIconURL +'") no-repeat center; \n opacity:0.7; \n } \n div#autoLoginCaptureIconCheck.enable{ \n background:url("'+ autoLoginCaptureIconCheck.enableIconURL +'") no-repeat center; \n opacity:1.0; \n  }  \n div#autoLoginCaptureIconCheck.enable:hover{ \n /* background:url("'+ autoLoginCaptureIconCheck.hoverIconURL +'") no-repeat center; */ \n opacity:0.9; \n }\n  div#autoLoginCaptureIconCheck.disable:hover{ \n  /* background:url("'+ autoLoginCaptureIconCheck.hoverIconURL +'") no-repeat center;*/  opacity:1.0; \n}';
		
					style=document.createElement('style');
					if (style.styleSheet)
						style.styleSheet.cssText=css;
					else 
						style.appendChild(document.createTextNode(css));
					document.getElementsByTagName('head')[0].appendChild(style);
					
					
					var divelem=document.createElement("div");
								
						/*divelem.innerHTML='<div style="position:fixed;top:0px;right:0;"><div id="autoLoginCaptureIconCheck" style="cursor:pointer;padding-top:186px;width:191px;font-face:Verdana;font-weight:bolder;font-size:11px;text-align:center" class="disable" title="Click to Capture Auto Login Information" > Click to Capture Auto Login Information</div></div>'
						*/
						
						divelem.innerHTML='<div style="display:block;width:250px;color:black"><input type="checkbox" id="autoLoginCaptureIconCheck" value="1" checked> Use Autologin</div>'
						
						pwdelem.parentNode.appendChild(divelem);
						
						document.querySelector("#autoLoginCaptureIconCheck").addEventListener('change', autoLoginCaptureIconCheck.onCaptureAutoLogin, false);
		
			
	},
	onCaptureAutoLogin:function(event){
	
		autoLoginCaptureIconCheck.callback(event.target.checked)
	
	
	
	},

	
	
}





}