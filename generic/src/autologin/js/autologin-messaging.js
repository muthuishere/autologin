
// autologin-content.js

(function() {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/


/**************************************************************************************************
* Purpose: 
*	Goes through each channel resource and determines the best replacement for the given ad.
*	Constructs the replacement HTML using the chosen channel resource.
*
* Params: 
*	identifiedAd (object) - object containing HTML, dimension, styling, and unique identifier.
*
* Returns: 
*	identifiedAd object enriched with replacement HTML, dimension, and styling information.
**************************************************************************************************/
var buildReplacementHTML = function(identifiedAd) {
	var replacementResource = null;
	var candidateResources = [];
	//calculate original ad aspect ratio
	var adOriginalAspectRatio = identifiedAd.width / identifiedAd.height;
	var adOriginalPixelArea = identifiedAd.width * identifiedAd.height;
	//go through each resource
	autologinData.channelResources.forEach(function(channelResource) {
		var sizeConstraintsPassed = true;
		var historyConstraintsPassed = true;
		var adminIntentionConstraintsPassed = true;
		//reset score
		channelResource.algorithmScore = 0;
		//check width constraints
		if(channelResource.minWidth > 0 && channelResource.minWidth > identifiedAd.maxWidth) sizeConstraintsPassed = false;
		else if(channelResource.maxWidth > 0 && channelResource.maxWidth < identifiedAd.minWidth) sizeConstraintsPassed = false;
		//check height constraints
		else if(channelResource.minHeight > 0 && channelResource.minHeight > identifiedAd.maxHeight) sizeConstraintsPassed = false;
		else if(channelResource.maxHeight > 0 && channelResource.maxHeight < identifiedAd.minHeight) sizeConstraintsPassed = false;
		//check history constraints
		if(registeredTabData[identifiedAd.tabID].channelResourceHistory.indexOf(channelResource.id) != -1) historyConstraintsPassed = false;
		//check admin intention constraints
		if(channelResource.userID == '1' && !considerAdminIntentions) adminIntentionConstraintsPassed = false;
		//see if candidate passed size constraints and has not been used already on the tab
		if(sizeConstraintsPassed && historyConstraintsPassed && adminIntentionConstraintsPassed) {
			//passed size and tab history constraints, is a candidate for use
			candidateResources.push(channelResource);
		}
		else {
			//did not pass size and tab history constraints, increment the times since last use
			channelResource.timesSinceLastUse++;
		}
	});
	//ensure at least one candidate resource
	if(candidateResources.length > 0) {
		//keep track of highest score
		var highestScore = null;
		var highestScoreIndices = [];
		//go through each candidate resources
		for(var lcv = 0; lcv < candidateResources.length; lcv++) {
			var adAspectRatio = 0;
			var resourceMaxHeight = (candidateResources[lcv].maxHeight > 0) ? candidateResources[lcv].maxHeight : Conf.MAX_PIXEL_SIZE;
			var resourceMaxWidth = (candidateResources[lcv].maxWidth > 0) ? candidateResources[lcv].maxWidth : Conf.MAX_PIXEL_SIZE;
			//aspect ratio should be maintained
			var resourceAspectRatio = candidateResources[lcv].width / candidateResources[lcv].height;
			//find the limiting dimension of the original ad size
			var limitingDimension = '';
			adAspectRatio = identifiedAd.width / identifiedAd.height;
			if(adAspectRatio > resourceAspectRatio) limitingDimension = 'h';
			else if(adAspectRatio < resourceAspectRatio) limitingDimension = 'w';
			//resize the resource based on the limiting dimension of the original ad size
			if(limitingDimension == 'w') {
				candidateResources[lcv].resourceWidth = (resourceMaxWidth > identifiedAd.width) ? identifiedAd.width : resourceMaxWidth;
				candidateResources[lcv].containerWidth = candidateResources[lcv].resourceWidth;
				candidateResources[lcv].resourceHeight = candidateResources[lcv].resourceWidth / resourceAspectRatio;
				candidateResources[lcv].containerHeight = identifiedAd.height;
			}
			else if(limitingDimension == 'h') {
				candidateResources[lcv].resourceHeight = (resourceMaxHeight > identifiedAd.height) ? identifiedAd.height : resourceMaxHeight;
				candidateResources[lcv].containerHeight = candidateResources[lcv].resourceHeight;
				candidateResources[lcv].resourceWidth = candidateResources[lcv].resourceHeight * resourceAspectRatio;
				candidateResources[lcv].containerWidth = identifiedAd.width;
			}
			else {
				//aspect ratios match
				candidateResources[lcv].resourceWidth = (resourceMaxWidth > identifiedAd.width) ? identifiedAd.width : resourceMaxWidth;
				candidateResources[lcv].containerWidth = identifiedAd.width;
				candidateResources[lcv].resourceHeight = (resourceMaxHeight > identifiedAd.height) ? identifiedAd.height : resourceMaxHeight;
				candidateResources[lcv].containerHeight = identifiedAd.height;
			}
			//calculate pixel utilization score (the higher the better, 0-100)
			candidateResources[lcv].pixelUtilizationScore = (candidateResources[lcv].resourceWidth * candidateResources[lcv].resourceHeight) * 100 / adOriginalPixelArea;
			//calculate historical score (the higher the better, limit to 100)
			candidateResources[lcv].historicalScore = candidateResources[lcv].timesSinceLastUse * 100 / autologinData.channelResources.length;
			if(candidateResources[lcv].historicalScore > 100) {
				candidateResources[lcv].historicalScore = 100;
			}
			//calculate weighted score
			candidateResources[lcv].algorithmScore = (candidateResources[lcv].pixelUtilizationScore * Conf.REPLACEMENT_PIXEL_UTILIZATION_WEIGHT) + (candidateResources[lcv].historicalScore * Conf.REPLACEMENT_HISTORICAL_USE_WEIGHT);
			//factor honeymoon weight
			candidateResources[lcv].algorithmScore *= (candidateResources[lcv].honeymoon) ? Conf.REPLACEMENT_HONEYMOON_WEIGHT : 1;
		}
		for(lcv = candidateResources.length - 1; lcv >= 0; lcv--) {
			//ensure the minimum pixel utilization ratio is met
			if((candidateResources[lcv].resourceWidth / identifiedAd.width) < Conf.MINIMUM_REPLACEMENT_WIDTH_UTILIZATION_RATIO) {
				/*
				if(Conf.DEBUG) {
					console.log('candidate replacement does not meet minimum width utilization ratio (' + candidateResources[lcv].pixelUtilizationScore + '):');
					console.log(candidateResources[lcv]);
				}
				*/
				candidateResources.splice(lcv, 1);
			}
		}
		/*
		if(Conf.DEBUG) {
			console.log('----------------------------------------------------------------------------');
			console.log('weighted scores for ad ' + identifiedAd.autologinID + ' (' + identifiedAd.originalWidth + ' x ' + identifiedAd.originalHeight + ' = ' + adOriginalPixelArea + '):');
		}
		*/
		//weighted scores are calculated, analyze them
		for(lcv = 0; lcv < candidateResources.length; lcv++) {
			//output score info for debugging
			/*
			if(Conf.DEBUG) {
				var scoreString = candidateResources[lcv].name + ': ' + Math.round(candidateResources[lcv].resourceWidth) + ' x ' + Math.round(candidateResources[lcv].resourceHeight) + ' = ' + Math.round(candidateResources[lcv].pixelUtilizationScore) + '%';
				console.log(scoreString);
			}
			*/	
			//save highest score (original size) and keep track of indices with that score
			if(candidateResources[lcv].algorithmScore > highestScore || highestScore == null) {
				highestScore = candidateResources[lcv].algorithmScore;
				highestScoreIndices = [lcv];
			}
			else if(candidateResources[lcv].algorithmScore == highestScore) {
				//found multiple original size resources with the same score
				highestScoreIndices.push(lcv);
			}
		}
		/*
		if(Conf.DEBUG) {
			console.log('highest score is ' + highestScore + ':');
			highestScoreIndices.forEach(function(highestScoreIndex) {
				console.log(candidateResources[highestScoreIndex].name);
			});
		}
		*/
		//ensure there was a highest score
		if(highestScoreIndices.length > 0) {
			//randomly select a high score candidate resource
			var selectedIndex = highestScoreIndices[Math.floor(Math.random() * highestScoreIndices.length)];
			//increment times since last use for candidate resources not selected
			for(lcv = 0; lcv < candidateResources.length; lcv++) {
				if(candidateResources[lcv] != selectedIndex) {
					candidateResources[lcv].timesSinceLastUse++;
				}
			}
			//update history usage for selected resource
			candidateResources[selectedIndex].timesSinceLastUse = 0;
			//this is the chosen replacement
			replacementResource = candidateResources[selectedIndex];
		}
	}
	//assume no replacement was found
	identifiedAd.channelResourceID = null;
	if(replacementResource) {
		//check if this is admin intention
		if(replacementResource.userID == '1') {
			Utils.log('Admin intention selected, no more for a while...');
			//no more admin intentions for a while
			considerAdminIntentions = false;
		}
		
		//Set true false impression , if impression exists or set to -1 for null
		if(replacementResource.impression)
			replacementResource.impression= (replacementResource.impression == '1') ? true : false;
		else
			replacementResource.impression=-1;
		/*
		replacementResource.impression = -1;
		//see if there is a favorable impression
		//TODO: why calculate this every time? would be more efficient to calculate once...
		for(var lcv = 0; lcv < autologinData.channelResourceUserImpressions.length; lcv++) {
			if(autologinData.channelResourceUserImpressions[lcv].channelResourceID == replacementResource.id) {
				replacementResource.impression = (autologinData.channelResourceUserImpressions[lcv].impression == '1') ? true : false;
			}
		}
		*/
		//assume original size is replacing
		var containerWidth = replacementResource.containerWidth;
		var resourceWidth = replacementResource.resourceWidth;
		var containerHeight = replacementResource.containerHeight;
		var resourceHeight = replacementResource.resourceHeight;
		//determine img placement within container such that it is centered
		var horizontalContainerMargin = 0;
		if(resourceWidth < containerWidth) {
			horizontalContainerMargin = (containerWidth - resourceWidth) / 2;
		}
		var verticalContainerMargin = 0;
		if(resourceHeight < containerHeight) {
			verticalContainerMargin = (containerHeight - resourceHeight) / 2;
		}
		//build the replacement html
		var replacementHTML = '';
		//build the main div
		replacementHTML += '<div ';
		replacementHTML += 'autologinReplacementID="' + identifiedAd.autologinID + '" ';
		replacementHTML += 'channelResourceID="' + replacementResource.id + '" ';
		replacementHTML += 'impression="' + replacementResource.impression + '" ';
		replacementHTML += 'style="' + identifiedAd.replacementStyles;
		replacementHTML += 'visibility: visible; ';
		replacementHTML += 'height: ' + containerHeight + 'px; ';
		replacementHTML += 'width: ' + containerWidth + 'px; ';
		replacementHTML += '">';
		//build the positioning div
		replacementHTML += '<div ';
		replacementHTML += 'autologinReplacementParentID="' + identifiedAd.autologinID + '" ';
		replacementHTML += 'style="background-color: transparent; ';
		replacementHTML += 'height: ' + containerHeight + 'px; ';
		replacementHTML += 'width: ' + containerWidth + 'px; ';
		//limit vertical margin
		if(verticalContainerMargin > Conf.MAXIMUM_REPLACEMENT_VERTICAL_MARGIN) {
			verticalContainerMargin = Conf.MAXIMUM_REPLACEMENT_VERTICAL_MARGIN;
		}
		replacementHTML += 'margin-top: ' + verticalContainerMargin + 'px; ';
		replacementHTML += 'margin-bottom: ' + verticalContainerMargin + 'px; ';
		replacementHTML += 'margin-left: ' + horizontalContainerMargin + 'px; ';
		replacementHTML += 'margin-right: ' + horizontalContainerMargin + 'px; ';
		replacementHTML += '">';
		//build the main img
		replacementHTML += '<img ';
		replacementHTML += 'autologinReplacementParentID="' + identifiedAd.autologinID + '" ';
		replacementHTML += 'style="';
		replacementHTML += 'width: ' + resourceWidth + 'px; ';
		replacementHTML += 'height: ' + resourceHeight + 'px; ';
		replacementHTML += '" ';
		replacementHTML += 'src="https://' + Conf.CDN_DOMAIN + '/full/' + replacementResource.cdnFileName + '" ';		
		replacementHTML += '/>';
		//build the overlay
		replacementHTML += '<div ';
		replacementHTML += 'autologinReplacementParentID="' + identifiedAd.autologinID + '" ';
		replacementHTML += 'class="autologinImpressionOverlay" ';
		//consider destination
		if(replacementResource.destination) {
			replacementHTML += 'destination="' + Conf.API_URL + Conf.INTENTIONCLICK_LOG_PATH + '/' + replacementResource.id + '" ';
			replacementHTML += 'style="position: absolute; ';
			replacementHTML += 'width: ' + resourceWidth + 'px; ';
			replacementHTML += 'height: ' + resourceHeight + 'px; ';
			replacementHTML += 'margin-top: -' + resourceHeight + 'px; ';
			replacementHTML += 'cursor: pointer;" ';
			replacementHTML += '>';
		}
		else {
			replacementHTML += 'style="position: absolute; ';
			replacementHTML += 'width: ' + resourceWidth + 'px; ';
			replacementHTML += 'height: ' + resourceHeight + 'px; ';
			replacementHTML += 'margin-top: -' + resourceHeight + 'px;" ';
			replacementHTML += '>';
		}
		//build the thumbs up button markup
		replacementHTML += '<img ';
		replacementHTML += 'id="thumbsUpImpressionButton-' + identifiedAd.autologinID + '" ';
		replacementHTML += 'autologinReplacementParentID="' + identifiedAd.autologinID + '" ';
		replacementHTML += 'channelResourceID="' + replacementResource.id + '" ';
		replacementHTML += 'impressionValue="1" ';
		replacementHTML += 'style="position: absolute; ';
		replacementHTML += 'left: 10px; ';
		replacementHTML += 'top: 10px; ';
		replacementHTML += 'width: 26px; ';
		replacementHTML += 'height: 26px;" ';
		replacementHTML += 'activeSrc="' + vAPI.getURL('/img/browsericons/thumbsUp.png') + '" ';
		replacementHTML += 'inactiveSrc="' + vAPI.getURL('/img/browsericons/thumbsUpChecked.png') + '" ';
		replacementHTML += 'activeClass="autologinImpressionButton" ';
		replacementHTML += 'inactiveClass="" ';
		if(replacementResource.impression === true) {
			replacementHTML += 'src="' + vAPI.getURL('/img/browsericons/thumbsUpChecked.png') + '" ';
			replacementHTML += 'impressionState=active ';
		}
		else {
			replacementHTML += 'class="autologinImpressionButton" ';
			replacementHTML += 'src="' + vAPI.getURL('/img/browsericons/thumbsUp.png') + '" ';
			replacementHTML += 'impressionState=inactive ';
		}
		replacementHTML += '>';
		//build the share button markup
		replacementHTML += '<img ';
		replacementHTML += 'id="shareIntentionButton-' + identifiedAd.autologinID + '" ';
		replacementHTML += 'class="autologinShareButton" ';
		replacementHTML += 'autologinReplacementParentID="' + identifiedAd.autologinID + '" ';
		replacementHTML += 'channelResourceID="' + replacementResource.id + '" ';
		replacementHTML += 'style="position: absolute; ';
		replacementHTML += 'left: 46px; ';
		replacementHTML += 'top: 10px; ';
		replacementHTML += 'width: 26px; ';
		replacementHTML += 'height: 26px;" ';
		replacementHTML += 'src="' + vAPI.getURL('/img/browsericons/share.png') + '" ';
		replacementHTML += '>';
		//build the thumbs down button markup
		replacementHTML += '<img ';
		replacementHTML += 'id="thumbsDownImpressionButton-' + identifiedAd.autologinID + '" ';
		replacementHTML += 'autologinReplacementParentID="' + identifiedAd.autologinID + '" ';
		replacementHTML += 'channelResourceID="' + replacementResource.id + '" ';
		replacementHTML += 'impressionValue="0" ';
		replacementHTML += 'style="position: absolute; ';
		replacementHTML += 'left: 82px; ';
		replacementHTML += 'top: 10px; ';
		replacementHTML += 'width: 26px; ';
		replacementHTML += 'height: 26px;" ';
		replacementHTML += 'activeSrc="' + vAPI.getURL('/img/browsericons/thumbsDown.png') + '" ';
		replacementHTML += 'inactiveSrc="' + vAPI.getURL('/img/browsericons/thumbsDownChecked.png') + '" ';
		replacementHTML += 'activeClass="autologinImpressionButton" ';
		replacementHTML += 'inactiveClass="" ';
		if(replacementResource.impression === false) {
			replacementHTML += 'src="' + vAPI.getURL('/img/browsericons/thumbsDownChecked.png') + '" ';
			replacementHTML += 'impressionState=active ';
		}
		else {
			replacementHTML += 'class="autologinImpressionButton" ';
			replacementHTML += 'src="' + vAPI.getURL('/img/browsericons/thumbsDown.png') + '" ';
			replacementHTML += 'impressionState=inactive ';
		}
		replacementHTML += '>';
		//close impression overlay container div
		replacementHTML += '</div>';
		//close positioning div
		replacementHTML += '</div>';
		//close main div
		replacementHTML += '</div>';
		//save replacement info to identified ad
		identifiedAd.channelResourceID = replacementResource.id;
		identifiedAd.containerHeight = containerHeight;
		identifiedAd.containerWidth = containerWidth;
		identifiedAd.resourceHeight = resourceHeight;
		identifiedAd.resourceWidth = resourceWidth;
		identifiedAd.replacementHTML = replacementHTML;
		identifiedAd.replacementResourceData = replacementResource.base64;
		identifiedAd.replacementDestination = replacementResource.destination;
	}
	return identifiedAd;
};
	
	

/**************************************************************************************************
* Purpose: 
*	Opens the intention review page where the user can choose which channel to add it to.
*
* Params: 
*	imageURL (string) - the url of the image to be reviewed and added to a channel.
*	pageURL (string) - the url of the page where the image was found.
*
* Returns: None.
**************************************************************************************************/
var openIntentionReviewPage = function(imageURL, pageURL, description) {
	//ensure an intention was identified
	if(imageURL && pageURL) {
		//ensure image is not encoded data
		if(imageURL.indexOf('data:image') === 0) {
			alert('Sorry, this image is data-encoded and cannot be imported from this page.');
			return;
		}
		Utils.log('opening intention review page for image URL ' + imageURL);
		//open the URL for the user to review and choose a chnanel
		var queryString = '?imageURL=' + encodeURIComponent(imageURL) + '&pageURL=' + encodeURIComponent(pageURL) + '&description=' + encodeURIComponent(description);
		//var reviewWindow = window.open(, '_blank');
		 vAPI.tabs.open({"url":Conf.CHANNEL_RESOURCE_REVIEW_URL + queryString});
	}
	else {
		//TODO: error?

	}
};
	
	
	var handleAutologinGlobalMsg = function (tabID,messageData,callback) {
	
	
			
			
			if (messageData.action == 'login') {
			
				var obj={data:messageData.data,url:Conf.API_LOGIN_URL}
							extension.login(obj)
							
			}
			else if (messageData.action == 'logout') {
			
				var obj={data:messageData.data,url:Conf.API_LOGOUT_URL}
							extension.logout(obj)	
							
			}
	

	
	}
/**************************************************************************************************
 * Purpose:
 *	Takes appropriate action for message sent from a content script.
 *
 * Params:
 *	tabID - Id of the tab.
 *	messageData (object) - data related to the message. this varies depending on the message
 *		type. see the messages sent from the content scripts for more information.
 *	callback - Callback function to tab
 * Returns: None.
 **************************************************************************************************/
var handleAutologinMsg = function (tabID,messageData,callback) {
	
	
	if (!messageData )
		return;
		
		
		
			if (!extension.autologinActive )					
				return handleAutologinGlobalMsg(tabID,messageData,callback);
				
	//console.log("handleAutologinMsg",tabID,messageData)
	var tabURL = messageData.pageURL;
	
	//if(!µb.getNetFilteringSwitch(tabURL ))
		//return;
		
	
//Load definitions is the first call , check not whitelisted
	if(messageData.messageType == 'loaddefinitions' && µb.getNetFilteringSwitch(tabURL) == true ){	
				
				//TODO check domain whitlisted  , if not dont send any 
				var adDefns= extension.getAdDefinitions(tabURL)
				if(null != adDefns){
					
					//Check if tab already exists clean up resources 
					if(registeredTabData[tabID] != undefined){
						
						delete registeredTabData[tabID]
					}
					
					//keep track of time and channel resource history
					registeredTabData[tabID] = {
						registrationTimestamp: new Date().getTime(),
						channelResourceHistory: []
					};
					callback(adDefns)
				}
					
				
	}else if(messageData.messageType == 'identifiedads' && messageData.identifiedAds.length > 0){	
		//ads identified, kick off a new replacement operation
		activeReplacementOperations[tabID] = {};
		activeReplacementOperations[tabID].id = replacementOperationCounter;
		replacementOperationCounter++;
		activeReplacementOperations[tabID].identifiedAds = messageData.identifiedAds;
		
			Utils.log(activeReplacementOperations[tabID].identifiedAds.length + ' ads identified on tab id ' + tabID + ' (' + tabURL + ').');
		
		
		if(new Date().getTime() >= (registeredTabData[tabID].registrationTimestamp + Conf.TAB_REPLACEMENT_HISTORY_EXPIRATION)) {
			Utils.log('clearing stale resource replacement history for tab id ' + tabID + ' (' + tabURL + ').');
			registeredTabData[tabID].channelResourceHistory = [];
		}
		
			//Utils.log(activeReplacementOperations[tabID].identifiedAds);
		//go through each identified ad
		activeReplacementOperations[tabID].identifiedAds.forEach(function (identifiedAd) {
			//store the tab id for history purposes
			identifiedAd.tabID = tabID;
			//select resource and build html
			identifiedAd = buildReplacementHTML(identifiedAd);
			//update the tab history of resources
			registeredTabData[tabID].channelResourceHistory.push(identifiedAd.channelResourceID);
			
		});
		var replaceAdsMessageData = {
			messageType : 'instruction',
			instruction : 'replaceads',
			adReplacements : activeReplacementOperations[tabID].identifiedAds
		};
		
			Utils.log('sending replaceads instruction to tab id ' + tabID + ' (' + tabURL + ')');
		
			//Utils.log(replaceAdsMessageData);
		activeReplacementOperations[tabID].replaceAdsBegin = new Date().getTime();
		//send the identify ads instruction to the tab via the registered port
		//registeredTabPorts[tabID].postMessage(replaceAdsMessageData);
		//Send Message to client
		callback(replaceAdsMessageData)
		
	} else if (messageData.messageType == 'response') {
		//see what kind of response was received
		if (messageData.response == 'adsreplaced' && activeReplacementOperations[tabID]) {
			//log performance info
			activeReplacementOperations[tabID].replaceAdsEnd = new Date().getTime();
			activeReplacementOperations[tabID].replaceAdsDuration = (activeReplacementOperations[tabID].replaceAdsEnd - activeReplacementOperations[tabID].replaceAdsBegin) / 1000;
			//see what ads were replaced
			activeReplacementOperations[tabID].replacedAds = messageData.replacedAds;
			if (activeReplacementOperations[tabID].replacedAds && activeReplacementOperations[tabID].replacedAds.length > 0 && Conf.LOG_AD_REPLACEMENT) {
				
					Utils.log(activeReplacementOperations[tabID].replacedAds.length + ' ads replaced on tab id ' + tabID + ' (' + tabURL + ') in ' + activeReplacementOperations[tabID].replaceAdsDuration + ' seconds.');
				
					Utils.log(activeReplacementOperations[tabID].replacedAds);
				//log the operation and save the id
				var logID = activeReplacementOperations[tabID].id;
				replacementOperationLog[logID] = activeReplacementOperations[tabID];
				//remove tab id from active replacement operations
				delete activeReplacementOperations[tabID];
				var lastTimestamp = 0;
				var replacementLogArray = [];
				//go through each replaced ad
				replacementOperationLog[logID].replacedAds.forEach(function (replacedAd) {
					//jitter the timestamp
					if (replacedAd.timestamp == lastTimestamp)
						replacedAd.timestamp++;
					//create a new log object
					var adReplacementLog = {};
					adReplacementLog.channelResourceID = replacedAd.channelResourceID;
					adReplacementLog.adHeight = parseInt(replacedAd.height);
					adReplacementLog.adWidth = parseInt(replacedAd.width);
					adReplacementLog.resourceHeight = parseInt(replacedAd.resourceHeight);
					adReplacementLog.resourceWidth = parseInt(replacedAd.resourceWidth);
					adReplacementLog.url = replacedAd.url;
					adReplacementLog.timestamp = replacedAd.timestamp;
					//adReplacementLog.domain = replacedAd.domain;
					//adReplacementLog.details = JSON.stringify({ adHTML: replacedAd.adHTML, replacementHTML: replacedAd.replacementHTML });
					//add the log entry to the log array
					replacementLogArray.push(adReplacementLog);
					//save the last timestamp
					lastTimestamp = replacedAd.timestamp;
				});
				
					Utils.log('logging ' + replacementLogArray.length + ' replaced ads from tab id ' + tabID + ' (' + tabURL + ')');
			
				//	Utils.log(replacementLogArray);
				replacementOperationLog[logID].logReplacedAdsBegin = new Date().getTime();
				extension.ajax({
					method : 'POST',
					url : Conf.API_URL + Conf.REPLACEMENT_LOG_PATH,
					data : JSON.stringify(replacementLogArray),
					success : function (result, status, xhr) {
						//ensure successful logging of all ad replacements
						if (result.success === true && result.data && replacementOperationLog[logID] && result.data == replacementOperationLog[logID].replacedAds.length) {
							replacementOperationLog[logID].logReplacedAdsEnd = new Date().getTime();
							replacementOperationLog[logID].logReplacedAdsDuration = (replacementOperationLog[logID].logReplacedAdsEnd - replacementOperationLog[logID].logReplacedAdsBegin) / 1000;
							
								Utils.log(replacementLogArray.length + ' replaced ads logged from tab id ' + tabID + ' (' + tabURL + ') in ' + replacementOperationLog[logID].logReplacedAdsDuration + ' seconds.');
						} else 
							Utils.log('something went wrong with logging...');
						delete replacementOperationLog[logID];
					}
				});
			}
		} else if (messageData.response == 'lastrightclickadidentified') {
			//ensure an ad was identified
			if (messageData.lastRightClickAd) {
			
					Utils.log('reporting identified ad to API:');
				
				//	Utils.log(messageData.lastRightClickAd);
				//log it to api
				extension.ajax({
					method : 'POST',
					url : Conf.API_URL + Conf.REPORT_AD_PATH,
					data : JSON.stringify(messageData.lastRightClickAd),
					success : function (result, status, xhr) {
						//ensure successful logging of all ad replacements
						if (result.success === true) {
							//notify user of success
							var notificationOptions = {
								type : 'basic',
								title : 'Autologin Ad Identified',
								message : 'Thank you for your help in making the Internet a more fulfilling place! The ad has been successfully reported to the Autologin system for verification.',
								alert : 'Thank you for your help in making the Internet a more fulfilling place! The ad has been successfully reported to the Autologin system for verification.',
								iconUrl : 'img/browsericons/autologinLogo128.png'
							};
							issueAlert('autologinAdIdentifySuccess', notificationOptions);
						} else {
							//something went wrong, notify user
							var notificationOptions = {
								type : 'basic',
								title : 'Autologin Ad Identification Error',
								message : 'Whoops! Something unexpected happened while reporting the identified ad to the Autologin system. This error has been recorded and will be reviewed by the Autologin technical team.',
								alert : 'Whoops! Something unexpected happened while reporting the identified ad to the Autologin system. This error has been recorded and will be reviewed by the Autologin technical team.',
								iconUrl : 'img/browsericons/autologinLogo128.png'
							};
							issueAlert('autologinAdIdentifyFailure', notificationOptions);
						}
					}
				});
			} else {
			
					Utils.log('ad could not be identified or has already been identified.');
				var notificationOptions = {
					type : 'basic',
					title : 'Autologin Ad Not Identified',
					message : 'Either the ad could not be identified or has already been identified.',
					alert : 'Either the ad could not be identified or has already been identified.',
					iconUrl : 'img/browsericons/autologinLogo128.png'
				};
				issueAlert('autologinAdIdentifyFailure', notificationOptions);
			}
		} else if (messageData.response == 'lastrightclickintentionidentified') {
			//open the review intention page
			openIntentionReviewPage(messageData.lastRightClickIntentionURL, messageData.lastRightClickIntentionPageURL, messageData.lastRightClickIntentionDescription);
		}
	} else if (messageData.messageType == 'useraction') {
		
	
		
		if (messageData.action == 'impressionbuttonclicked') {
			//ensure impression button click data was retrieved
			if (messageData.impressionButtonClickData) {
				
					Utils.log('logging impression button click:');
				
					//add user data
				messageData.impressionButtonClickData.userID = Conf.USER_ID;
				//determine the route
				//determine the route
				var impressionRoute = messageData.impressionButtonClickData.impression === '0' ? Conf.CHANNEL_RESOURCE_DISLIKE_PATH : Conf.CHANNEL_RESOURCE_LIKE_PATH;
				impressionRoute += '/' + messageData.impressionButtonClickData.channelResourceID;
				
					//log the impression data
					extension.ajax({
						method : 'POST',
						url : Conf.API_URL + impressionRoute,
						data : JSON.stringify(messageData.impressionButtonClickData),
						success : function (result, status, xhr) {
							//check success
							if (result.success === true) {
								if (result.data && result.data.length === 1) {
								
										Utils.log('channelresourceuserimpression logged with id ' + result.data[0]);
								} else {
								
										Utils.log('channelresourceuserimpression updated');
								}
							} else {
								//something went wrong
							
									Utils.log('failed to log channelresourceuserimpressions');
							}
						}
					});
				//add record to impression list
				autologinData.channelResourceUserImpressions.push(messageData.impressionButtonClickData);
				//check if thumbs down
				if (messageData.impressionButtonClickData.impression === '0') {
					//remove the channel resource from the set
					for (var lcv = 0; lcv < autologinData.channelResources.length; lcv++) {
						if (autologinData.channelResources[lcv].id == messageData.impressionButtonClickData.channelResourceID) {
							autologinData.channelResources.splice(lcv, 1);
						}
					}
				}
			}
		} else if (messageData.action == 'sharebuttonclicked') {
			//open the share window
			
				Utils.log('opening share window for channelResourceID ' + messageData.shareButtonClickData.channelResourceID);
				
			
			vAPI.tabs.open({url:Conf.CHANNEL_RESOURCE_SHARE_URL + '/' + messageData.shareButtonClickData.channelResourceID})
			
		} else if (messageData.action == 'intendbuttonclicked') {
			//open the review intention window
			Utils.log('Got messageData.action intendbuttonclicked ' );
			var hideintenddata = {
			messageType : 'instruction',
			instruction : 'hideintend'
			};
		
			callback(hideintenddata)			
			openIntentionReviewPage(messageData.intendButtonClickData.imageURL, messageData.intendButtonClickData.pageURL, messageData.intendButtonClickData.description);
		}
	} else if (messageData.messageType == 'usernotification') {
		//create and display notification
		
			Utils.log('issuing user notification.');
		var notificationOptions = {
			type : 'basic',
			title : messageData.title,
			message : messageData.message,
			alert : messageData.message,
			iconUrl : 'img/browsericons/autologinLogo128.png'
		};
		issueAlert('addIntentionFailure', notificationOptions);
	} else if (messageData.messageType == 'contentscripterror') {
		//process the error
		Utils.log("Error received")
		Utils.log(messageData)
		processError('content', messageData.error, messageData.details);
	}
}


//Cross channel communication
vAPI.messaging.handleAutologinMsg = function (tabID,messageData,callback) {

	return handleAutologinMsg(tabID,messageData,callback)
}

var onMessage = function(request, sender, callback) {

	//console.log("Autologin content",request,sender,callback)
   
	
	 
	
	
    switch ( request.what ) {
		case "autologin":
					 if ( sender && sender.tab ) 
							handleAutologinMsg(sender.tab.id,request,callback)	
					else
						console.log("Error tab id is empty" ,sender)
						
				break
        default:
            return vAPI.messaging.UNHANDLED;
    }

	/*
    // Sync
    var response;

    var pageStore;
    if ( sender && sender.tab ) {
        pageStore = µb.pageStoreFromTabId(sender.tab.id);
    }

    switch ( request.what ) {
        case 'autologin-info':
            if ( pageStore && pageStore.getSpecificCosmeticFilteringSwitch() ) {
                response = µb.cosmeticFilteringEngine.retrieveDomainSelectors(request);
            }
            break;

       // default:
         //   return vAPI.messaging.UNHANDLED;
    }

    callback(response);
	*/
};

vAPI.messaging.listen('autologin-content.js', onMessage);



/******************************************************************************/

})();


(function() {

'use strict';

/******************************************************************************/

var handleUserAuthMsg = function (tabID,messageData,callback) {
	
	
			// console.log("Action" , messageData)
			
			if (messageData.action == 'login') {
			 console.log("Login Action" )
				var obj={data:messageData.data,url:Conf.API_LOGIN_URL}
							extension.login(obj)
							
			}
			else if (messageData.action == 'logout') {
			console.log("Logout Action" )
				var obj={data:messageData.data,url:Conf.API_LOGOUT_URL}
							extension.logout(obj)	
							
			}else if (messageData.action == 'refresh_client_data') {
			  console.log("refresh_client_data Action" )
							OnRefreshCookies(callback);
							
			}
			
	

	
	}
	
	
var µb = µBlock;
var onMessage = function(request, sender, callback) {

	//console.log("Autologin content",request,sender,callback)
   
	
	 
	
	
    switch ( request.what ) {
		case "autologin":
					 if ( sender && sender.tab ) {
						// console.log("received message from autologin client")
						handleUserAuthMsg(sender.tab.id,request,callback)
						
					 }
					else
						console.log("Error tab id is empty" ,sender)
						
				break
        default:
            return vAPI.messaging.UNHANDLED;
    }

	
};

vAPI.messaging.listen('autologin-client.js', onMessage);



/******************************************************************************/

})();