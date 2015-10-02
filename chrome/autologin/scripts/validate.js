if (undefined == validate){

var validate={

	
	showGetPassword:function(){
		var myString = '<div style="position:fixed;border:2px solid;border-radius:25px;background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#7abcff), color-stop(44%,#60abf8), color-stop(100%,#4096ee)); ;color:-webkit-gradient(linear, left top, left bottom, color-stop(0%,#4c4c4c), color-stop(12%,#595959), color-stop(25%,#666666), color-stop(39%,#474747), color-stop(50%,#2c2c2c), color-stop(51%,#000000), color-stop(60%,#111111), color-stop(76%,#2b2b2b), color-stop(91%,#1c1c1c), color-stop(100%,#131313));right:0px;top:50px;height:155px;width:300px;font-family: Calibri, Verdana, sans-serif">   <table id="" style="width:100%" > <tbody> <tr><td rowspan="4"><img src="'+ chrome.extension.getURL("/images/autologincheck.png")   +'" title="AutoLogin"/></td></tr> <tr> <th style="font-size:12px;color:black;font-face:Verdana"> Autologin Information available for this site:</th></tr><tr> <th> <input type="password" id="txtaskpassword" /> </th> </tr><tr>   <th> <input type="button" id="btnaskpassword" value="Activate" /> </th>   </tr> </tbody> </table><span id="autologinmsg" style="margin-left:30px;text-align:center;color:red;font-size:14px;font-weight:bold;font-family: Calibri, Verdana, sans-serif"></span> </div>'

		var container=document.createElement("div");
		container.innerHTML=myString
		document.body.appendChild(container)
		 document.querySelector("input#btnaskpassword").addEventListener('click', validate.onClickActivateButton, false);
		 document.querySelector("input#txtaskpassword").addEventListener('keypress', function(event){
		 if (event.which == 13 || event.keyCode == 13) {
            validate.onClickActivateButton();
            return false;
        }
        return true;
		 }, false);

	},
	onClickActivateButton:function(){
		
		document.querySelector("span#autologinmsg").innerHTML="";
		var curpwd=document.getElementById("txtaskpassword").value;
	 	chrome.extension.sendMessage({action: "validateCredential",info:curpwd}, function(response) {
				if(response.valid){
					chrome.extension.sendMessage({action: "injectAutoLogin"}, function(response) {});
				
				}else{
				
					
				document.querySelector("span#autologinmsg").innerHTML="* Invalid Password"
				document.querySelector("input#txtaskpassword").value="";
				document.querySelector("input#txtaskpassword").focus()
				}
				
				});
				
	
	}
	

}

validate.showGetPassword();

}