/*******************************************************************************

    Autologin - a browser extension to block requests and replace with cool stuff.
    

    This file provides platform dependent client functionalities
*/
(function () {
    
	//Initently specific function
	vAPI.strings={}

	vAPI.strings.animationStart='webkitAnimationStart'
	
	
	vAPI.strings.autologinAdAnimationRule = '@-webkit-keyframes autologinAdIdentified { from { outline-color: #fff; } to { outline-color: #000; } } ';
	
	vAPI.strings.autologinAdidentifiedRule= ' { -webkit-animation-duration: 0.001s; -webkit-animation-name: autologinAdIdentified; } ';
	
	vAPI.strings.impressionOverlayRule = '.autologinImpressionOverlay { opacity: 0; transition: opacity 0.25s ease-in-out; -moz-transition: opacity 0.25s ease-in-out; -webkit-transition: opacity 0.25s ease-in-out; } '
	
	vAPI.strings.imageAnimationRule = '@-webkit-keyframes autologinImageIdentifier { from { outline-color: #fff; } to { outline-color: #000; } } ';
	vAPI.strings.imageIdentifierRule = 'img { -webkit-animation-duration: 0.001s; -webkit-animation-name: autologinImageIdentifier; } ';
	
	
})();