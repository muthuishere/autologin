var Helper = {

key:154,//Any Valid Integer Value

setkeypass:function(tmpKey){

	Helper.key=tmpKey;
	
},
encrypt:function(txt){
 
 //	encoded = GibberishAES.enc(document.plain.text.value, document.key.text.value);
	
//	var dec = GibberishAES.dec(document.cipher.text.value, document.key.text.value);

 var result=""
 if(undefined == txt || null == txt )
	return result
 for(i=0; i<txt.length;i++)
    {
        result += String.fromCharCode(Helper.key^txt.charCodeAt(i));
    }
	
return result;
},
decrypt:function(encryptedtxt){


	
    var result="";    
	if(undefined == encryptedtxt || null == encryptedtxt )
	return result
    for(i=0; i<encryptedtxt.length; i++)
    {
        result += String.fromCharCode(Helper.key^encryptedtxt.charCodeAt(i));
    }
	return result;
	
},
migrantdecrypt:function(encryptedtxt){


	
    var result="";    
	if(undefined == encryptedtxt || null == encryptedtxt )
	return result
    for(i=0; i<encryptedtxt.length; i++)
    {
        result += String.fromCharCode(Helper.key^encryptedtxt.charCodeAt(i));
    }
	return result;
	
}

}
