
	var storage = {

		autologinsites : [],
		
		
		migrateautologinsites:function(){
		
		if(  localStorage["autologinxml"] == undefined  ||  localStorage["autologinxml"] == "")
			return
		
		localStorage["autologinsites"] =[]
		
		var rawxml=Helper.decrypt(localStorage["autologinxml"])
	
		  var parser = new DOMParser();
            var docxml = parser.parseFromString(rawxml, "text/xml");
			
			var legacyjson = new Array();
		
			
			var divs = docxml.getElementsByTagName("site"), i=divs.length;
			
			  if(i == 0)
				  return ;
	  
				var autologinsites=[]
			while (i--) {
			
				var partner={}
				partner.url=globalAutologinHandler.getXMLElementval(divs[i],"url");

				  partner.loginurl=globalAutologinHandler.getXMLElementval(divs[i],"loginurl");
				 partner.username=globalAutologinHandler.getXMLElementval(divs[i],"username");
				
					   partner.password=globalAutologinHandler.getXMLElementval(divs[i],"password");
				  partner.userelement=globalAutologinHandler.getXMLElementval(divs[i],"userelement");
				  partner.pwdelement=globalAutologinHandler.getXMLElementval(divs[i],"pwdelement");
				  
				  
				  partner.btnelement=globalAutologinHandler.getXMLElementval(divs[i],"btnelement");
				  partner.enabled=globalAutologinHandler.getXMLElementval(divs[i],"enabled");
				  partner.formelement=globalAutologinHandler.getXMLElementval(divs[i],"formelement");
				   
				   	if(partner.url == "")
					continue;
				
				
				
				var site={}
				site.authtype='form'
				site.url=partner.url
				site.loginurl=partner.loginurl
				site.enabled= (partner.enabled == "true")
				
				var credentials=[]
				
				var credential={}
				credential.user=partner.username 
				credential.defaultsite=true
				
				var elements=[]
				
				
				
				
				elements.push({"event":"","xpath":'//input[contains(@id,"'+  partner.userelement +'") or contains(@name,"'+  partner.userelement +'")]' ,"value":partner.username ,"type":"text"})
				
			
				
				elements.push({"event":"","xpath":'//input[contains(@id,"'+  partner.pwdelement +'") or contains(@name,"'+  partner.pwdelement +'")]'  ,"value":partner.password ,"type":"password"})
				
				
				//Button
				if(partner.btnelement !== ""){
					
					
					
					elements.push({"event":"click","xpath":'//*[contains(@id,"'+  partner.btnelement +'") or contains(@name,"'+  partner.btnelement +'")]' ,"value":"" ,"type":"button"})
					
				}
				//form
				if(partner.formelement !== ""){
					
					
					elements.push({"event":"submit","xpath": '//*[contains(@id,"'+  partner.formelement +'") or contains(@name,"'+  partner.formelement +'")]' ,"value":"" ,"type":"form"})
					
				}
				
			
				credential.elements=elements
				credentials.push(credential)
				site.credentials=credentials
				autologinsites.push(site)
			}
			
			//delete localStorage["autologinxml"]
			storage.autologinsites=autologinsites
			storage.updatestorage();
			localStorage["autologinxml"]=""
		
		
	},	

	
		
		updatestorage:function(){
		
				localStorage["autologinsites"]=JSON.stringify(storage.autologinsites);
		
		
		
			
		},
		getCredentialAtIndex:function(index){
		
		
		if(index < storage.autologinsites.length)
			return storage.autologinsites[index]
		else
			return null
			
		},
	
		add:function(site){
		
			var isPushed=false;
			
			
				for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					
					if(cursite.authtype == site.authtype && cursite.url == site.url ){
							
							//Iterate credentials
							isPushed=true;
							var isUserModfied=false;
							for (k=0;k<storage.autologinsites[i].credentials.length;k++) {
								
								
								var curcredential=storage.autologinsites[i].credentials[k]
								
								if(curcredential.user == site.user && storage.autologinsites[i].credentials[k].elements.length == site.elements.length ){
									
									isUserModfied=true
									delete storage.autologinsites[i].credentials[k].elements
									storage.autologinsites[i].credentials[k].elements=site.elements
									console.log("modifying credentials" ,site)
									break
								}
									
								
							}
							if(!isUserModfied){
								
								var credential={}
								credential.user=site.user
								credential.defaultsite=false
								credential.elements=site.elements
								storage.autologinsites[i].credentials.push(credential)
								console.log("Adding credentials" ,site)
								
							}
							
							
							//check user already exists
								//if already exists update
								//else
								//create new element entry	
							
							
							break;						
						}
			}
			
			
			if(!isPushed){
			
				var currentsite={}
				currentsite.authtype=site.authtype
				currentsite.url=site.url
				currentsite.loginurl=site.loginurl
				currentsite.enabled=true
				currentsite.credentials=[]
				
				var credential={}
					credential.user=site.user
					credential.defaultsite=true
					credential.elements=site.elements
					
					currentsite.credentials.push(credential)
					console.log("Adding site" ,currentsite)

				storage.autologinsites.push(currentsite)
				
								
			}
				
				
				
			storage.updatestorage();
			
				
			
		},
		credentialExistsForUser:function(site){
		
		
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					if(cursite.authtype == site.authtype && cursite.url == site.url ){
						
							for (k=0;k<storage.autologinsites[i].credentials.length;k++) {
								
								
								var curcredential=storage.autologinsites[i].credentials[k]
								
								if(curcredential.user == site.user){
									
									return true
									
								}
									
								
							}
							
							break;
							
						}
			}
			
			return false
		},
		get:function(authtype,url){
		
		var resultsite=null
		
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					if(cursite.authtype == authtype && cursite.url == url){
							
							resultsite=cursite
						}
			}
			
			
			
			
			return resultsite
			
		},
		changeflag:function(authtype,url,flgenabled){
		
		
		
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					if(cursite.authtype == authtype && cursite.url == url){
							
							storage.autologinsites[i].enabled=flgenabled
						}
			}
			
			storage.updatestorage();
			
		},
	
		updatecredential:function(site){
		
		
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					
					if(cursite.authtype == site.authtype && cursite.url == site.url ){
						
						
						
							var isUserModfied=false;
							for (k=0;k<storage.autologinsites[i].credentials.length;k++) {
								
								
								var curcredential=storage.autologinsites[i].credentials[k]
								
								
									
								
								if(curcredential.user == site.user){
									
									isUserModfied=true
									
									
									
									if(undefined != site.defaultsite){
										//delete storage.autologinsites[i].credentials[k].defaultsite
									storage.autologinsites[i].credentials[k].defaultsite=site.defaultsite
									console.log("Changing default site")
									}
									delete storage.autologinsites[i].credentials[k].elements
									storage.autologinsites[i].credentials[k].elements=site.elements
									
									storage.updatestorage();
									
									
								}else{
									
									//change default site info , if default site is set to true 
									if(undefined != site.defaultsite && site.defaultsite == true){
										
										storage.autologinsites[i].credentials[k].defaultsite=false
									
									}
									
								}
									
								
							}
							
							
							//updated all 
						
							return ;
							
						}
			}
			
		},
		removeCredential:function(site){
		
			var isCredentialRemoved=false;
			
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					
					if(cursite.authtype == site.authtype && cursite.url == site.url ){
						
						
						
							for (k=0;k<storage.autologinsites[i].credentials.length;k++) {
								
								
								var curcredential=storage.autologinsites[i].credentials[k]
								
								if(curcredential.user == site.user){
									
									isCredentialRemoved=true
									storage.autologinsites[i].credentials.splice(k,1);//  [k].elements
									break;
									
								}
									
								
							}
							
							
							break;						
						}
			}
			
			if(isCredentialRemoved ){
				
				// storage.autologinsites.splice(removeIndex,1);
				storage.updatestorage();
			}
				
			
		},
		removeSite:function(site){
		
			var removeIndex=-1
			
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					
					if(cursite.authtype == site.authtype && cursite.url == site.url ){
							removeIndex=i
							break;						
						}
			}
			
			if(removeIndex >=0 ){
				
				
				 storage.autologinsites.splice(removeIndex,1);
				storage.updatestorage();
			}
				
			
		},
		
		init : function () {

			if (localStorage["autologinsites"] == undefined || localStorage["autologinsites"] == "" ) {
			localStorage["autologinsites"] =[]
			}
			else
				storage.autologinsites = JSON.parse(localStorage["autologinsites"]);

		
			
		}
	}

	