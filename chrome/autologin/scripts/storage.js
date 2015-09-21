
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
				site.enabled=partner.enabled
				
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
		removeCredentialAt:function(index){
		
		
			
			 storage.autologinsites.splice(index,1);
			 
			
			storage.updatestorage();
			
			
				
			
		},
		add:function(site){
		
			var isPushed=false;
			
			
				for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					
					if(cursite.authtype == site.authtype && cursite.url == site.url ){
							
							//Iterate credentials
							
							//check user already exists
								//if already exists update
								//else
								//create new element entry	
							
							
							break;						
						}
			}
			
			
			if(!isPushed)
				storage.autologinsites.push(site)
				
				
			storage.updatestorage();
			
				
			
		},
		credentialExistsForUser:function(site){
		
		
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					if(cursite.authtype == site.authtype && cursite.url == site.url &&  cursite.user == site.user){
							
							return true;
						}
			}
			
			return false
		},
		get:function(authtype,url){
		
		var sites=[]
		
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					if(cursite.authtype == authtype && cursite.url == url){
							
							sites.push(cursite)
						}
			}
			
			
			
			
			return sites
			
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
	
		update:function(site){
		
		
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					
					if(cursite.authtype == site.authtype && cursite.url == site.url &&  cursite.user == site.user){
						storage.autologinsites[i]=site
						//sync local storage
							storage.updatestorage()
							
							return;
						}
			}
			
		},
		remove:function(site){
		
			var removeIndex=-1
			
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					
					if(cursite.authtype == site.authtype && cursite.url == site.url &&  cursite.user == site.user){
							removeIndex=i
							break;						
						}
			}
			
			if(removeIndex >=0 )
				storage.removeCredentialAt(removeIndex)
			
		},
		
		removemultlogin:function(){
		
		
		var urls=[]
		var removables=[]
		
			for (i=0;i<storage.autologinsites.length;i++) {
			
					cursite=storage.autologinsites[i]
					
					if(urls.indexOf(cursite.url) == -1){
						var sites=storage.get(cursite.authtype,cursite.url)
						
						var k=sites.length
						
						while(k>0){
							removables.push(sites[k])
							k--
						}
						
						urls.push(cursite.url)
					}
					
			}
			
			for (i=0;i<removables.length;i++) {
					storage.remove(removables[i])
			}
			
			
			return sites
			
		
		},
		init : function () {

			if (localStorage["autologinsites"] == undefined || localStorage["autologinsites"] == "" ) {
			localStorage["autologinsites"] =[]
			}
			else
				storage.autologinsites = JSON.parse(localStorage["autologinsites"]);

		
			
		}
	}

	