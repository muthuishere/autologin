
if (undefined == autoLoginCapture) {

	var autoLoginCapture = {
		captureForm : null,
		elems : [],
		startCapture : false,
		disableIconURL : "",
		enableIconURL : "",
		hoverIconURL : "",
		backgroundIconURL : "",
		alreadySubmitted : false,
		getXPath : function (elm) {

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
					for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
						if (sib.localName == elm.localName)
							i++;
					};
					segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
				};
			};
			return segs.length ? '/' + segs.join('/') : null;

		},
		getXPathold : function (element) {
			var xpath = '';
			for (; element && element.nodeType == 1; element = element.parentNode) {
				var id = $(element.parentNode).children(element.tagName).index(element) + 1;
				id > 1 ? (id = '[' + id + ']') : (id = '');
				xpath = '/' + element.tagName.toLowerCase() + id + xpath;
			}
			return xpath;
		},
		getElementByXpath : function (path) {

			var evaluator = new XPathEvaluator();
			var result = evaluator.evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
			return result.singleNodeValue;

			/*return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; */
		},
		setelemvalue : function (element, value) {

			for (index = 0, len = autoLoginCapture.elems.length; index < len; ++index) {
				var elem = autoLoginCapture.elems[index];
				if (autoLoginCapture.elems[index].xpath == autoLoginCapture.getXPath(element)) {
					if (undefined !== value)
						autoLoginCapture.elems[index].value = value

							return;
				}

			}
		},
		checkpasswordhasvalue : function () {

			for (index = 0, len = autoLoginCapture.elems.length; index < len; ++index) {
				var elem = autoLoginCapture.elems[index];
				if (autoLoginCapture.elems[index].type == "password" && autoLoginCapture.elems[index].value != "") {

					return true;
				}

			}
			return false;

		},
		updateElements : function () {

			for (index = 0, len = autoLoginCapture.elems.length; index < len; ++index) {

				var elem = autoLoginCapture.getElementByXpath(autoLoginCapture.elems[index].xpath)
					if (elem.value)
						autoLoginCapture.elems[index].value = elem.value

			}

		},
		setelemevent : function (element, evt) {

			for (index = 0, len = autoLoginCapture.elems.length; index < len; ++index) {
				var elem = autoLoginCapture.elems[index];
				if (autoLoginCapture.elems[index].xpath == autoLoginCapture.getXPath(element)) {

					autoLoginCapture.elems[index].event = evt
						return;
				}

			}
		},
		init : function () {
			/*
			autoLoginCapture.disableIconURL=extnid +"images/capture_disable.png"
			autoLoginCapture.enableIconURL=extnid +"images/capture_enable.png"
			autoLoginCapture.hoverIconURL=extnid +"images/capture_hover.png"
			autoLoginCapture.backgroundIconURL=extnid +"images/bg.png"
			// if form has one password field and one text field and both elements are visible
			//call the autologin function to show
			 */

			//set lostfocus for all elements
			//set key press events for all input elements
			//if keypress event is enter , save all values
			//xpath & value
			// elem
			// xpath
			// value
			// event


			var flgCaptured = false
				var forms = document.querySelectorAll("input,select,textarea button");

			for (var i = 0, formelement; formelement = forms[i]; i++) {

				if (autoLoginCapture.isVisible(formelement) && formelement.getAttribute("type") !== "hidden") {

					var elem = {}

					elem.xpath = autoLoginCapture.getXPath(formelement)
						val = ""
						if (formelement.value && undefined != formelement.value)
							val = formelement.value

								elem.type = "text"
								elem.value = val
								elem.event = ""

								if (formelement.getAttribute("type")) {
									elem.type = formelement.getAttribute("type").toLowerCase()

										if (formelement.getAttribute("type").toLowerCase() === "password") {
											flgCaptured = true

												if (formelement.form) {
													var parentform = formelement.form
														var parentformelem = {}
													parentformelem.xpath = autoLoginCapture.getXPath(parentform)
														parentformelem.type = "form"
														parentformelem.event = ""
														parentformelem.value = ""

														autoLoginCapture.elems.push(parentformelem)
														parentform.addEventListener('submit', function (e) {

															console.log("Form submit validation")
															//if password element has value dont do anything or capture all input and send it to background
															if (autoLoginCapture.checkpasswordhasvalue() == false)
																autoLoginCapture.updateElements();

															if (autoLoginCapture.alreadySubmitted == false) {

																console.log("Updating through form submit")

																autoLoginCapture.setelemevent(e.target, "submit")
																autoLoginCapture.sendtoBackground()
															}

														}, false);

												}

										}

								}

								autoLoginCapture.elems.push(elem)

								formelement.addEventListener('blur', function (e) {

									//send xpath & value to background page


									autoLoginCapture.setelemvalue(e.target, e.target.value)

									e = e || window.event;
									if (e.returnValue === false || e.isDefaultPrevented) {

										//do stuff, like validation or something, then you could:
										e.cancelBubble = true;
										if (e.stopPropagation) {
											e.stopPropagation();
										}
									}

								}, false)

								formelement.addEventListener('keypress', function (e) {

									//if keypress is enter
									//send xpath & value to background page and enterkey

									// event is submit

									e = e || window.event;

									if (e.keyCode == 13) {
										autoLoginCapture.setelemvalue(e.target, e.target.value)
										autoLoginCapture.setelemevent(e.target, "enter")
										autoLoginCapture.sendtoBackground()

									} else
										autoLoginCapture.setelemvalue(e.target, e.target.value)

										if (e.returnValue === false || e.isDefaultPrevented) {

											//do stuff, like validation or something, then you could:
											e.cancelBubble = true;
											if (e.stopPropagation) {
												e.stopPropagation();
											}
										}

								}, false)

								formelement.addEventListener('click', function (e) {
									autoLoginCapture.setelemevent(e.target, "click")
									autoLoginCapture.sendtoBackground()
									//check element is button

									//send element
									//event click

								}, false)

				}

			}

			if (flgCaptured) {
				autoLoginCaptureIcon.init(extnid,autoLoginCapture.onCaptureAutoLogin)

			}

		},
		onCaptureAutoLogin : function (startCapture ) {

			//console.log("on capture autologin")
		
		autoLoginCapture.startCapture = startCapture

		},
		
		isVisible : function (elem) {
			if (elem.style.visibility == "hidden")
				return false

				return elem.offsetWidth > 0 || elem.offsetHeight > 0;
		},
		sendtoBackground : function () {

			if (autoLoginCapture.startCapture == true) {

				//console.log(autoLoginXmlInfo)

				var data = {}
				data.url = document.location.toString().split('?')[0]
					data.loginurl = document.location.toString().split('?')[0]
					data.elements = autoLoginCapture.elems

					chrome.extension.sendMessage({
						action : "addAutoLoginFormElements",
						info : data
					}, function (response) {

						console.log("Updated data ")

					});
			} else {

				console.log("Not required");
			}

			autoLoginCapture.alreadySubmitted = true;
			return true;
		},

		addClickEvents : function (btnelems) {

			for (var i in btnelems) {
				if (btnelems[i]instanceof Object) {
					//do stuff with postAs[i];
					autoLoginCapture.addClickEventHandler(btnelems[i])
				}
			}

		},
		addClickEventHandler : function (btnelem) {

			if (null == btnelem || null == btnelem.outerHTML || btnelem.outerHTML.ispartof("clear,cancel,reset") == true)
				return;

			var btnhandler = ""

				//console.log(btnelem.outerHTML.toLowerCase())

				if (btnelem.outerHTML.toLowerCase().indexOf("onclick") > 0) {

					btnhandler = btnelem.getAttributeNode('onclick').nodeValue
						btnelem.getAttributeNode('onclick').nodeValue = ""

				}

				//verify onclick attribute exists

				btnelem.addEventListener("click", function (event) {
					autoLoginCapture.onBeforeAutoLoginSubmit(event)
					eval(btnhandler)
				}, false);

		}

	}

	function initAutoLoginCapture() {

		//console.log("Starting listener" +  autoLoginCapture.captureForm)

		if (undefined != autoLoginCapture.captureForm) {
			//console.log("Starting listener" +  autoLoginCapture.captureForm)
			autoLoginCapture.captureForm.addEventListener('submit', autoLoginCapture.onBeforeAutoLoginSubmit, false);

			// Add enter event to password field element
			//Verify Password field has been entered & userfield has been entered

			var pwdElem = autoLoginCapture.captureForm.querySelector("input[type='password']");
			var pwdhandler = ""
				if (pwdElem.outerHTML.toLowerCase().indexOf("onkeydown") > 0) {
					pwdhandler = pwdElem.getAttributeNode('onkeydown').nodeValue
						pwdElem.getAttributeNode('onkeydown').nodeValue = ""
				}

				pwdElem.addEventListener("keydown", function (event) {
					if (event.keycode == 13) {

						//if(autoLoginCapture.captureForm.querySelector("input[type='password']").value !== "" )
						autoLoginCapture.onBeforeAutoLoginSubmit(event)

						eval(pwdhandler)
					}

				}, false);

			var btnelems = autoLoginCapture.captureForm.querySelectorAll("input[type='button']")

				if (null !== btnelems) {

					autoLoginCapture.addClickEvents(btnelems)

				}

				var aTags = autoLoginCapture.captureForm.querySelectorAll("a")
				if (null !== aTags) {
					autoLoginCapture.addClickEvents(aTags)
				}

				var btnTags = autoLoginCapture.captureForm.querySelectorAll('button')

				if (null !== btnTags) {
					autoLoginCapture.addClickEvents(btnTags)

				}

				//Add on click event to any <a> tag or <input> tag or <button> tag
				//Verify Password field has been entered & userfield has been entered

		}

	}

	if (typeof String.prototype.isEqual != 'function') {
		String.prototype.isEqual = function (str) {
			return this.toUpperCase() == str.toUpperCase();
		};
	}

	if (typeof String.prototype.ispartof != 'function') {
		String.prototype.ispartof = function (str) {
			//Split comma delimeted strings and verify

			var lst = str.split(",")

				for (i = 0; i < lst.length; i++) {

					if (this.toUpperCase().indexOf(lst[i].toUpperCase()) >= 0)
						return true;

				}

				return false;
		};
	}

	autoLoginCapture.init()

}
