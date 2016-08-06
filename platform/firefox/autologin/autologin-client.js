/*******************************************************************************

    Autologin - a browser extension to block requests and replace with cool stuff.
    

    This file provides platform dependent client functionalities
*/
(function () {
    
	//Initently specific function
	
		//Firefox
	vAPI.strings={}
	vAPI.strings.animationStart='animationstart'
	vAPI.strings.autologinAdAnimationRule = '@keyframes autologinAdIdentified { from { outline-color: #fff; } to { outline-color: #000; } } ';
	vAPI.strings.autologinAdidentifiedRule=' { animation-duration: 0.001s; animation-name: autologinAdIdentified; } ';
	vAPI.strings.impressionOverlayRule = '.autologinImpressionOverlay { opacity: 0; transition: opacity 0.25s ease-in-out; -moz-transition: opacity 0.25s ease-in-out; transition: opacity 0.25s ease-in-out; } ';
	
	vAPI.strings.imageAnimationRule = '@keyframes autologinImageIdentifier { from { outline-color: #fff; } to { outline-color: #000; } } ';
	vAPI.strings.imageIdentifierRule = 'img { animation-duration: 0.001s; animation-name: autologinImageIdentifier; } ';
	
	

	
})();