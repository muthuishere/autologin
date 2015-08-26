if (undefined == autoLogin){

var autoLogin = {
    doc: null,
    initialized: false,
    autologinList: null,
    autologinXMLList: null,
    formObject: null,
    userelemName: null,
    pwdelemName: null,
	sites:[],

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
	triggerkeyevent:function(obj){
	
	 //
						 if(obj.enterelement){
							 console.log("Enter key event ")
							 
							 
							 var elem =autoLogin.getElementByXpath(obj.enterelement.xpath)
							 
						
							 if (elem) elem.focus();
								autoLogin.raiseKeyEvent(elem ,13)
								
							 setTimeout(function() {	
										autoLogin.triggerclick(obj)
									}, 200);
									
									
							
						 }
						 else
							autoLogin.triggerclick(obj)
						 
						
						 
	},
	triggerclick:function(obj){
	
		if(obj.clickelement){
							 
							  console.log("click key event ")
							  console.log(obj.clickelement.xpath)
							 var elem =autoLogin.getElementByXpath(obj.clickelement.xpath)
							
							 var result = autoLogin.raiseClickEvent(elem)
							 	 setTimeout(function() {	
										autoLogin.triggersubmit(obj)
									}, 400);
							
						 } else
							autoLogin.triggersubmit(obj)
						 
	},
	triggersubmit:function(obj){
	
	
						  if(obj.formelement){
							  console.log("Form submit  event ")
							 var elem =autoLogin.getElementByXpath(obj.formelement.xpath)
							 elem.submit();
							 //raise submit event
							
						 }
	},
 
	initiate:function(site){
	try{
	
	

                autoLogin.logmessage("Attempting to Insert");

				var haspassword =false

                var jsonObj = {};
                jsonObj.url = site.url;

                jsonObj.loginurl = site.loginurl
				
			
				 jsonObj.fields =[];
	  
	  
				  var elems = site.elements;
				  
				  for( k=0;k< elems.length ;k++){
					  
					  
					  var field=elems[k]
					  
					 if( field.type  === "password"){
						 var elem =autoLogin.getElementByXpath(field.xpath)
								if(elem)
										haspassword=true;
					 }
					 jsonObj.fields.push(field)
				  }
	  
	 
				
				
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
							
							if( field.type  === "form" ){
								
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
						 
						 var obj={}
						 obj.enterelement=enterelement
						 obj.clickelement=formelement
						 obj.formelement=formelement
						 
						 
						 autoLogin.triggerkeyevent(obj)
						
	  


                    });


                    return;
                }

                autoLogin.logmessage("Invalid Page");



        } catch (exception) {
            console.log("process exception " + exception);
        }
	
	},
	handlePageLoad: function () {



        try {



            if (null == autoLogin.sites || autoLogin.sites.length == 0) {
                autoLogin.logmessage("Data not Loaded")
                return;
            }


			 if ( autoLogin.sites.length == 1) {
				autoLogin.logmessage("Single login")
					autoLogin.initiate(autoLogin.sites[0])
				return
			 }
			 
			 if ( autoLogin.sites.length > 1) {
			 
					//show autlogin info with list of users
					
					var validsites=[]
					//reiterate sites ensure all xpaths are available
				autoLogin.logmessage("Single login")
				
				for(i=0;i<autoLogin.sites.length ;i++){
				
					var cursite=autoLogin.sites[i]
					var canadd=true
					 var elems = cursite.elements;
					  for( k=0;k< elems.length ;k++){
					  
						  var elem =autoLogin.getElementByXpath(elems[k].xpath)
						  
							if(elem)	
								continue
							else
								canadd=false
										
						
					  }
						  if(canadd)
							validsites.push(cursite)
				  
					
				}
				
				
				
				userselect.init(extnid,validsites,function(site){
						
							autoLogin.initiate(site)
				})
				
				
			 }
			 

    },
    
     logmessage: function (aMessage) {


        //  alert(aMessage)

      //  console.log(aMessage)


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
            action: "getData",
			domain:this.getdomainName(document.location.toString())
        }, function (response) {
		

			
            autoLogin.sites=response.sites
            autoLogin.handlePageLoad();
        });




    },
    isDomainValid: function (longStr, searchstr) {



        if (this.getdomainName(longStr) == this.getdomainName(searchstr))
            return true;
        else
            return false;

    },

    getdomainName: function (str) {
	
	if(str.indexOf("http") != 0 && str.indexOf("www")!=0)
			return str
		
			var    a      = document.createElement('a');
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