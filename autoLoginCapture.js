

var captureForm;
// query all forms 

// if form has one password field and one text field and both elements are visible
//call the autologin function to show

var forms = document.querySelectorAll('form');

for (var i = 0, formelement; formelement = forms[i]; i++) {
    //work with element
	
	
	var inputtxtelems=formelement.querySelectorAll('input');
	var inputpwdelems=formelement.querySelectorAll('input[type="password"]');

	if(inputtxtelems.length>1 && inputpwdelems.length==1  ){
	//check visibility
	
	var isVisibleuserElement = inputtxtelems[0].offsetWidth > 0 || inputtxtelems[0].offsetHeight > 0;
	var isVisiblepwdElement = inputpwdelems[0].offsetWidth > 0 || inputpwdelems[0].offsetHeight > 0;

	if(isVisiblepwdElement){
	
			captureForm=formelement
	  chrome.extension.sendMessage({action: "captureautologin"}, function(response) {
				
				console.log("Shown info")
				
				});
				
				//Break loop
				i=forms.length+1;
	}
	
	}
	
}

