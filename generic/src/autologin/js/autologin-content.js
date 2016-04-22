/*******************************************************************************

    Autologin - a browser extension to block requests and replace with cool stuff.
    

    This file provides platform independent client functionalities
*/
var autologinContent = (function () {
    



/******************************************************************************/



// https://github.com/chrisaljoudi/uBlock/issues/464
if ( document instanceof HTMLDocument === false ) {
    //console.debug('contentscript-end.js > not a HTLMDocument');
    return false;
}


if ( !vAPI ) {
    //console.debug('contentscript-end.js > vAPI not found');
    return;
}


// https://github.com/chrisaljoudi/uBlock/issues/587
// Pointless to execute without the start script having done its job.
// if ( !vAPI.contentscriptStartInjected ) {
    // return;
// }



// https://github.com/chrisaljoudi/uBlock/issues/456
// Already injected?
if ( vAPI.contentscriptAutologinInjected ) {
    //console.debug('contentscript-end.js > content script already injected');
    return;
}
vAPI.contentscriptAutologinInjected = true;



//Autologin specific changes



//Add autologin specific code here


	//empty ad definition object
	var adDefinitions = null;
	//empty identified ads buffer
	var identifiedAdsBuffer = [];
	//keep track of whether a replacement operation is currently taking place
	var replacementOperationActive = false;

	var autologinextn={}
	
	var intendButtonElement
	var messager = vAPI.messaging.channel('autologin-content.js');
	
	vAPI.messager=messager
	var identificationCounter = 1;
	
	
	
	
	var backgroundPort={
		postMessage:function(data){
				
				data.what="autologin"
				var url = window.location.href;
				data.pageURL= url
				data.locationURL= url
				messager.send(data,backgroundPort.onMessage);
				
		}
	}
	
	
	vAPI.insertAutologinCss = function (messageData,adDefinitions) {
		
				//create new stylesheet
				var styleSheet = document.createElement("style");
				styleSheet.type = "text/css";
				//insert sheet into head or document element
				(document.head || document.documentElement).insertBefore(styleSheet, null);
				
				//wait for sheet to exist before injecting rules.
				if (!styleSheet.sheet) {
					window.setTimeout(function(){ vAPI.insertAutologinCss(messageData,adDefinitions) }, 0);
					return;
				}
				//define animation styles
				
				styleSheet.sheet.insertRule(vAPI.strings.autologinAdAnimationRule, 0);
				Utils.log('animation styles defined');
				var GROUPSIZE = 1000; 
				//define ad identifiers in rule groups to minimize impact of bad selectors
				for(var lcv = 0; lcv < adDefinitions.identifiers.length; lcv += GROUPSIZE) {
					var adIdentifierGroup = adDefinitions.identifiers.slice(lcv, lcv + GROUPSIZE);
					var adIdentifierArray = [];
					//go through each element in the group and add selector to array
					for(var lcv2 = 0; lcv2 < adIdentifierGroup.length; lcv2++) {
						adIdentifierArray.push(adIdentifierGroup[lcv2]);
					}
					
					//insert into stylesheet
					
					var adIdentifierRules = adIdentifierArray.join(',') + vAPI.strings.autologinAdidentifiedRule
					styleSheet.sheet.insertRule(adIdentifierRules, 0);
				}
				Utils.log('ad definition identifiers defined as styles');
				//insert impression overlay rule
				
				styleSheet.sheet.insertRule(vAPI.strings.impressionOverlayRule, 0);
				var impressionOverlayFadeRule = '.autologinImpressionOverlay:hover { opacity: 1; }';
				styleSheet.sheet.insertRule(impressionOverlayFadeRule, 0);
				var impressionButtonRule = '.autologinImpressionButton { cursor: pointer; }';
				styleSheet.sheet.insertRule(impressionButtonRule, 0);
				var shareButtonRule = '.autologinShareButton { cursor: pointer; }';
				styleSheet.sheet.insertRule(shareButtonRule, 0);
				//check if intend button should be shown
				if(messageData.showIntendButton) {
					//insert image identification rule
					//TODO: how to identify elements with a background-image style? using * on this rule affects page performance
				
					styleSheet.sheet.insertRule(vAPI.strings.imageAnimationRule, 0);
					
					styleSheet.sheet.insertRule(vAPI.strings.imageIdentifierRule, 0);
					//insert intend button overlay rule
					var intendButtonOverlayRule = '.autologinIntendButton { height: 17px; width: 40px; position: absolute; z-index: 999999999; display: none; cursor: pointer; opacity: 0.9; background-image: url(data:image/png;base64,' + Conf.INTEND_BUTTON_BASE64 + '); } ';
					styleSheet.sheet.insertRule(intendButtonOverlayRule, 0);
					var intendButtonOverlayFadeRule = '.autologinIntendButton:hover { opacity: 1; }';
					styleSheet.sheet.insertRule(intendButtonOverlayFadeRule, 0);
				}
				Utils.log('impression and sharing styles defined');
			
		
		
	}
	
	//listen for messages from extension runtime
	backgroundPort.onMessage =function(messageData) {
		var messageResponse = {};
		
		Utils.log(messageData)
		if(messageData  &&  messageData.messageType){
		
		
		//see what message type was received
		if(messageData.messageType == 'adDefinitions') {
			adDefinitions = messageData.adDefinitions;
			 Utils.log('ad definitions received:');
		
		
			//do not do anything if identifiers is empty
			if(adDefinitions.identifiers.length === 0)
				return;
			//create new stylesheet
			if(window.location.href.indexOf('autologin.com') == -1) {
			
				
				vAPI.insertAutologinCss(messageData,adDefinitions)
			}
		}
		else if(messageData.messageType == 'instruction') {
			if(messageData.instruction == 'replaceads') {
				var replacedAds = [];
				Utils.log('replacing ads: message received');
				//ensure ad replacements are present
				if(messageData.adReplacements && messageData.adReplacements.length > 0) {
					 Utils.log('replacing ads:');
					 Utils.log(messageData.adReplacements);
					//go through each received ad replacement
					messageData.adReplacements.forEach(function(adReplacement) {
						//find the element identified by the autologin id
						var replacementTarget = document.querySelector('[autologinAdID="' + adReplacement.autologinID + '"]');
						if(replacementTarget) {
							//turn bullshit...
							replacementTarget.style.display = 'none';
							//check and see if a replacement is available
							if(adReplacement.channelResourceID) {
								//... into cool shit
								var replacementHTML = adReplacement.replacementHTML.replace('???', adReplacement.replacementResourceData);
								replacementTarget.outerHTML = replacementTarget.outerHTML + replacementHTML;
/*
var replacementElement = document.querySelector('[autologinReplacementID="' + adReplacement.autologinID + '"]');
var replacementElementRect = replacementElement.getBoundingClientRect();
var replacementElementMiddleX = replacementElementRect.left + (replacementElementRect.width / 2);
var replacementElementMiddleY = replacementElementRect.top + (replacementElementRect.height / 3);
var replacementElementOverlay = document.elementFromPoint(replacementElementMiddleX, replacementElementMiddleY);
if(replacementElementOverlay != replacementElement) {
	Utils.log('replacement target overlay detected!', replacementElementOverlay);
}
*/
								//get info for logging
								adReplacement.url = window.location.href;
								var domainMatches = adReplacement.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
								if(domainMatches && domainMatches.length > 1) {
									//strip off any www dot
									adReplacement.domain = domainMatches[1].replace('www.', '');
								}
								adReplacement.timestamp = new Date().getTime();
								//save to list of replaced ads for responding
								replacedAds.push(adReplacement);
							}
						}
						else {
							//this generally happens when an identified ad has children that are also identified as ads
							 Utils.log('could not find ad with autologinID ' + adReplacement.autologinID);
						}
					});
				}
				messageResponse.messageType = 'response';
				messageResponse.response = 'adsreplaced';
				messageResponse.replacedAds = replacedAds;
				if(Conf.DEBUG && messageResponse.replacedAds && messageResponse.replacedAds.length > 0) {
					Utils.log('sending response with ' + messageResponse.replacedAds.length + ' replaced ads to runtime');
				}
			}
			else if(messageData.instruction == 'identifylastrightclickad') {
				 Utils.log('getting last right click info');
				messageResponse.messageType = 'response';
				messageResponse.response = 'lastrightclickadidentified';
				//check that a right click target exists
				if(autologinextn.lastRightClickTarget) {
					//ensure it is not already indentified by autologin
					var alreadyIdentified = false;
					for(var lcv = 0; lcv < autologinextn.lastRightClickTarget.attributes.length; lcv++) {
						if(autologinextn.lastRightClickTarget.attributes[lcv].name.toLowerCase() == 'autologinreplacementid' || autologinextn.lastRightClickTarget.attributes[lcv].name.toLowerCase() == 'autologinreplacementparentid') {
							alreadyIdentified = true;
						}
					}
					if(!alreadyIdentified) {
						//not an autologin ad, identify it
						var lastRightClickAd = {};
						lastRightClickAd.domain = window.location.hostname.replace('www.', '');
						lastRightClickAd.url = window.location.href;
						lastRightClickAd.outerHTML = autologinextn.lastRightClickTarget.outerHTML;
						//guess element selector for the clicked node
						var uniqueElementSelectorInfo = getUniqueElementSelectorInfo(autologinextn.lastRightClickTarget);
						lastRightClickAd.proposedSelector = uniqueElementSelectorInfo.uniqueSelector;
						lastRightClickAd.proposedSelectorOuterHTML = uniqueElementSelectorInfo.uniqueSelectorOuterHTML;
						lastRightClickAd.proposedSelectorParentLevel = uniqueElementSelectorInfo.uniqueSelectorParentLevel;
						messageResponse.lastRightClickAd = lastRightClickAd;
					}
					else {
						//show notice stating this is already in autologin
						messageResponse.messageType = 'usernotification';
						messageResponse.title = 'Ad Not Reported';
						messageResponse.message = 'That image is part of Autologin!';
					}
				}
				else {
					//throw error to background
					
				
					messageResponse.messageType = 'contentscripterror';
					messageResponse.error = 'ReportAdNotIdentified';
					messageResponse.details = 'Last right click target is null. Page URL: ' + window.location.href;
					
				
				}
				//clear last target
				autologinextn.lastRightClickTarget = null;
			}
			else if(messageData.instruction == 'identifylastrightclickintention') {
				 Utils.log('getting last right click info:');
				 Utils.log(autologinextn.lastRightClickTarget);
				//check that a right click target exists
				if(autologinextn.lastRightClickTarget) {
					//ensure it is not already indentified by autologin
					var alreadyIdentified = false;
					for(var lcv = 0; lcv < autologinextn.lastRightClickTarget.attributes.length; lcv++) {
						if(autologinextn.lastRightClickTarget.attributes[lcv].name.toLowerCase() == 'autologinreplacementid' || autologinextn.lastRightClickTarget.attributes[lcv].name.toLowerCase() == 'autologinreplacementparentid') {
							alreadyIdentified = true;
						}
					}
					if(!alreadyIdentified) {
						messageResponse.messageType = 'response';
						messageResponse.response = 'lastrightclickintentionidentified';
						//not an autologin ad, get the url of the image
						messageResponse.lastRightClickIntentionPageURL = window.location.href;
						messageResponse.lastRightClickIntentionURL = autologinextn.lastRightClickTarget.src;
						messageResponse.lastRightClickIntentionDescription = autologinextn.lastRightClickTarget.title || autologinextn.lastRightClickTarget.alt || window.top.document.title;
					}
					else {
						//show notice stating this is already in autologin
						messageResponse.messageType = 'usernotification';
						messageResponse.title = 'Image Not Added';
						messageResponse.message = 'The image is already part of Autologin!';
					}
				}
				else {
				
					//throw error to background
					messageResponse.messageType = 'contentscripterror';
					messageResponse.error = 'IntentionNotIdentified';
					messageResponse.details = 'Last right click target is null. Page URL: ' + window.location.href;
				
				}
				//clear last target
				autologinextn.lastRightClickTarget = null;
			}

		}
		//send response message to runtime
		
		
		if(Object.keys(messageResponse).length >0)
			backgroundPort.postMessage(messageResponse);
			
		}else{
		
			Utils.log("empty",messageData)
		}
			
	}

	
	
	//Retrieve definitions on top of window
		if(window == window.top) {		
			Utils.log('retrieving definitions ');
			backgroundPort.postMessage({messageType: 'loaddefinitions'	});		
		}
		
		
	//determine the absolute position of an element
	var getAbsolutePosition = function(element) {
		var xScroll = 0, yScroll = 0, xOffset = 0, yOffset = 0;
		var boundingClientRect = element.getBoundingClientRect();
		if (element.offsetParent) {
			do {
				xOffset += element.offsetLeft;
				yOffset += element.offsetTop;
				xScroll += element.scrollLeft;
				yScroll += element.scrollTop;
			} while (element = element.offsetParent);
			//the position is the screen position with any scrolling considered
			return { 'left': boundingClientRect.left + xScroll, 'top': boundingClientRect.top + yScroll };
		}
	};

	
	var showIntendButton = function(node) {
		//get updated position and size
		var boundingClientRect = node.getBoundingClientRect();
		var absolutePosition = getAbsolutePosition(node);
		//position top left
		var leftPos = absolutePosition.left + 10;
		var topPos = absolutePosition.top + 10;
		//set the image url
		intendButtonElement.imageURL = node.src;
		//set the description
		intendButtonElement.description = node.title || node.alt || window.top.document.title;
		//show the button
		intendButtonElement.style.left = leftPos + 'px';
		intendButtonElement.style.top = topPos + 'px';
		intendButtonElement.style.display = 'block';
	};
	var hideIntendButton = function() {
		//hide the intend button
		intendButtonElement.style.display = 'none';
		//clear the image url
		intendButtonElement.description = null;
	};
	var intendButtonClick = function(eOpts) {
		//do not impact the rest of the page
		eOpts.preventDefault();
		eOpts.stopPropagation();
		//send message of intend button click
		var intendButtonClickObject = {
			imageURL: intendButtonElement.imageURL,
			pageURL: window.top.location.href,
			description: intendButtonElement.description
		};
		var intendClickMessage = {
			messageType: 'useraction',
			action: 'intendbuttonclicked',
			intendButtonClickData: intendButtonClickObject
		};
		backgroundPort.postMessage(intendClickMessage);
		//console.log("intendbuttonclicked clicking")
		//hide the button
		hideIntendButton();
	};
	
	//End Autologin methods here
	
	intendButtonElement = document.createElement('span');
	intendButtonElement.classList.add('autologinIntendButton');
	intendButtonElement.imageURL = null;
	intendButtonElement.description = null;
	
	intendButtonElement.addEventListener('click', intendButtonClick);
	document.body.appendChild(intendButtonElement);

	
	
	autologinextn.lastRightClickTarget = null;
	//add mouse click listener
	//document.defaultView
	document.querySelector('html').addEventListener('mousedown', function(event) {
		//check if right button was clicked
		//Utils.log(event.target);
		if(event.button == 2) {
			 
			autologinextn.lastRightClickTarget = event.target;
			
		}
		else if(event.button === 0) {
			//left click, see if impression button
			if(event.target.className.indexOf('autologinImpressionButton') >= 0 && event.target.attributes['impressionValue'] && event.target.attributes['channelResourceID']) {
				//do not impact the rest of the page
				event.preventDefault();
				event.stopPropagation();
				 Utils.log('impression button clicked:');
				var impressionButtonClickObject = {
					channelResourceID: event.target.attributes['channelResourceID'].value,
					impression: event.target.attributes['impressionValue'].value
				};
				 Utils.log(impressionButtonClickObject);
				//send message of impression button click
				var impressionClickMessage = {
					messageType: 'useraction',
					action: 'impressionbuttonclicked',
					impressionButtonClickData: impressionButtonClickObject
				};
				backgroundPort.postMessage(impressionClickMessage);
				//for now, just assume the impression is saved successfully and change button to inactive
				event.target.setAttribute('class', event.target.getAttribute('inactiveClass'));
				event.target.setAttribute('src', event.target.getAttribute('inactiveSrc'));
				//get the sibling target
				var siblingTargetID = 'thumbs' + ((event.target.attributes['impressionValue'].value === '1') ? 'Down' : 'Up') + 'ImpressionButton-' + event.target.attributes['autologinReplacementParentID'].value;
				var siblingTarget = document.getElementById(siblingTargetID);
				if(siblingTarget) {
					//switch the sibling target to active
					siblingTarget.setAttribute('class', siblingTarget.getAttribute('activeClass'));
					siblingTarget.setAttribute('src', siblingTarget.getAttribute('activeSrc'));
				}
				//hide the intention if thumbs down
				if(event.target.attributes['impressionValue'].value === '0') {
					var replacementID = event.target.attributes['autologinReplacementParentID'].value;
					var autologinReplacement = document.querySelector('div[autologinReplacementID="' + replacementID + '"]');
					if(autologinReplacement) {
						autologinReplacement.style.display = 'none';
					}
				}
			}
			else if(event.target.className.indexOf('autologinShareButton') >= 0 && event.target.attributes['channelResourceID']) {
				//do not impact the rest of the page
				event.preventDefault();
				event.stopPropagation();
				//share button clicked
				 Utils.log('share button clicked:');
				var shareButtonClickObject = {
					channelResourceID: event.target.attributes['channelResourceID'].value
				};
				// Utils.log(shareButtonClickObject);
				//send message of impression button click
				var shareClickMessage = {
					messageType: 'useraction',
					action: 'sharebuttonclicked',
					shareButtonClickData: shareButtonClickObject
				};
				backgroundPort.postMessage(shareClickMessage);
			}
		    else if(event.target.className.indexOf('autologinImpressionOverlay') >= 0 && event.target.attributes['destination']) {
		        //do not impact the rest of the page
		        event.preventDefault();
		        event.stopPropagation();
		        //destination link clicked
		     //   if(Conf.DEBUG) console.log('destination link clicked: ' + event.target.attributes['destination'].value);
		        //open the link
		        window.open(event.target.attributes['destination'].value, "_blank");
		    }
		}
	});

	
	//algorithm for constructing a unique jquery element selector
	var getUniqueElementSelectorInfo = function(element, parentLevel) {
		//default parent level is zero
		parentLevel = typeof parentLevel !== 'undefined' ? parentLevel : 0;
		//construct jquery selector
		var candidateSelector = element.localName;
		if(element.id) {
			//id is defined and is unique
			candidateSelector += '#' + element.id;
		}
		else if(element.classList.length > 0) {
			//no id defined, try identifying by class(es)
			var classList = [];
			for(var lcv = 0; lcv < element.classList.length; lcv++) {
				classList.push(element.classList[lcv]);
			}
			candidateSelector += '.' + classList.join('.');
		}
		//see if one element is returned by it
		var candidateElements = document.querySelectorAll(candidateSelector);
		if(candidateElements.length === 1) {
			//success, this is a unique identifier
			//TODO: identify patterns in the identifier, such as ids that look like "adunit1683749" as these can be generalized
			return { 
				uniqueSelector: candidateSelector, 
				uniqueSelectorOuterHTML: candidateElements[0].outerHTML, 
				uniqueSelectorParentLevel: parentLevel 
			};
		}
		else if(element.parentElement === null || parentLevel == Conf.MAXIMUM_AD_IDENTIFICATION_PARENT_LEVEL) {
			//no more parents or limit was reached, could not find unique element selector
			return { 
				uniqueSelector: null, 
				uniqueSelectorOuterHTML: null, 
				uniqueSelectorParentLevel: parentLevel 
			};
		}
		else {
			//recurse to parent
			parentLevel++;
			return getUniqueElementSelectorInfo(element.parentElement, parentLevel);
		}
	};

	
	
	//delayed action for sending identified ads to the background
	var reportIdentifiedAdsTimeoutID = null;
	var reportIdentifiedAds = function() {
		//reset the timeout id
		reportIdentifiedAdsTimeoutID = null;
		//send the ads identified in the buffer
		var messageResponse = {
			messageType: 'identifiedads',
			identifiedAds: identifiedAdsBuffer
		};
		Utils.log('sending ' + messageResponse.identifiedAds.length + ' identified ads to runtime');
		backgroundPort.postMessage(messageResponse);
		replacementOperationActive = true;
		//clear the buffer
		identifiedAdsBuffer = [];
	};


	var handleIdentifiedAd = function(node) {
		//hide that shit immediately (but still render it)
		node.style.visibility = 'hidden';
		//see if this is a hide exception
		if(node.getAttribute('autologinAdHideExceptionID')) {
			//hiding exception, re-hide
			Utils.log('re-hiding an exception:');
			Utils.log(node);
			node.style.display = 'none';
			return;
		}
		//see if this is an identified ad that has a replacement
		if(node.getAttribute('autologinAdID') && document.querySelector('[autologinReplacementID="' + node.getAttribute('autologinAdID') + '"]')) {
			//re-hide an already replaced ad
			Utils.log('re-hiding an already replaced ad:');
			Utils.log(node);
			node.style.display = 'none';
			return;
		}
		//see if ad meets minimum size
		var boundingClientRect = node.getBoundingClientRect();
		if(boundingClientRect.height > Conf.MINIMUM_AD_REPLACEMENT_HEIGHT && boundingClientRect.width > Conf.MINIMUM_AD_REPLACEMENT_WIDTH) {
			//ensure we are not working under an already identified ad
			
			var curparent = node.parentNode;
				
				
				try{
				while(curparent && curparent !== document && null != curparent  && curparent !=undefined) {
					if(curparent.matches("[autologinAdID]")) {
						//parent already identified, skip
						Utils.log('ad identifier ignored due to parent identification:');
						Utils.log(parent);
						return;
					}
					//move up
					curparent = curparent.parentNode;
				}
				
				}catch(exception){
					Utils.log('ignored'+exception);
					}
					
			//Commented for safari
			/*
			var parent = node.parentNode;
			while(parent !== document) {
				if(parent.matches('[autologinAdID]')) {
					//parent already identified, skip
					Utils.log('ad identifier ignored due to parent identification:');
					Utils.log(parent);
					return;
				}
				//move up
				parent = parent.parentNode;
			}
			
			*/
			//enrich the ad with an id
			node.setAttribute('autologinAdID', identificationCounter);
			identificationCounter++;
			//go through the ignore exceptions
			if(adDefinitions && adDefinitions.exceptions) {
				for(var lcv = 0; lcv < adDefinitions.exceptions.length; lcv++) {
					//try to query the exception and the ad at the same time
					var ignoreExceptionNode = document.querySelector(adDefinitions.exceptions[lcv] + '[autologinAdID="' + node.getAttribute('autologinAdID') + '"]');
					if(ignoreExceptionNode) {
						//change the id to ignore
						node.setAttribute('autologinAdIgnoreExceptionID', node.getAttribute('autologinAdID'));
						node.removeAttribute('autologinAdID');
						//make visible again
						node.style.visibility = 'visible';
						//this is an ignore exception
						Utils.log('ad identifier ignore exception encountered:');
						Utils.log(ignoreExceptionNode);
						return;
					}
				}
			}
			//go through the hide exceptions
			if(adDefinitions && adDefinitions.hideOverrides) {
				for(var lcv = 0; lcv < adDefinitions.hideOverrides.length; lcv++) {
					//try to query the hide override and the ad at the same time
					var hideExceptionNode = document.querySelector(adDefinitions.hideOverrides[lcv] + '[autologinAdID="' + node.getAttribute('autologinAdID') + '"]');
					if(hideExceptionNode) {
						//change the id to hide
						node.setAttribute('autologinAdHideExceptionID', node.getAttribute('autologinAdID'));
						node.removeAttribute('autologinAdID');
						//this is a hide exception
						Utils.log('ad identifier hide exception encountered:');
						Utils.log(hideExceptionNode);
						//hide it
						node.style.display = 'none';
						return;
					}
				}
			}
			//see if ad takes up minimum percentage of screen real estate
			if((boundingClientRect.height * boundingClientRect.width) / (window.innerHeight * window.innerWidth) >= Conf.MAXIMUM_AD_REPLACEMENT_SCREEN_PIXEL_RATIO) {
				//do not replace, hide instead
				node.setAttribute('autologinAdHideExceptionID', node.getAttribute('autologinAdID'));
				node.removeAttribute('autologinAdID');
				//this is a hide exception
				Utils.log('very large ad hide exception encountered:');
				Utils.log(node);
				//hide it
				node.style.display = 'none';
				return;
			}
			//create identified ad object
			var identifiedAd = {};
			identifiedAd.autologinID = node.getAttribute('autologinAdID');
			identifiedAd.height = boundingClientRect.height;
			identifiedAd.width = boundingClientRect.width;
			identifiedAd.adHTML = node.outerHTML;
			//construct the styles that should be transferred to the replacement node
			var replacementStyles = '';
			for(lcv = 0; lcv < Conf.REPLACEMENT_STYLE_NAMES.length; lcv++) {
				replacementStyles += Conf.REPLACEMENT_STYLE_NAMES[lcv] + ': ' + getComputedStyle(node)[Conf.REPLACEMENT_STYLE_NAMES[lcv]] + '; ';
			}
			identifiedAd.replacementStyles = replacementStyles;
			//mark the ad as identified
			identifiedAdsBuffer.push(identifiedAd);
			//clear any existing timeout
			if(reportIdentifiedAdsTimeoutID) {
				clearTimeout(reportIdentifiedAdsTimeoutID);
			}
			//set the timer for sending identified ads to background
			reportIdentifiedAdsTimeoutID = setTimeout(reportIdentifiedAds, Conf.IDENTIFIED_ADS_BUFFER_COOLDOWN);
		}
		else if(node.getAttribute('autologinPause') != '1') {
			Utils.log('ad not large enough for replacement (' + boundingClientRect.width + 'x' + boundingClientRect.height + '), pausing:');
			Utils.log(node);
			//wait a moment and try again
			node.setAttribute('autologinPause', '1');
			setTimeout(function() { handleIdentifiedAd(node); }, 1000);
		}
		else {
			//probably not getting bigger
			node.style.display = 'none';
		}

	}

	//handle all animation starts
	var animationStartEventHandler = function(animationStartEvent) {
		//see if this is an identified ad
		//console.log("animation bound" + animationStartEvent.animationName )
		if(animationStartEvent.animationName == 'autologinAdIdentified') {
			//handle it
			handleIdentifiedAd(animationStartEvent.target);
		}
		else if(animationStartEvent.animationName == 'autologinImageIdentifier') {
			var node = animationStartEvent.target;
			//check if element is img or has a background image and not autologin-based
			if((node.tagName == 'IMG' || node.style.backgroundImage !== '') && !node.attributes['autologinreplacementparentid']) {
				//see if element takes up considerable real estate
				var boundingClientRect = node.getBoundingClientRect();
				if(boundingClientRect.height * boundingClientRect.width > 30000) {
					node.addEventListener('mouseover', function(eOpts) {
						//ensure the target source is not base64 encoded
						if(eOpts.target.src.indexOf('data:image') !== 0) {
							//show the intend button on the target
							showIntendButton(eOpts.target);
						}
					});
					node.addEventListener('click', function(eOpts) {
						
						hideIntendButton();
					});
					node.addEventListener('mouseout', function(eOpts) {
						//ensure not moving to intend button 
						//Cross browser fix
						var relTarg = eOpts.relatedTarget || eOpts.toElement;
						
						if(relTarg != intendButtonElement ) {
							//hide the intend button
							hideIntendButton();
						}
					});
				}
			}
		}
	};
	
	//bind listener for animation start
	//document.addEventListener('webkitAnimationStart', animationStartEventHandler);
	
		document.addEventListener(vAPI.strings.animationStart, animationStartEventHandler,false);
		
	window.onIntentionClick = function(channelResourceID, url) {
		Utils.log(channelResourceID);
		Utils.log(url);
	};


	


//End Autologin specific changes

/******************************************************************************/
/******************************************************************************/


/******************************************************************************/
/******************************************************************************/

// To send mouse coordinates to context menu handler, as the chrome API fails
// to provide the mouse position to context menu listeners.
// This could be inserted in its own content script, but it's so simple that
// I feel it's not worth the overhead.

// Ref.: https://developer.mozilla.org/en-US/docs/Web/Events/contextmenu

/*
(function() {
    if ( window !== window.top ) {
        return;
    }
    var onContextMenu = function(ev) {
	
	var contextMessage = {
					messageType: 'useraction',
					action: 'contextMenuEvent',
					clientX: ev.clientX,
					clientY: ev.clientY,
					impressionButtonClickData: impressionButtonClickObject
				};
				backgroundPort.postMessage(impressionClickMessage);
				
				
    };

    window.addEventListener('contextmenu', onContextMenu, true);

    // https://github.com/gorhill/uMatrix/issues/144
    shutdownJobs.add(function() {
        document.removeEventListener('contextmenu', onContextMenu, true);
    });
})();


*/
	return {
		backgroundPort: backgroundPort
	};

	
})();


