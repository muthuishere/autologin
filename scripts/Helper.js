var Helper = {

key:154,//Any Valid Integer Value

setkeypass:function(tmpKey){

	Helper.key=tmpKey;
	
},
encrypt:function(txt){
 
 var result=""
 for(i=0; i<txt.length;i++)
    {
        result += String.fromCharCode(Helper.key^txt.charCodeAt(i));
    }
	
return result;
},
decrypt:function(encryptedtxt){


	
    var result="";    
    for(i=0; i<encryptedtxt.length; i++)
    {
        result += String.fromCharCode(Helper.key^encryptedtxt.charCodeAt(i));
    }
	return result;
	
}

}