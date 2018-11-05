(function() {

if ( document instanceof HTMLDocument === false ) {

    return false;
}

if ( !vAPI ) {

    return;
}


if (undefined == vAPI.captureUI) {
  vAPI.captureUI = {
  	disableIconURL: "",
  	enableIconURL: "",
  	hoverIconURL: "",
  	backgroundIconURL: "",
  	callback: null,
  	startCapture: false,
  	dragged: 0,
  	pwdelems: [],
  	init: function(appextnid, callback, pwdelems, isSelected) {
    		vAPI.captureUI.callback = callback

      	vAPI.captureUI.disableIconURL = appextnid + "images/capture_disable.png"
      	vAPI.captureUI.enableIconURL = appextnid + "images/capture_enable.png"
      	vAPI.captureUI.hoverIconURL = appextnid + "images/capture_hover.png"
      	vAPI.captureUI.backgroundIconURL = appextnid + "images/bg.png"
      	vAPI.captureUI.pwdelems = pwdelems

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

  			var css = '\n div#captureUI.disable{ \n color:black; \n background:url("' + vAPI.captureUI.disableIconURL + '") no-repeat center; \n opacity:0.7; \n } \n div#captureUI.enable{ \n color:white; \n background:url("' + vAPI.captureUI.enableIconURL + '") no-repeat center; \n opacity:1.0; \n  }  \n div#captureUI.enable:hover{ \n /* background:url("' + vAPI.captureUI.hoverIconURL + '") no-repeat center; */ \n opacity:0.9; \n }\n  div#captureUI.disable:hover{ \n  /* background:url("' + vAPI.captureUI.hoverIconURL +'") no-repeat center;*/  opacity:1.0; \n}';

  			style = document.createElement('style');
  			if (style.styleSheet)
  				style.styleSheet.cssText=css;
  			else
  				style.appendChild(document.createTextNode(css));

  			document.getElementsByTagName('head')[0].appendChild(style);

  			var divelem = document.createElement("div");
        divelem.innerHTML = '<div id="draggable-element" style="position:fixed;top:0px;right:0;z-index:1000" draggable="true"><div id="captureUI" style="cursor:pointer;padding-top:123px;height:55px;width:128px;font-face:Verdana;font-weight:bolder;font-size:15px;text-align:center" class="disable" title="Click to capture Auto Login information">Capture</div></div>'
  			document.body.appendChild(divelem);
  			document.querySelector("div#captureUI").addEventListener('click', vAPI.captureUI.onCaptureAutoLogin, false);

  			if (isSelected) {
  				// Select by default
  				vAPI.captureUI.onCaptureAutoLogin();
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

  				if (selected !== null ) {
  						vAPI.captureUI.dragged++

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

  			var handler = vAPI.captureUI.onVisibilityChange(vAPI.captureUI.pwdelems, callback);
  			document.addEventListener('scroll', handler, false);
  			handler()
  	},
  	hide: function() {
  		document.querySelector("#draggable-element").style.display = "none"
  	},
  	show: function() {
  		document.querySelector("#draggable-element").style.display = ""
  	},
  	onVisibilityChange: function(elems, callback) {
  		return function () {
    			for (l = 0; l < elems.length; l++) {
      				if (vAPI.captureUI.isElementInViewport(elems[l])) {
      					document.querySelector("#draggable-element").style.visibility = "visible"
      				} else {
      					document.querySelector("#draggable-element").style.visibility = "hidden"
      				}
    			}
  		}
  	},
  	isElementInViewport: function(el) {
    		var rect = el.getBoundingClientRect();

    		return (
    			rect.top >= 0 &&
    			rect.left >= 0 &&
    			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    			rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    		);
  	},
  	onCaptureAutoLogin: function() {
      	if (vAPI.captureUI.dragged < 2) {
            if (vAPI.captureUI.startCapture == false) {
              // Change background url
        			document.querySelector("div#captureUI").className = "enable";;
        			document.querySelector("div#captureUI").setAttribute("title", "Click to disable capturing Auto Login information");
        			document.querySelector("div#captureUI").setAttribute("alt", "Click to disable capturing Auto Login information");
        			document.querySelector("div#captureUI").innerHTML = "Cancel";

          		vAPI.captureUI.startCapture = true
        			if (null != vAPI.captureUI.callback)
        				vAPI.captureUI.callback(true)
  		      } else {
            	document.querySelector("div#captureUI").className = "disable";
            	document.querySelector("div#captureUI").setAttribute("title","Click to capture Auto Login information");
            	document.querySelector("div#captureUI").innerHTML = "Capture";

          		vAPI.captureUI.startCapture = false
        			if (null != vAPI.captureUI.callback)
        				vAPI.captureUI.callback(false)
            }
        }

  	    vAPI.captureUI.dragged = 0;
    }, // NOTE: Does this need a comma here?
  }
}


if (undefined == captureElem) {
  var captureElem = {
  	callback: null,
  	startCapture: false,
  	init: function(appextnid, isSelected, callback, pwdelem){
        captureElem.callback = callback
		    var divelem = document.createElement("div");

  			if (isSelected) {
  				divelem.innerHTML = '<div style="display:block;width:250px;color:black;font-weight:bold;"><input type="checkbox" id="autoLoginCaptureIconCheckbox" selected="selected" value="1" > Use Autologin</div>'
  				captureElem.callback(true)
  			} else
  				divelem.innerHTML = '<div style="display:block;width:250px;color:black;font-weight:bold;"><input type="checkbox" id="autoLoginCaptureIconCheckbox" value="1" > Use Autologin</div>'

  			pwdelem.parentNode.appendChild(divelem);
  			document.querySelector("#captureUICheckbox").addEventListener('change', captureElem.onCaptureAutoLogin, false);
  	},
  	onCaptureAutoLogin: function(event) {
  		captureElem.callback(event.target.checked)
  	}
  }
}

})();
