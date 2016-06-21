
if (undefined == captureUI){



var captureUI={	
	disableIconURL:"",
	enableIconURL:"",
	hoverIconURL:"",
	backgroundIconURL:"",
	callback:null,	
	startCapture:false,
	dragged:0,
	pwdelems:[],
	init:function(appextnid,callback,pwdelems,isSelected){
		
		
		captureUI.callback=callback
		//console.log(captureUI.callback)
	captureUI.disableIconURL=appextnid +"images/capture_disable.png"
	captureUI.enableIconURL=appextnid +"images/capture_enable.png"
	captureUI.hoverIconURL=appextnid +"images/capture_hover.png"
	captureUI.backgroundIconURL=appextnid +"images/bg.png"
	captureUI.pwdelems=pwdelems
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
			

			
			var css='\n div#captureUI.disable{ \n color:black; \n background:url("'+ captureUI.disableIconURL +'") no-repeat center; \n opacity:0.7; \n } \n div#captureUI.enable{ \n color:white; \n background:url("'+ captureUI.enableIconURL +'") no-repeat center; \n opacity:1.0; \n  }  \n div#captureUI.enable:hover{ \n /* background:url("'+ captureUI.hoverIconURL +'") no-repeat center; */ \n opacity:0.9; \n }\n  div#captureUI.disable:hover{ \n  /* background:url("'+ captureUI.hoverIconURL +'") no-repeat center;*/  opacity:1.0; \n}';
		
					style=document.createElement('style');
					if (style.styleSheet)
						style.styleSheet.cssText=css;
					else 
						style.appendChild(document.createTextNode(css));
					document.getElementsByTagName('head')[0].appendChild(style);
					
					
					var divelem=document.createElement("div");
								
						divelem.innerHTML='<div id="draggable-element" style="position:fixed;top:0px;right:0;z-index:1000"  draggable="true"><div id="captureUI" style="cursor:pointer;padding-top:123px;height:55px;width:128px;font-face:Verdana;font-weight:bolder;font-size:15px;text-align:center" class="disable" title="Click to Capture Auto Login Information" > Capture</div></div>'
						
						//padding-top:128px;width:133px;
						
						
						document.body.appendChild(divelem);
						document.querySelector("div#captureUI").addEventListener('click', captureUI.onCaptureAutoLogin, false);
		
	
					
						if(isSelected){
							//Select by default
							captureUI.onCaptureAutoLogin();
						}
	
						
						var selected = null, // Object of the element to be moved
						x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
						x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

					// Will be called when user starts dragging an element
					function _drag_init(elem) {
						// Store the object of the element which needs to be moved
						selected = elem;
						x_elem = x_pos - selected.offsetLeft;
						y_elem = y_pos - selected.offsetTop;
					}

					// Will be called when user dragging an element
					function _move_elem(e) {
						x_pos = document.all ? window.event.clientX : e.pageX;
						y_pos = document.all ? window.event.clientY : e.pageY;
						//if (selected !== null && ((x_pos - x_elem) >=-200) && ((y_pos - y_elem) >=-200) ) {
							if (selected !== null ) {
							
							
							captureUI.dragged++
							//console.log("changed",captureUI.dragged)
							selected.style.left = (x_pos - x_elem) + 'px';
							selected.style.top = (y_pos - y_elem) + 'px';
						}
					}

					// Destroy the object when we are done
					function _destroy() {
						selected = null;
						 
						 
					}

					// Bind the functions...
					document.getElementById('draggable-element').onmousedown = function () {
						_drag_init(this);
						return false;
					};
					
					

					document.onmousemove = _move_elem;
					document.onmouseup = _destroy;

		
			var handler = captureUI.onVisibilityChange(captureUI.pwdelems, callback);
			document.addEventListener('scroll', handler, false); 
			handler()
			
			//document.addEventListener('resize', handler, false); 
			

			

	},
	onVisibilityChange:function (elems, callback) {
		return function () {
			
			for (l=0;l<elems.length;l++){
				
				if(captureUI.isElementInViewport(elems[l])){
					console.log("Is in viewport")
					document.querySelector("#draggable-element").style.visibility="visible"
					
				}else{
					console.log("Is not in viewport")
					document.querySelector("#draggable-element").style.visibility="hidden"
				}
					
			}
			
		}
	},
	
	isElementInViewport:function(el) {


		var rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		);
	},	
	onCaptureAutoLogin:function(){

	if(captureUI.dragged <2 ){
	//console.log("on capture autologin")
		if(captureUI.startCapture == false){
		
		//Change Background url
		
		
			document.querySelector("div#captureUI").className = "enable";;
			document.querySelector("div#captureUI").setAttribute("title","Click to Disable Capturing Auto Login Information");
			document.querySelector("div#captureUI").setAttribute("alt","Click to Disable Capturing Auto Login Information");
			document.querySelector("div#captureUI").innerHTML="Cancel";
		//	document.querySelector("a#captureUIlink").setAttribute("Title","Click to Disable Capturing Auto Login Information");
		
		//initautoLoginCaptureIcon()
		
		captureUI.startCapture=true
			
		//	captureUI.captureForm.addEventListener('submit', captureUI.onBeforeAutoLoginSubmit, true);
			if(null != captureUI.callback){
				
				captureUI.callback(true)
			}

						
						
		}else{
		
	document.querySelector("div#captureUI").className = "disable";
	document.querySelector("div#captureUI").setAttribute("title","Click to Capture Auto Login Information");
	document.querySelector("div#captureUI").innerHTML="Capture";
	//document.querySelector("a#captureUIlink").setAttribute("Title","Click to Capture Auto Login Information");
		captureUI.startCapture=false
			if(null != captureUI.callback){
				
				captureUI.callback(false)
			}
		
		
		}
		
	}
	

	captureUI.dragged=0;
	
	},

	
	
}





}


if (undefined == captureElem){



var captureElem={	
	callback:null,	
	startCapture:false,
	init:function(appextnid,isSelected,callback,pwdelem){
		captureElem.callback=callback

		
		
		var divelem=document.createElement("div");
			
			if(isSelected){
				divelem.innerHTML='<div style="display:block;width:250px;color:black;font-weight:bold;"><input type="checkbox" id="autoLoginCaptureIconCheckbox" selected="selected" value="1" > Use Autologin</div>'
				captureElem.callback(true)
			}							
			else
				divelem.innerHTML='<div style="display:block;width:250px;color:black;font-weight:bold;"><input type="checkbox" id="autoLoginCaptureIconCheckbox" value="1" > Use Autologin</div>'
			
			pwdelem.parentNode.appendChild(divelem);
			
			document.querySelector("#captureUICheckbox").addEventListener('change', captureElem.onCaptureAutoLogin, false);
			
						
		
			
	},
	onCaptureAutoLogin:function(event){
	
		captureElem.callback(event.target.checked)
	
	
	
	}

	
	
}





}