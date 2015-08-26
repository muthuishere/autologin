if (undefined == userselect){

var userselect={
	disableIconURL:"",
	enableIconURL:"",
	hoverIconURL:"",
	backgroundIconURL:"",
	callback:null,	
	startCapture:false,
	init:function(appextnid,sites,callback){
	userselect.callback=callback
	
		userselect.sites=sites
	userselect.enableIconURL=appextnid +"images/selectuser.png"


	
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
			
			
			var css='\n div#autoLoginselectUser.enable{ \n color:black; \n background:url("'+ userselect.enableIconURL +'") no-repeat center; \n opacity:0.7; \n } \n   opacity:0.9; \n }\n  div#autoLoginselectUser.enable:hover{ \n   opacity:1.0; \n}';
		
					style=document.createElement('style');
					if (style.styleSheet)
						style.styleSheet.cssText=css;
					else 
						style.appendChild(document.createTextNode(css));
					document.getElementsByTagName('head')[0].appendChild(style);
					
					
					var divelem=document.createElement("div");
								
								
								var selectstr="<select id='autologinuser' >"
								for(k=0;k<sites.length;k++){
								
									selectstr += "<option value='"+k+"' >"+sites[k].user +"</option>"
								}
								selectstr +=  "</select>"
								
						divelem.innerHTML='<div style="position:fixed;top:0px;right:0;z-index:1000"  draggable="true"><div id="autoLoginselectUser" style="padding-top:123px;height:55px;width:128px;font-face:Verdana;font-weight:bolder;font-size:15px;text-align:center" class="disable" title="Select user to login" > '+selectstr+' <br/><input type="submit" value="go" id="autologinselectuserbtn"></div></div>'
						
						//padding-top:128px;width:133px;
						
						
						document.body.appendChild(divelem);
						document.querySelector("div#autologinselectuserbtn").addEventListener('click',userselect.onselectuser, false);
		
			
			
		 document.querySelector("input#txtaskpassword").addEventListener('keypress', function(event){
		 if (event.which == 13 || event.keyCode == 13) {
            userselect.onselectuser();
            return false;
        }
        return true;
		 }, false);
		 

			
	},
	onselectuser:function(event){
	
			var val=document.querySelector("div#autologinuser").value
								userselect.callback(userselect.sites[val])
	
	
	
	},

	
	
}





}