


var autoLogin = {
	doc:null,
	initialized:false,		
	autologinList:null,	
	autologinXMLList:null,			
	
  readURL:function(url,callback){

		
	
		var req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.onreadystatechange =  function (aEvt) {
		  if (req.readyState == 4) {
			 if(req.status ==200)
			  callback(0,req);
			 else
			  callback(1,"Error reading file " + url);
		  }
		}; 
		req.send(null);
	  
  },
  init: function() {
    
	

		autoLogin.downloadfromServer();
		
	
	
	gBrowser.addEventListener('DOMContentLoaded', function (event) {
    
	var isFrame = (event.target instanceof Ci.nsIDOMHTMLDocument &&
    event.target != gBrowser.contentDocument);
  if (isFrame) {
    return;
  }
 // alert("loaded")
  autoLogin.handlePageLoad();

}, false)
	
	  },
	
  
  uninit: function() {
 
  },

ismatchURL:function(currentURL,elemname){
		

docxml=autoLogin.autologinXMLList;
	
		try{


var divs = docxml.getElementsByTagName("site"), i=divs.length;
  
  if(i == 0)
	  return false;

while (i--) {
			
		
		iurl=autoLogin.getXMLElementval(divs[i],elemname);
		if(autoLogin.isDomainValid(currentURL,iurl)  ){
					
						  return divs[i];
		}
						  

		}

		 }catch(exception){
			 
			alert("Issue" + exception) 

		 }

			return false;

	},

isLoginPage: function(currentURL) {
	  
	  
	 
	  if(autoLogin.autologinList == null){
	  	autoLogin.logmessage("autologinList null");
		  return false;
	  }

	var flgReturn=autoLogin.ismatchURL(currentURL,"loginurl");
	  return flgReturn;
	  
  },
isValidURL: function(currentURL) {
	  
	  
	 
	  if(autoLogin.autologinList == null){
	
		  return false;
	  }


	var flgReturn=autoLogin.ismatchURL(currentURL,"url");
	  return flgReturn;
	  
  },
  
  getelembyid: function(id) {

var elemid=document.getElementById(id);
  if(elemid != undefined  && elemid != null ){
	return elemid;  
  }
  
  
  return null;
  },
   startsWith:function (data,str) {
        return !data.indexOf(str);
    },


   jq: function(formulae) {
	    $mb = jQuery.noConflict();		
	   return $mb(formulae, document);
   },
     hasalreadyloggedin: function(formulae) {
	   
	   if(formulae == "")
	   		return false;
	   

try{	  
	  var elemhtml=autoLogin.jq(formulae);
	  
	  if (null != elemhtml.html())
	  	return true;
	  
}catch(exception){
	
}

return false;
	
 
  
  },
   getformelem: function(formname) {
	   
	   if(autoLogin.startsWith(formname,"$") && formname.indexOf("=") > 0){
		   lformname=formname.replace("$","");
		   	   
			   splitelem=lformname.split("=");
			   attribName=splitelem[0];
   			   findValue=splitelem[1];
			   //alert("find " + attribName + "==" + findValue);
			   var divs = document.getElementsByTagName("form"), i=divs.length;
	while (i--) {
		
	   if ( divs[i].getAttribute(attribName) !== null){
		   
		   var attribValue=divs[i].getAttribute(attribName);
			attribValue=attribValue.toLowerCase();
			findValue=findValue.toLowerCase();
			
		   if(findValue == attribValue  ){
			
				 return divs[i];
		   }
	   } 
	}
	
	//alert("Cannot find form " + formname)
			return null;
	   
	   }else{
	  var formelem=autoLogin.getelembyidname("form",formname)
	  

		
			return formelem;
	}

		//alert("elemname is null" + elemname);
	return null;
	
 
  
  },
  getinputelem: function(formname,elemname) {
	  var formelem=autoLogin.getformelem(formname)
	  
	if(formelem == null){
	//	alert("form is null" + formname);
			return null;
	}
	
	var divs = formelem.getElementsByTagName("input"), i=divs.length;
	while (i--) {
		
	   if ( divs[i].getAttribute("name") !== null){
		   
		   var divcontainername=divs[i].getAttribute("name");
			divcontainername=divcontainername.toLowerCase();
			elemname=elemname.toLowerCase();
			
		   if(divcontainername == elemname  ){
			
				 return divs[i];
		   }
	   } 
	}
	
		//alert("elemname is null" + elemname);
	return null;
	
 
  
  },
  

 
  getelembyidname: function(tagname,elemname) {
	  var elem=autoLogin.getelembyid(elemname)
	  
	  if(elem == null)
	  	return autoLogin.getelembyname(tagname,elemname)
	else
		return elem;
	  
  },
  getelembyname: function(tagname,elemname) {

	

	var divs = document.getElementsByTagName(tagname), i=divs.length;
	while (i--) {
		
	   if ( divs[i].getAttribute("name") !== null){
		   
		   var divcontainername=divs[i].getAttribute("name");
			divcontainername=divcontainername.toLowerCase();
			elemname=elemname.toLowerCase();
			
		   if(divcontainername.indexOf(elemname) != -1  ){
			
				 return divs[i];
		   }
	   } 
	}
	
	return null;
  },fireMouseEvent: function (type, node) {
    var doc = node.ownerDocument;
    var event = doc.createEvent("MouseEvents");
    event.initMouseEvent(type, true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    return node.dispatchEvent(event);
},

  handlePageLoad: function() {
	  
	  
	
		try{

//if(1 == 1){
//	autoLogin.hasalreadyloggedin('ul#memberTools:contains("Log Out")');
//	
//alert("log in");
//	autoLogin.hasalreadyloggedin('ul#memberTools:contains("Log In")');
//return;	
//}
				 
	  if(autoLogin.autologinList == null){
			autoLogin.logmessage("Data not Loaded")
		  return ;
	  }
	  
	var  curlocation=document.location.toString();
	  
	  xmlObj=autoLogin.isLoginPage(curlocation)
	
	

	  if(xmlObj == false){
	  autoLogin.logmessage("Not login Page")
		return
	  
	  }else{
	  	  	autoLogin.logmessage("Is Login Page");
			
			 
			
	  }
	  
	  
	  if(xmlObj != false){

autoLogin.logmessage("Attempting to Insert");



 var jsonObj= {}; 
jsonObj.url=autoLogin.getXMLElementval(xmlObj,"url");

	  jsonObj.loginurl=autoLogin.getXMLElementval(xmlObj,"loginurl");
	  jsonObj.username=autoLogin.getXMLElementval(xmlObj,"username");
	
		   jsonObj.password=autoLogin.getXMLElementval(xmlObj,"password");
	  jsonObj.userelement=autoLogin.getXMLElementval(xmlObj,"userelement");
	  jsonObj.pwdelement=autoLogin.getXMLElementval(xmlObj,"pwdelement");
	  
	  
	  jsonObj.btnelement=autoLogin.getXMLElementval(xmlObj,"btnelement");
	  jsonObj.formelement=autoLogin.getXMLElementval(xmlObj,"formelement");
	  
	  
	  jsonObj.alreadyloggedelement=autoLogin.getXMLElementval(xmlObj,"alreadyloggedelement");




		  var doc= document;
		 userelem=autoLogin.getinputelem(jsonObj.formelement, jsonObj.userelement)
		 pwdelem=autoLogin.getinputelem(jsonObj.formelement,jsonObj.pwdelement)
		 
		 if(userelem != null && pwdelem != null ){
			 
			userelem.value= jsonObj.username;
			pwdelem.value= jsonObj.password;
			
			chrome.runtime.sendMessage({action: "cansubmit"}, function(response) {
			
			if(response.actionresponse == false){
			console.log("Cannot submit the form")
			return 
			}
			console.log("Submitting form")
			if(jsonObj.btnelement == ""){
			//Submit form	
				formelem=autoLogin.getformelem(jsonObj.formelement);// autoLogin.getelembyidname("form",);
				//alert("submitting" + autoLogin.dump(formelem));
				formelem.submit();
		
			}else{
				btnelem=autoLogin.getinputelem(jsonObj.formelement,jsonObj.btnelement);
				autoLogin.fireMouseEvent("click", btnelem);
			//	sleep(5);
			}
			
			
			});
			
			
			return;
		 }

		 	autoLogin.logmessage("Invalid Page");
		  
		  	//var myJSONObject = [ {"url": "http://www.facebook.com",  "loginurl": "http://www.facebook.com", "issame": "1","userelement": "email", "pwdelement": "email","type":"submit", "btnelement": "","frmelement": "login_form"}, {"url": "http://localhost/cash/facebook.htm",  "loginurl": "http://localhost/cash/facebook.htm", "issame": "1","userelement": "email", "pwdelement": "email","type":"submit", "btnelement": "","frmelement": "login_form"}]
			
//$mb = jQuery.noConflict();




		
		  
	  }
	
		}catch(exception){
		alert("process exception " + exception);	
		}
			
  },
	logmessage:function(aMessage) {


//  alert(aMessage)

console.log(aMessage)

	
},
dump: function(arr,level)
 {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
},



setprefs: function(_user,_pwd,_earnings) {
autoLogin.user=_user;
autoLogin.pwd=_pwd;
var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService).getBranch("accessibility.");


	

},

	geturlResult: function(url) {
		var resp="";
		 var req = new XMLHttpRequest();  
		
		  req.open('GET', url, false);  
		   autoLogin.logmessage(url );
		  req.send(null);  
		  if(req.status == 200)  {
			//autoLogin.logmessage(req.responseText);  
			 resp=req.responseText;
		  }else{
			  autoLogin.logmessage(req.status );
		  }
		  
		  return resp;
	},


	
	getXMLElementval:function(node,elemName){
		
		try{
			val= node.getElementsByTagName(elemName)[0].firstChild.nodeValue;
			return val
		}catch(exception){
			return "";	
		}
	},
	updateResponse:function(docxml){
		
var dummyresp='';

autoLogin.autologinXMLList=docxml;
		var jsonresp = new Array();


		try{

  autoLogin.logmessage(docxml );
var divs = docxml.getElementsByTagName("site"), i=divs.length;
  autoLogin.logmessage("getResposnseasJSON" + i );
  if(i == 0)
	  return null;
	  

	  /**
	  
	  <url>www.facebook.com</url>
<loginurl>www.facebook.com</loginurl>
<username>walterw43@gmail.com</username>
<password>test1234</password>
<userelement>email</userelement>
<pwdelement>pass</pwdelement>
<btnelement></btnelement>
<formelement>login_form</formelement>
	  */
while (i--) {
	
	 var partner= {}; 
partner.url=autoLogin.getXMLElementval(divs[i],"url");

	  partner.loginurl=autoLogin.getXMLElementval(divs[i],"loginurl");
	 // partner.username=autoLogin.getXMLElementval(divs[i],"username");
	
		   partner.password=autoLogin.getXMLElementval(divs[i],"password");
	  partner.userelement=autoLogin.getXMLElementval(divs[i],"userelement");
	  partner.pwdelement=autoLogin.getXMLElementval(divs[i],"pwdelement");
	  
	  
	  partner.btnelement=autoLogin.getXMLElementval(divs[i],"btnelement");
	  partner.formelement=autoLogin.getXMLElementval(divs[i],"formelement");
	   
		jsonresp.push(partner);
//alert(autoLogin.dump(partner) );
}

dummyresp=JSON.stringify(jsonresp);

autoLogin.autologinList=dummyresp;

    autoLogin.logmessage(dummyresp);

		return true;  
		 }catch(exception){
			 
			alert("decode issue" + exception) 
			return null;
		 }



	},
	loadXMLDoc:function(dname) { 


	  xhttp=new XMLHttpRequest(); 

	xhttp.open("GET",dname,false); 
	xhttp.send(); 
	
	autoLogin.updateResponse( xhttp.responseXML)
	}, 
	servercallback:function(flgError,req){
		
		if(flgError == 1){
			alert(req);
			return;
		}
//	alert(req.responseText);
//return req.responseText
		autoLogin.updateResponse(req.responseXML)
		
		},	
			
	
	downloadfromServer:function(){
		url=autoLogin.server + autoLogin.getuserdata;
		autoLogin.readURL(url,autoLogin.servercallback)
	

	},
	
isDomainValid:function(longStr,searchstr){
	


	if(this.getdomainName(longStr) == this.getdomainName(searchstr))
		return true;	
		else
		return false;

},

getdomainName:function(str){
	var    a      = document.createElement('a');
         a.href = str;
return a.hostname

	 //return str.replace(/\/+$/, '');
},
  

	 
	   goTrackURL: function() {

	trackURL=document.getElementById("gotrackButton").getAttribute("tooltiptext");

		if(trackURL != "")
			autoLogin.onPointsUpdate(trackURL);


	
	autoLogin.closeNotificationBar();
	
		
	  },
	  
	 

	////////////////////////////////////////////////////////////////////////////
	// The LoadURL() function loads the specified URL in the browser.
	////////////////////////////////////////////////////////////////////////////
	LoadURL: function(url)
	{
		// Set the browser window's location to the incoming URL
		window._content.document.location = url;
	
		// Make sure that we get the focus
		window.content.focus();
	},


	

	////////////////////////////////////////////////////////////////////////////
	// The TrimString() function will trim all leading and trailing whitespace
	// from the incoming string, and convert all runs of more than one whitespace
	// character into a single space. The altered string gets returned.
	////////////////////////////////////////////////////////////////////////////
	TrimString: function(string)
	{
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





autoLogin.loadXMLDoc(chrome.extension.getURL('autologin.xml'))
autoLogin.handlePageLoad();
//window.addEventListener("load", function(e) { autoLogin.handlePageLoad(); }, false); 
//window.addEventListener("unload", function() {autoLogin.uninit()}, false);




