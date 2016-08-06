var Helper = {

key:"154djduidusidusi",//Any Valid Integer Value


setkeypass:function(tmpKey){

	Helper.key=tmpKey;
	
},
oldencrypt:function(txt){
 
 var result=""
 if(undefined == txt || null == txt )
	return result
 for(i=0; i<txt.length;i++)
    {
        result += String.fromCharCode(Helper.key^txt.charCodeAt(i));
    }
	
return result;
},
olddecrypt:function(encryptedtxt){


	
    var result="";    
	if(undefined == encryptedtxt || null == encryptedtxt )
	return result
    for(i=0; i<encryptedtxt.length; i++)
    {
        result += String.fromCharCode(Helper.key^encryptedtxt.charCodeAt(i));
    }
	return result;
	
},

encrypt:function(text){
 
 //	encoded = GibberishAES.enc(document.plain.text.value, document.key.text.value);
	
//	var dec = GibberishAES.dec(document.cipher.text.value, document.key.text.value);

//	encoded = GibberishAES.enc(document.plain.text.value, document.key.text.value);
	
//	var dec = GibberishAES.dec(document.cipher.text.value, document.key.text.value);


 var result=[]
 if(undefined == text || null == text )
	return result


 
 var key = aesjs.util.convertStringToBytes(Helper.key);

var textBytes = aesjs.util.convertStringToBytes(text);

// The counter is optional, and if omitted will begin at 0
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);

result = encryptedBytes;//aesjs.util.convertBytesToString(encryptedBytes,"hex");


	
return result;
},
decrypt:function(encryptedBytes){


	
    var result="";    
	


	if(undefined == encryptedBytes || null == encryptedBytes )
	return result

 var key = aesjs.util.convertStringToBytes(Helper.key);

//var encryptedBytes = aesjs.util.convertStringToBytes(encryptedtxt,"hex")
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var decryptedBytes = aesCtr.decrypt(encryptedBytes);

result = aesjs.util.convertBytesToString(decryptedBytes);


	/*
    for(i=0; i<encryptedtxt.length; i++)
    {
        result += String.fromCharCode(Helper.key^encryptedtxt.charCodeAt(i));
    }
	
	*/
	return result;
	
},
migrantdecrypt:function(encryptedtxt){


	var oldkey=154;
    var result="";    
	if(undefined == encryptedtxt || null == encryptedtxt )
	return result
    for(i=0; i<encryptedtxt.length; i++)
    {
        result += String.fromCharCode(oldkey^encryptedtxt.charCodeAt(i));
    }
	return result;
	
}

}

