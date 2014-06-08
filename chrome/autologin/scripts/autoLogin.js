if (undefined == autoLogin){

var autoLogin = {
    doc: null,
    initialized: false,
    autologinList: null,
    autologinXMLList: null,
    formObject: null,
    userelemName: null,
    pwdelemName: null,


    ismatchURL: function (currentURL, elemname) {


        docxml = autoLogin.autologinXMLList;

        try {


            var divs = docxml.getElementsByTagName("site"),
                i = divs.length;

            if (i == 0)
                return false;

            while (i--) {


                iurl = autoLogin.getXMLElementval(divs[i], elemname);
                if (autoLogin.isDomainValid(currentURL, iurl)) {

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

        var flgReturn = autoLogin.ismatchURL(currentURL, "loginurl");
        return flgReturn;

    },
    isValidURL: function (currentURL) {



        if (autoLogin.autologinList == null) {

            return false;
        }


        var flgReturn = autoLogin.ismatchURL(currentURL, "url");
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

    handlePageLoad: function () {



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