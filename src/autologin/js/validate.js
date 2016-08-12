if (undefined == validate){

	var  messager= vAPI.messaging.channel('validate.js');
	vAPI.messager=messager

	//console.log(vAPI)
	
var validate={

	
	init:function(){
		
			messager.send({action: "hiddencapture",url:""}, function(response) {
				//console.log("validate response" , response)
				validate.showGetPassword(response.extnid)
			});
	},
	showGetPassword:function(chromeurl){
		var myString = '<div style="position:fixed;z-index:1000;border:2px solid;border-radius:25px;border-color:#000;background-color: #A2BCD0;right:0px;top:50px;height:155px;width:340px;font-family: Calibri, Verdana, sans-serif">   <table id="" style="width:100%" > <tbody> <tr><td rowspan="4"><img src="'+ chromeurl + "images/autologin-128.png"   +'" title="AutoLogin"/></td></tr> <tr> <th style="font-size:14px;color:black;font-face:Verdana"> Type Autologin Master Password</th></tr><tr> <th> <input type="password" id="txtaskpassword" style="border:1px;border-radius:10px;font-size:14px;padding-left:6px"/> </th> </tr><tr>   <th> <input type="button" id="btnaskpassword" value="Activate" /> </th>   </tr> </tbody> </table><span id="autologinmsg" style="margin-left:30px;text-align:center;color:red;font-size:14px;font-weight:bold;font-family: Calibri, Verdana, sans-serif"></span> </div>'

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
	 	messager.send({action: "validateCredential",info:curpwd}, function(response) {
				if(response.valid){
					messager.send({action: "injectAutoLogin"}, function(response) {});
				
				}else{
				
					
				document.querySelector("span#autologinmsg").innerHTML="* Invalid Password"
				document.querySelector("input#txtaskpassword").value="";
				document.querySelector("input#txtaskpassword").focus()
				}
				
				});
				
	
	}
	

}

validate.init();

}