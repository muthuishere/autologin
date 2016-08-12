if (undefined == basicauth){

	var  messager= vAPI.messaging.channel('basicauth.js');
	vAPI.messager=messager

	
var basicauth={

	startCapture:false,
	onCaptureAutoLogin:function(startCapture){
		basicauth.startCapture=startCapture
		
	},
	init:function(){
	
	document.querySelector("input#username").focus()
	
	  messager.send({
            action: "getauthinfo"
        }, function (response) {
		
		if(!response.valid){
			alert("Corrupt data")
			window.close();
			return
		}
			basicauth.initauth(response)
        });

		
	
	},
	createnodefromhtml:function(o,p,q){
		
		function r(a){var b;if(typeof DOMParser!="undefined")b=(new DOMParser()).parseFromString(a,"application/xml");else{var c=["MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"];for(var i=0;i<c.length&&!b;i++){try{b=new ActiveXObject(c[i]);b.loadXML(a)}catch(e){}}}return b}
		
		function s(a,b,c){a[b]=function(){return eval(c)}}
		
		function t(b,c,d){if(typeof d=="undefined")d=1;if(d>1){if(c.nodeType==1){var e=document.createElement(c.nodeName);var f={};for(var a=0,g=c.attributes.length;a<g;a++){var h=c.attributes[a].name,k=c.attributes[a].value,l=(h.substr(0,2)=="on");if(l)f[h]=k;else{switch(h){case"class":e.className=k;break;case"for":e.htmlFor=k;break;default:e.setAttribute(h,k)}}}b=b.appendChild(e);for(l in f)s(b,l,f[l])}else if(c.nodeType==3){var m=(c.nodeValue?c.nodeValue:"");var n=m.replace(/^\s*|\s*$/g,"");if(n.length<7||(n.indexOf("<!--")!=0&&n.indexOf("-->")!=(n.length-3)))b.appendChild(document.createTextNode(m))}}for(var i=0,j=c.childNodes.length;i<j;i++)t(b,c.childNodes[i],d+1)}p="<root>"+p+"</root>";var u=r(p);if(o&&u){if(q!=false)while(o.lastChild)o.removeChild(o.lastChild);t(o,u.documentElement)}
	},
	initauth:function(response){
		
		var title="The Page "+response.url+" requires username & password"
		var realmtitle="Sign In , The realm says " + response.realm
		
		 document.querySelector("#pagetitle").innerHTML=title
		 BetterInnerHTML()
		 if(response.realm)
			BetterInnerHTML(document.querySelector("#realm"),realmtitle)
		else
			document.querySelector("#realm").innerHTML="Sign In "
		 
		//var extnid=vAPI.getURL("/") 
		
		//autoLoginCaptureIcon.init(extnid,basicauth.onCaptureAutoLogin)
	
		 document.querySelector("#btnlogin").addEventListener('click', function(event){
		
				var data ={}
				data.cancel =false
				data.username= document.querySelector("input#username").value
				data.password=document.querySelector("input#password").value
				data.useAutologin=document.querySelector("input#chkuseautologin").checked
				
				
				messager.send({action: "basicauth",info:data}, function(response) {
						window.close()
				 });
		
		 }, false);
		 document.querySelector("#btncancel").addEventListener('click', function(event){
		
		////console.log("sending auth info cancel ")
		var data ={}
		data.cancel =true
		
		
		messager.send({action: "basicauth",info:data}, function(response) {});
		
				window.close()
		
		 }, false);

	}
	
	
}

function BetterInnerHTML(o,p,q){}


window.addEventListener('load', basicauth.init);

window.addEventListener("beforeunload", function (event) {
  
		
		
		var data ={}
		data.cancel =true
		
		
		messager.send({action: "basicauth",info:data}, function(response) {});
		
		
});


//document.body.addEventListener("load", basicauth.init(), false);


}