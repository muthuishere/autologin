var autoLoginOptions = {    
    autologinXMLList: null,
	changedDomains:new Array(),

	createXMLElement:function(node,elemName){
	
	var xmldoc=autoLoginOptions.autologinXMLList;
	
	newel=xmldoc.createElement(elemName);
		
		
		newtext=xmlDoc.createTextNode('');
		newel.appendChild(newtext);
		node.appendChild(newel);


	},
	
	setXMLElementval:function(node,elemName,val){
		
		try{
		
		if(node.getElementsByTagName(elemName) == null)
			return false;

		
		
		
			node.getElementsByTagName(elemName)[0].firstChild.nodeValue=val;
			return true;
		}catch(exception){
				
		}
	},
	validateViewOptions:function(event){
	 
	 var curpwd=document.getElementById("txtaskpassword").value;

	
	
	 
	 
	 	chrome.extension.sendMessage({action: "validateCredential",info:curpwd}, function(response) {
				
				if(response.valid){
				
					autoLoginOptions.loadOptions();
				
				}else{
				
					alert("Invalid Credentials")
				
				}
				
				});
				
		
		
		
	
	},
	infoChanged:function(event){
	 var domainrow=event.target.parentNode.parentNode;
	  autoLoginOptions.changedDomains.push(domainrow.getAttribute("domainname"));
	  var autoLoginObject=autoLoginOptions.searchdomain(domainrow.getAttribute("domainname"))
	  
	event.target.className += ' inputChanged';
	if(event.target.getAttribute("type")=="text"){
	
		autoLoginOptions.setXMLElementval(autoLoginObject,"username",event.target.value)
	
	}else if(event.target.getAttribute("type")=="password"){
	
	
	autoLoginOptions.setXMLElementval(autoLoginObject,"password",event.target.value)
	
	}else if(event.target.getAttribute("type")=="checkbox"){
	
	if(event.target.checked)
	  autoLoginOptions.setXMLElementval(autoLoginObject,"enabled","true")
	 else
		autoLoginOptions.setXMLElementval(autoLoginObject,"enabled","false")
	}
	
	},
	init:function(){
	
	
	
		var buttonaskPassword = document.querySelector('input#btnaskpassword');
		 buttonaskPassword.addEventListener('click', autoLoginOptions.validateViewOptions, false);
		 
		 
	},
    loadOptions: function () {

	
	
	document.querySelector('div#divpasswordask').style.display="none";
	document.querySelector('div#divoptionContainer').style.display="";
	
        var rawxml = Helper.decrypt(localStorage["autologinxml"]);
		
       var tblCreated= autoLoginOptions.loadDocumentAndCreateTable(rawxml);
        //tblOptions
		//Add
		if(tblCreated){
		
		//Add event listeners to remove
        var removeElements = document.querySelectorAll('a.remove');
        for (var i = 0, removeElement; removeElement = removeElements[i]; i++) {
            //work with element
            removeElement.addEventListener('click', autoLoginOptions.removeAutologin, false);

        }
		
		var inputElements = document.querySelectorAll('input.inp');
        for (var i = 0, inputElement; inputElement = inputElements[i]; i++) {
            //work with element
			console.log(inputElement)
            inputElement.addEventListener('change', autoLoginOptions.infoChanged, false);

        }
		
		
		
		
		 var buttonUpdate = document.querySelector('a#btnUpdate');
		 buttonUpdate.addEventListener('click', autoLoginOptions.updateAutologin, false);
		
		}else{
		//remove table and buttons
		
			document.querySelector('div#divoptionContainer').innerHTML="No Sites Available for Auto Login"
		}
		

    },
	
    removeAutologin: function (event) {

	//find domain 
	//remove from autologinxmllist
	
	
	 var docxml=autoLoginOptions.autologinXMLList ;
	 
	 var domainrow=event.target.parentNode.parentNode.parentNode;
	 //console.log(domainrow)
	 var domainname=domainrow.getAttribute("domainname");
	 
	 
	 var autoLoginObject=autoLoginOptions.searchdomain(domainname)
	 
	 
	 if(null != autoLoginObject)
		autoLoginObject.parentNode.removeChild(autoLoginObject);
				
	 
	 domainrow.parentNode.removeChild(domainrow);
	 
        return false;
		
		
    },
	
searchdomain:function(domainname){
		

		var docxml=autoLoginOptions.autologinXMLList;
			
		


		var sites = docxml.getElementsByTagName("site"), i=sites.length;
		  
		 if(i <=0)
		 return null;

		while (i--) {
					
				
				iurl=autoLoginOptions.getXMLElementval(sites[i],"url");
				if(autoLoginOptions.getdomainName(iurl)  == domainname  ){
							
							return sites[i];
							
								 
				}
								  

				}
				
				return null;

				

	},
	
	updateinputBoxStyle:function(){
	
	var inputElements = document.querySelectorAll('input.inp');
        for (var i = 0, inputElement; inputElement = inputElements[i]; i++) {
            //work with element
			inputElement.className=inputElement.className.replace("inputChanged" ,"")
        }
		
	
	},
	updateAutologin:function(event){
	
	
	
	   var oSerializer = new XMLSerializer();
        var rawxml = oSerializer.serializeToString(autoLoginOptions.autologinXMLList);
        localStorage["autologinxml"] = Helper.encrypt(rawxml);
	
		
			chrome.extension.sendMessage({action: "refreshData"}, function(response) {
				
				autoLoginOptions.updateinputBoxStyle();
				alert("Successfully Updated")
				
				});
				
		

	  return false;
	},
    getXMLElementval: function (node, elemName) {

        try {
            val = node.getElementsByTagName(elemName)[0].firstChild.nodeValue;
            return val
        } catch (exception) {
            return "";
        }
    },
    loadDocumentAndCreateTable: function (rawxml) {

		flgTblCreated=false;


        var parser = new DOMParser();
        var docxml = parser.parseFromString(rawxml, "text/xml");


        var dummyresp = '';

        autoLoginOptions.autologinXMLList = docxml;
        var jsonresp = new Array();


     //   try {

            //autoLoginOptions.logmessage(docxml );
            var divs = docxml.getElementsByTagName("site"),
                i = divs.length;
           
            if (i == 0)
                return flgTblCreated;


            while (i--) {

                var autoLoginInfo = {};
                autoLoginInfo.url = autoLoginOptions.getXMLElementval(divs[i], "url");

                autoLoginInfo.loginurl = autoLoginOptions.getXMLElementval(divs[i], "loginurl");
                 autoLoginInfo.username=autoLoginOptions.getXMLElementval(divs[i],"username");

                autoLoginInfo.password = autoLoginOptions.getXMLElementval(divs[i], "password");
                autoLoginInfo.userelement = autoLoginOptions.getXMLElementval(divs[i], "userelement");
                autoLoginInfo.pwdelement = autoLoginOptions.getXMLElementval(divs[i], "pwdelement");


                autoLoginInfo.btnelement = autoLoginOptions.getXMLElementval(divs[i], "btnelement");
                autoLoginInfo.formelement = autoLoginOptions.getXMLElementval(divs[i], "formelement");
                autoLoginInfo.enabled = autoLoginOptions.getXMLElementval(divs[i], "enabled");
				autoLoginInfo.domain=autoLoginOptions.getdomainName( autoLoginInfo.url)
                if (null == autoLoginInfo.enabled || "" == autoLoginInfo.enabled)
                    autoLoginInfo.enabled = "true"
				
					autoLoginOptions.createRow(autoLoginInfo)				
					flgTblCreated=true;
                jsonresp.push(autoLoginInfo);
				
            }

            //dummyresp = JSON.stringify(jsonresp);

            

            //autoLoginOptions.logmessage(dummyresp);

            
       /* } catch (exception) {

            console.log("decode issue" + exception)
            
        } */

   return flgTblCreated;
    },

   
	getdomainName:function(str){
			var    a      = document.createElement('a');
			 a.href = str;
			return a.hostname
	},
	
	createRow:function(autoLoginInfo){
	
	
			var autologinChecked=""
			if(autoLoginInfo.enabled == "true"){
				autologinChecked="CHECKED"
			}
			
			 var row = document.querySelector("#tblOptions").insertRow(-1);
row.setAttribute("domainname",autoLoginInfo.domain)
row.innerHTML =	 "<td style='text-align:left'>"+ autoLoginInfo.domain+"</td>"+
        "<td><input class='inp' type='text' value='"+autoLoginInfo.username +"'/></td>"+
		"<td><input class='inp' type='password' value='"+autoLoginInfo.password +"'/></td>"+
		"<td><input class='inp' type='checkbox' value='1' "+autologinChecked +"  /></td>"+
        "<td> <a  class='remove' href='#'><img src='images/delete.png' class='btnDelete'/></a> </td>";
	
	}

};


 
 
 





window.addEventListener('load', autoLoginOptions.init);
