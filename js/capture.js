(function() {

if (document instanceof HTMLDocument === false) {
    return false;
}

if (!vAPI) {
    return;
}

if (undefined == capture && undefined == vAPI.injected) {
	var messager = vAPI.messaging.channel('capture.js');
	vAPI.messager = messager
	vAPI.injected = messager

	var capture = {
		form : null,
		elems : [],
		startCapture : false,
		disableIconURL : "",
		enableIconURL : "",
		hoverIconURL : "",
		backgroundIconURL : "",
		hiddencapture:false,
		showcaptureonlyonfocus:false,
		alreadySubmitted : false,
		getXPath: function(elm) {
			var allNodes = document.getElementsByTagName('*');

			for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {
				if (elm.hasAttribute('id')) {
					var uniqueIdCount = 0;
					for (var n = 0; n < allNodes.length; n++) {
						if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id)
							uniqueIdCount++;
						if (uniqueIdCount > 1)
							break;
					};
					if (uniqueIdCount == 1) {
						segs.unshift('id("' + elm.getAttribute('id') + '")');
						return segs.join('/');
					} else {
						segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]');
					}
				} else if (elm.hasAttribute('class')) {
					segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]');
				} else {
					for (var i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
						if (sib.localName == elm.localName)
							i++;
					};
					segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
				};
			};
      
			return segs.length ? '/' + segs.join('/') : null;
		},
		getElementByXpath: function(path) {
			var evaluator = new XPathEvaluator();
			var result = evaluator.evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
			return result.singleNodeValue;

			/*return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; */
		},
		setelemvalue: function(element, value) {
  			for (index = 0, len = capture.elems.length; index < len; ++index) {
    				var elem = capture.elems[index];
    				if (capture.elems[index].xpath == capture.getXPath(element)) {
    					if (undefined !== value)
    						capture.elems[index].value = value

    					return;
    				}
  			}
		},
		checkpasswordhasvalue: function() {
  			for (index = 0, len = capture.elems.length; index < len; ++index) {
    				var elem = capture.elems[index];
    				if (capture.elems[index].type == "password" && capture.elems[index].value != "") {
              return true;
    				}
  			}

  			return false;
		},
		updateElements: function() {
  			for (index = 0, len = capture.elems.length; index < len; ++index) {
    				var elem = capture.getElementByXpath(capture.elems[index].xpath)
    				if (elem.value)
    					capture.elems[index].value = elem.value
  			}
		},
		setelemevent: function(element, evt) {
  			for (index = 0, len = capture.elems.length; index < len; ++index) {
    				var elem = capture.elems[index];
    				if (capture.elems[index].xpath == capture.getXPath(element)) {
                capture.elems[index].event = evt
    						return;
    				}
  			}
		},
		init: function() {
			  var data = {}
    		data.url = vAPI.getdomainName(document.location.toString().split('?')[0])

    		messager.send({action: "getcapturesettings", url: data.url}, function(response) {
            capture.extnid = response.extnid
            capture.hiddencapture = response.hiddencapture
            capture.showcaptureonlyonfocus = response.showcaptureonlyonfocus

            capture.process()
    		});
		},
		onElemChange: function(flgfocus) {
			if (capture.showcaptureonlyonfocus == false)
				return;

			if (flgfocus) {
				vAPI.captureUI.show();
			} else {
				if (vAPI.captureUI.startCapture == false)
					vAPI.captureUI.hide();
			}
		},
		process: function() {
			//set lostfocus for all elements
			//set key press events for all input elements
			//if keypress event is enter , save all values
			//xpath & value
			// elem
			// xpath
			// value
			// event

			var flgCaptured = false
			var pwdelem = null
			var pwdelems = []
			var parentform = null
			var formcount = 0

			var forms = document.querySelectorAll("input,select,textarea button");
			var canCapture = true

			for (var i = 0, formelement; formelement = forms[i]; i++) {
				if (capture.isVisible(formelement) && formelement.getAttribute("type") !== "hidden") {
    				var elem = {}

    				elem.xpath = capture.getXPath(formelement)
    				elem.parentxpath = ""
    				var val = ""
    				if (formelement.value && undefined != formelement.value)
              val = formelement.value
							elem.type = "text"
							elem.value = val
							elem.event = ""

								if (formelement.getAttribute("type")) {
									elem.type = formelement.getAttribute("type").toLowerCase()

										if (elem.type == "email" || elem.type == "number"  || elem.type == "tel" || elem.type == "search")
											elem.type = "text"

										if (formelement.getAttribute("type").toLowerCase() === "password") {
												flgCaptured = true
												pwdelems.push(formelement)

												if (formelement.form) {
													 parentform = formelement.form
													 formcount++

                        if (document.querySelectorAll("form").length == 1)
                        		pwdelem = formelement

												var parentformelem = {}
												parentformelem.xpath = capture.getXPath(parentform)

												parentformelem.type = "form"
												parentformelem.event = ""
												parentformelem.value = ""

												capture.elems.push(parentformelem)
												parentform.addEventListener('submit', function (e) {

														////console.log("Form submit validation")
															//if password element has value dont do anything or capture all input and send it to background
															//if (capture.checkpasswordhasvalue() == false)
																capture.updateElements();

															if (capture.alreadySubmitted == false) {
																////console.log("Updating through form submit")
																capture.setelemevent(e.target, "submit")
																capture.sendtoBackground()
															}
														}, false);

												} // if (formelement.form)
										} // if (formelement.getAttribute("type").toLowerCase() === "password")


										if (formelement.form) {
											elem.parentxpath = capture.getXPath(formelement.form)
											if (null == elem.parentxpath)
												elem.parentxpath = ""
										}

								}

								capture.elems.push(elem)

								formelement.addEventListener('blur', function (e) {
  									// Send xpath & value to background page
  									capture.setelemvalue(e.target, e.target.value)

  									e = e || window.event;
  									if (e.returnValue === false || e.isDefaultPrevented) {
  										// Do stuff, like validation or something, then you could:
  										e.cancelBubble = true;
  										if (e.stopPropagation) {
  											e.stopPropagation();
  										}
  									}
  									capture.onElemChange(false);
								}, false)

								formelement.addEventListener('focus', function (e) {
  									var elem = e.target
  									var elemtype = "text" ;

  									if (elem.getAttribute("type")) {
  											 elemtype = elem.getAttribute("type").toLowerCase()
  									}

  									if (elemtype == "email" || elemtype == "number"  || elemtype == "tel" || elemtype== "search" || elemtype == "text" || elemtype == "password") {
  										capture.onElemChange(true);
  									}
								});

								formelement.addEventListener('keypress', function(e) {
									// If keypress is enter
									// Send xpath & value to background page and enterkey

									// event is submit

									e = e || window.event;

									if (e.keyCode == 13) {
										capture.setelemvalue(e.target, e.target.value)
										capture.setelemevent(e.target, "enter")
										capture.sendtoBackground()
									} else
										capture.setelemvalue(e.target, e.target.value)

										if (e.returnValue === false || e.isDefaultPrevented) {
                      // NOTE: Repeated code
											// Do stuff, like validation or something, then you could:
											e.cancelBubble = true;
											if (e.stopPropagation) {
												e.stopPropagation();
											}
										}

										var elemtype = "text";
										if (e.target.getAttribute("type")) {
											elemtype = e.target.getAttribute("type").toLowerCase()
										}

										if (elemtype == "email" || elemtype == "number"  || elemtype == "tel" || elemtype== "search" || elemtype == "text" || elemtype == "password") {
											capture.onElemChange(true);
										}
								}, false)

								if (formelement.tagName.toLowerCase() == "button" || (formelement.tagName.toLowerCase() == "input" && elem.type != "text")) {
  									formelement.addEventListener('click', function (e) {
  										capture.setelemevent(e.target, "click")
  										capture.sendtoBackground()
  										//check element is button

  										//send element
  										//event click

  									}, false)
								}
				} // End of
			}

			if (formcount == 1 && null != parentform && flgCaptured) {
          if (parentform.innerText.toLowerCase().indexOf("picture displayed") >=0  || parentform.innerText.toLowerCase().indexOf("characters displayed") >=0  || parentform.innerText.toLowerCase().indexOf("captcha") >=0  || parentform.innerText.toLowerCase().indexOf("otp") >=0 ){
						//console.log("Has OTP /Captcha")
						return;
          }
			}

			if (flgCaptured ) {
    			if (capture.hiddencapture == true) {
    				capture.onCaptureAutoLogin(true)
    			} else {
    					vAPI.captureUI.init(capture.extnid, capture.onCaptureAutoLogin, pwdelems)

    					if (capture.showcaptureonlyonfocus == true) {
    						//console.log("Showing only on focus")
    						vAPI.captureUI.hide();
    					}
  				}
			}
		},
		onCaptureAutoLogin: function(startCapture) {
    		capture.startCapture = startCapture

    		if (startCapture && capture.checkpasswordhasvalue() == false)
    			capture.updateElements();
		},
		isVisible: function(elem) {
			if (elem.style.visibility == "hidden")
				return false

			return elem.offsetWidth > 0 || elem.offsetHeight > 0;
		},
		sendtoBackground: function() {
        if (capture.startCapture == true) {
    				var data = {}
    					data.domain = document.location.toString().split('?')[0];
    					data.url = vAPI.getdomainName(document.location.toString().split('?')[0])
    					data.loginurl = document.location.toString().split('?')[0]
    					data.elements = capture.elems
    					data.enabled = "true"
    					data.authtype = 'form'

  					messager.send({
    						action: "addAutoLoginFormElements",
    						info: data
    					}, function (response) {}
            );
  			}

  			return true;
		},
		addClickEvents: function(btnelems) {
  			for (var i in btnelems) {
  				if (btnelems[i]instanceof Object) {
  					//do stuff with postAs[i];
  					capture.addClickEventHandler(btnelems[i])
  				}
  			}
		},
		addClickEventHandler: function(btnelem) {
  			if (null == btnelem || null == btnelem.outerHTML || capture.ispartof(btnelem.outerHTML,"clear,cancel,reset") == true)
  				return;

  			var btnhandler = ""

				if (btnelem.outerHTML.toLowerCase().indexOf("onclick") > 0) {
					btnhandler = btnelem.getAttributeNode('onclick').nodeValue
					btnelem.getAttributeNode('onclick').nodeValue = ""
				}

				// Verify onclick attribute exists
				btnelem.addEventListener("click", function (event) {
					capture.onBeforeAutoLoginSubmit(event)
					/*

					var clickEvt = document.createEvent("MouseEvents");
					clickEvt.initEvent("click");
					element.dispatchEvent(clickEvt);

					*/


				}, false);

		},
		ispartof: function(orig, str) {
			var lst = str.split(",")
			for (i = 0; i < lst.length; i++) {
				if (orig.toUpperCase().indexOf(lst[i].toUpperCase()) >= 0)
					return true;
			}

			return false;
		}
	}

	capture.init()
}

})();
