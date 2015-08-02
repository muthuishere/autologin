if (undefined == autoLogin){

var autoLogin = {
    doc: null,
    initialized: false,
    autologinList: null,
    autologinXMLList: null,
    formObject: null,
    userelemName: null,
    pwdelemName: null,

    ismatchURL: function (currentURL, elemname,authtype) {


        docxml = autoLogin.autologinXMLList;

        try {


            var divs = docxml.getElementsByTagName("site"),
                i = divs.length;

            if (i == 0)
                return false;

            while (i--) {


		
				 
			
                iurl = autoLogin.getXMLElementval(divs[i], elemname);
                if (autoLogin.isDomainValid(currentURL, iurl) && divs[i].getAttribute("authtype") == "form") {

                    return divs[i];
                }


            }

        } catch (exception) {

            console.log("Issue" + exception)

        }

        return false;

    },

    isLoginPage: function (currentURL) {



        if (autoLogin.autologinList == null) {
            autoLogin.logmessage("autologinList null");
            return false;
        }

        var flgReturn = autoLogin.ismatchURL(currentURL, "loginurl","form");
        return flgReturn;

    },
    isValidURL: function (currentURL) {



        if (autoLogin.autologinList == null) {

            return false;
        }


        var flgReturn = autoLogin.ismatchURL(currentURL, "url","form");
        return flgReturn;

    },

    getelembyid: function (id) {

        var elemid = document.getElementById(id);
        if (elemid != undefined && elemid != null) {
            return elemid;
        }


        return null;
    },
    startsWith: function (data, str) {
        return !data.indexOf(str);
    },


    initFormObject: function (formname) {

        var formObject = autoLogin.getelembyidname("form", formname)

        autoLogin.formObject = null;
        console.log(formObject)
        if (null != formObject) {

            autoLogin.formObject = formObject;


        } else {



            var forms = document.querySelectorAll('form');
            var formelement;
            for (var i = 0, formelement; formelement = forms[i]; i++) {
                //work with element

                var inputpwdelems = formelement.querySelectorAll('input[type="password"]');
                var inputtxtelems = formelement.querySelectorAll('input[type="text"]');

                var inputuserelem = formelement.querySelector('input[name="' + autoLogin.userelemName + '"]');
                var inputpwdelem = formelement.querySelector('input[name="' + autoLogin.pwdelemName + '"]');


                if (null != inputuserelem && null != inputpwdelem && inputpwdelems.length == 1) {
                    autoLogin.formObject = formelement;
                    break;
                }


            }

        }




    },
    getinputelem: function (elemname) {


        var formelem = autoLogin.formObject

         if (formelem == null ||  formelem == "") {
            	//alert("form is null" + elemname);
            // return null;
			formelem=document.querySelector('body')
         }

        var inputelem = formelem.querySelector('input[name="' + elemname + '"]');
        if (null == inputelem)
            inputelem = formelem.querySelector('input[id="' + elemname + '"]');



        return inputelem;




    },



    getelembyidname: function (tagname, elemname) {
        var elem = autoLogin.getelembyid(elemname)

        if (elem == null)
            return autoLogin.getelembyname(tagname, elemname)
        else
            return elem;

    },
    getelembyname: function (tagname, elemname) {


        return document.querySelector(tagname + '[name="' + elemname + '"]');

    },
    fireMouseEvent: function (type, node) {
        var doc = node.ownerDocument;
        var event = doc.createEvent("MouseEvents");
        event.initMouseEvent(type, true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        return node.dispatchEvent(event);
    },
 getElementByXpath:function  (path) {
		
		 var evaluator = new XPathEvaluator(); 
    var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
    return  result.singleNodeValue; 
	
		/*return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; */
	},	
	raiseClickEvent:function(elem){
		try{
			
			
		 var evt = document.createEvent("MouseEvents");
		  evt.initMouseEvent("click", true, true, window,
			0, 0, 0, 0, 0, false, false, false, false, 0, null);
		  
		  var canceled = !elem.dispatchEvent(evt);
		  if(canceled) {
			// A handler called preventDefault
			//alert("canceled");
			return false
		  } else {
			// None of the handlers called preventDefault
			//alert("not canceled");
			return true
		  }
		  
		}catch(Exception){
			
			return false;
		}
  
	},
	raiseKeyEvent:function(elem,keycode){
		
		var keyboardEvent = document.createEvent("KeyboardEvent");
		var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
		console.log(keycode)

		keyboardEvent[initMethod](
						   "keydown", // event type : keydown, keyup, keypress
							true, // bubbles
							true, // cancelable
							window, // viewArg: should be window
							false, // ctrlKeyArg
							false, // altKeyArg
							false, // shiftKeyArg
							false, // metaKeyArg
							13, // keyCodeArg : unsigned long the virtual key code, else 0
							0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
		);
		var event = document.createEvent('KeyboardEvent');
		Object.defineProperty(event, 'keyCode', {     
							get : function(){
								return this.keyCodeVal;
							}
						})
						elem.dispatchEvent(keyboardEvent);
		//var res = document.body.dispatchEvent(keyboardEvent);
		
	},
 handlePageLoad: function () {



        try {



            if (autoLogin.autologinList == null) {
                autoLogin.logmessage("Data not Loaded")
                return;
            }

            var curlocation = document.location.toString();

			console.log(curlocation)
            xmlObj = autoLogin.isLoginPage(curlocation)


console.log(xmlObj)
            if (xmlObj == false) {
                autoLogin.logmessage("Not login Page")
                return

            } else {
                autoLogin.logmessage("Is Login Page");



            }


            if (xmlObj != false) {

                autoLogin.logmessage("Attempting to Insert");

				var haspassword =false

                var jsonObj = {};
                jsonObj.url = autoLogin.getXMLElementval(xmlObj, "url");

                jsonObj.loginurl = autoLogin.getXMLElementval(xmlObj, "loginurl");
				
			
				 jsonObj.fields =[];
	  
	  
				  var elems = xmlObj.getElementsByTagName("element");
				  
				  for( k=0;k< elems.length ;k++){
					  
					  var field={}
					 field.xpath= autoLogin.getXMLElementval(elems[k],"xpath");
					 field.type= autoLogin.getXMLElementval(elems[k],"type");
					 field.value= autoLogin.getXMLElementval(elems[k],"value");
					 field.event= autoLogin.getXMLElementval(elems[k],"event");
					 if( field.type  === "password"){
						 var elem =autoLogin.getElementByXpath(field.xpath)
								if(elem)
										haspassword=true;
					 }
					 jsonObj.fields.push(field)
				  }
	  
	 
				
				/*
                jsonObj.username = autoLogin.getXMLElementval(xmlObj, "username");

                jsonObj.password = autoLogin.getXMLElementval(xmlObj, "password");
                jsonObj.userelement = autoLogin.getXMLElementval(xmlObj, "userelement");
                jsonObj.pwdelement = autoLogin.getXMLElementval(xmlObj, "pwdelement");


                jsonObj.btnelement = autoLogin.getXMLElementval(xmlObj, "btnelement");
                jsonObj.formelement = autoLogin.getXMLElementval(xmlObj, "formelement");


                autoLogin.userelemName = jsonObj.userelement
                autoLogin.pwdelemName = jsonObj.pwdelement

                autoLogin.initFormObject(jsonObj.formelement)
				
				*/
                var doc = document;
               
                

                if (haspassword) {

                    

                    chrome.runtime.sendMessage({
                        action: "cansubmit"
                    }, function (response) {

                        if (response.actionresponse == false) {
                            console.log("Cannot submit the form")
                            return
                        }
						
						//TODO Use JSONObj
						
                        console.log("Submitting form")
						
						var enterelement=null
						var formelement =null
						var clickelement =null
						
						//event priority , if 
						for( k=0;k< jsonObj.fields.length ;k++){
							var field =  jsonObj.fields[k] 
							
							if( field.type  === "form" && field.event  !== ""){
								
								formelement=field
							}
							if( (field.type  !== "text" && field.type  !== "form" ) && field.event  !== ""){
								
								clickelement=field
							}
							if( (field.type  === "text"  ) && field.event  !== ""){
								
								enterelement=field
							}
							
							if( field.value  !== "" && (field.type  !== "button" && field.type  !== "submit"  ) ){
								
								var elem =autoLogin.getElementByXpath(field.xpath)
								if(elem){
									
									elem.value=field.value
									console.log(elem.value)
								}
								
							}
						 }
						 console.log("=======================")
						 //
						 if(enterelement){
							 console.log("Enter key event ")
							 
							 
							 var elem =autoLogin.getElementByXpath(enterelement.xpath)
							 
							 elem.addEventListener('keydown',function(e){
											
											//if keypress is enter
											//send xpath & value to background page and enterkey
											
											// event is submit
													
											  e = e || window.event;
											  console.log("Enter element event handler")
											  console.log(e)
											   if (e.returnValue === false || e.isDefaultPrevented)
							 {
								  
								 //do stuff, like validation or something, then you could:
								 e.cancelBubble = true;
								 if (e.stopPropagation)
								 {
									 e.stopPropagation();
								 }
							 }
								return true;			
					  
						},false);
						
							 if (elem) elem.focus();
							 autoLogin.raiseKeyEvent(elem ,13)
							
						 }
						 if(clickelement){
							 
							  console.log("click key event ")
							  console.log(clickelement.xpath)
							 var elem =autoLogin.getElementByXpath(clickelement.xpath)
							 console.log(elem)
							 var result = autoLogin.raiseClickEvent(elem)
							 
							 //if result was true return or try to submit via form 
							 if(result)
								return;
						 }
						  if(formelement){
							  console.log("Form submit  event ")
							 var elem =autoLogin.getElementByXpath(formelement.xpath)
							 elem.submit();
							 //raise submit event
							 return;
						 }
	  
						/*
                        if (jsonObj.btnelement == "") {
                            //Submit form	

                            //alert("submitting" + autoLogin.dump(formelem));
                            autoLogin.formObject.submit();

                        } else {
                            btnelem = autoLogin.getinputelem(jsonObj.btnelement);
                            autoLogin.fireMouseEvent("click", btnelem);
                            //	sleep(5);
                        }
						*/


                    });


                    return;
                }

                autoLogin.logmessage("Invalid Page");




            }

        } catch (exception) {
            console.log("process exception " + exception);
        }

    },
    
    handlePageLoadOld: function () {



        try {



            if (autoLogin.autologinList == null) {
                autoLogin.logmessage("Data not Loaded")
                return;
            }

            var curlocation = document.location.toString();

            xmlObj = autoLogin.isLoginPage(curlocation)



            if (xmlObj == false) {
                autoLogin.logmessage("Not login Page")
                return

            } else {
                autoLogin.logmessage("Is Login Page");



            }


            if (xmlObj != false) {

                autoLogin.logmessage("Attempting to Insert");



                var jsonObj = {};
                jsonObj.url = autoLogin.getXMLElementval(xmlObj, "url");

                jsonObj.loginurl = autoLogin.getXMLElementval(xmlObj, "loginurl");
				
				
                jsonObj.username = autoLogin.getXMLElementval(xmlObj, "username");

                jsonObj.password = autoLogin.getXMLElementval(xmlObj, "password");
                jsonObj.userelement = autoLogin.getXMLElementval(xmlObj, "userelement");
                jsonObj.pwdelement = autoLogin.getXMLElementval(xmlObj, "pwdelement");


                jsonObj.btnelement = autoLogin.getXMLElementval(xmlObj, "btnelement");
                jsonObj.formelement = autoLogin.getXMLElementval(xmlObj, "formelement");


                autoLogin.userelemName = jsonObj.userelement
                autoLogin.pwdelemName = jsonObj.pwdelement

                autoLogin.initFormObject(jsonObj.formelement)
                var doc = document;
                userelem = autoLogin.getinputelem(jsonObj.userelement)
                pwdelem = autoLogin.getinputelem(jsonObj.pwdelement)

                if (userelem != null && pwdelem != null) {

                    userelem.value = jsonObj.username;
                    pwdelem.value = jsonObj.password;

                    chrome.runtime.sendMessage({
                        action: "cansubmit"
                    }, function (response) {

                        if (response.actionresponse == false) {
                            console.log("Cannot submit the form")
                            return
                        }
                        console.log("Submitting form")
                        if (jsonObj.btnelement == "") {
                            //Submit form	

                            //alert("submitting" + autoLogin.dump(formelem));
                            autoLogin.formObject.submit();

                        } else {
                            btnelem = autoLogin.getinputelem(jsonObj.btnelement);
                            autoLogin.fireMouseEvent("click", btnelem);
                            //	sleep(5);
                        }


                    });


                    return;
                }

                autoLogin.logmessage("Invalid Page");




            }

        } catch (exception) {
            console.log("process exception " + exception);
        }

    },
    logmessage: function (aMessage) {


        //  alert(aMessage)

      //  console.log(aMessage)


    },
    dump: function (arr, level) {
        var dumped_text = "";
        if (!level) level = 0;

        //The padding given at the beginning of the line.
        var level_padding = "";
        for (var j = 0; j < level + 1; j++) level_padding += "    ";

        if (typeof (arr) == 'object') { //Array/Hashes/Objects 
            for (var item in arr) {
                var value = arr[item];

                if (typeof (value) == 'object') { //If it is an array,
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += dump(value, level + 1);
                } else {
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        } else { //Stings/Chars/Numbers etc.
            dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
        }
        return dumped_text;
    },



    setprefs: function (_user, _pwd, _earnings) {
        autoLogin.user = _user;
        autoLogin.pwd = _pwd;
        var prefs = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService).getBranch("accessibility.");




    },

    geturlResult: function (url) {
        var resp = "";
        var req = new XMLHttpRequest();

        req.open('GET', url, false);
        autoLogin.logmessage(url);
        req.send(null);
        if (req.status == 200) {
            //autoLogin.logmessage(req.responseText);  
            resp = req.responseText;
        } else {
            autoLogin.logmessage(req.status);
        }

        return resp;
    },



    getXMLElementval: function (node, elemName) {

        try {
            val = node.getElementsByTagName(elemName)[0].firstChild.nodeValue;
            return val
        } catch (exception) {
            return "";
        }
    },
    init: function () {


        chrome.runtime.sendMessage({
            action: "getData"
        }, function (response) {
		
			var rawxml=response.xml

            autoLogin.loadDocument(rawxml)
            autoLogin.handlePageLoad();
        });




    },
	loadDocument: function (rawxml) {




        var parser = new DOMParser();
        var docxml = parser.parseFromString(rawxml, "text/xml");


        var dummyresp = '';

        autoLogin.autologinXMLList = docxml;
        var jsonresp = new Array();


        try {

           // autoLogin.logmessage(docxml);
            var divs = docxml.getElementsByTagName("site"),
                i = divs.length;
            autoLogin.logmessage("getResposnseasJSON" + i);
            if (i == 0)
                return null;


            while (i--) {

                var partner = {};
                partner.url = autoLogin.getXMLElementval(divs[i], "url");

                partner.loginurl = autoLogin.getXMLElementval(divs[i], "loginurl");
				
							 partner.fields =[];
				  
				  var elems = divs[i].getElementsByTagName("element");
				  
				  for( k=0;k< elems.length ;k++){
					  
					  var field={}
					 field.xpath= autoLogin.getXMLElementval(elems[k],"xpath");
					 field.type= autoLogin.getXMLElementval(elems[k],"type");
					 field.value= autoLogin.getXMLElementval(elems[k],"value");
					 field.event= autoLogin.getXMLElementval(elems[k],"event");
					 partner.fields.push(field)
				  }
				  
	 
	  
	  
              

                jsonresp.push(partner);
                //alert(autoLogin.dump(partner) );
            }

            dummyresp = JSON.stringify(jsonresp);

            autoLogin.autologinList = dummyresp;

            //  autoLogin.logmessage(dummyresp);

            //return true;  
        } catch (exception) {

            console.log("decode issue" + exception)
            //return null;
        }


    },

    loadDocumentold: function (rawxml) {




        var parser = new DOMParser();
        var docxml = parser.parseFromString(rawxml, "text/xml");


        var dummyresp = '';

        autoLogin.autologinXMLList = docxml;
        var jsonresp = new Array();


        try {

           // autoLogin.logmessage(docxml);
            var divs = docxml.getElementsByTagName("site"),
                i = divs.length;
            autoLogin.logmessage("getResposnseasJSON" + i);
            if (i == 0)
                return null;


            while (i--) {

                var partner = {};
                partner.url = autoLogin.getXMLElementval(divs[i], "url");

                partner.loginurl = autoLogin.getXMLElementval(divs[i], "loginurl");
                partner.username = autoLogin.getXMLElementval(divs[i], "username");

                partner.password = autoLogin.getXMLElementval(divs[i], "password");
                partner.userelement = autoLogin.getXMLElementval(divs[i], "userelement");
                partner.pwdelement = autoLogin.getXMLElementval(divs[i], "pwdelement");


                partner.btnelement = autoLogin.getXMLElementval(divs[i], "btnelement");
                partner.formelement = autoLogin.getXMLElementval(divs[i], "formelement");

                jsonresp.push(partner);
                //alert(autoLogin.dump(partner) );
            }

            dummyresp = JSON.stringify(jsonresp);

            autoLogin.autologinList = dummyresp;

            //  autoLogin.logmessage(dummyresp);

            //return true;  
        } catch (exception) {

            console.log("decode issue" + exception)
            //return null;
        }


    },

    isDomainValid: function (longStr, searchstr) {



        if (this.getdomainName(longStr) == this.getdomainName(searchstr))
            return true;
        else
            return false;

    },

    getdomainName: function (str) {
        var a = document.createElement('a');
        a.href = str;
        return a.hostname

        //return str.replace(/\/+$/, '');
    },




    ////////////////////////////////////////////////////////////////////////////
    // The TrimString() function will trim all leading and trailing whitespace
    // from the incoming string, and convert all runs of more than one whitespace
    // character into a single space. The altered string gets returned.
    ////////////////////////////////////////////////////////////////////////////
    TrimString: function (string) {
        // If the incoming string is invalid, or nothing was passed in, return empty
        if (!string)
            return "";

        string = string.replace(/^\s+/, ''); // Remove leading whitespace
        string = string.replace(/\s+$/, ''); // Remove trailing whitespace

        // Replace all whitespace runs with a single space
        string = string.replace(/\s+/g, ' ');

        return string; // Return the altered value
    }
};




autoLogin.init()

}
//window.addEventListener("load", function(e) { autoLogin.handlePageLoad(); }, false); 
//window.addEventListener("unload", function() {autoLogin.uninit()}, false);