//TODO remove unused variables
var AUTOLOGIN_LOGOUT_DEBUG = []; // this is for debugging logout issue
var autologinActive = false; //begin as inactive
var autologinInitializing = false; //keep track of initialization state
var userLoggedIn = true; //assume user is logged in
var autologinData = {}; //object for all relevant api data
var registeredTabPorts = {}; //list of registered tabs and their connection ports
var registeredTabData = {}; //stores relevant information about each tab
var registeredFramePorts = {}; //list of registered frames and their connection ports
var replacementOperationCounter = 1; //identification counter for each replacement operation
var activeReplacementOperations = {}; //list of tab ids which have active replacement operations
var replacementOperationLog = {}; //log of all replacement operations
var notificationCount = 0; //number of active notifications to display in the action button
var notificationsOpen = false; //whether notifications page is open
var lastAlertId=null;
var considerAdminIntentions = true; //whether intentions from admin are candidates for replacement
var considerAdminIntentionsTimer = null; //timer that determines when admin intentions are candidates for replacement
var disconnectedReinitializationTimer = null; //timer that retries initialization if internet is disconnected




if (!vAPI.hasOwnProperty('toolbarButton')) {
	vAPI.toolbarButton={}
}


/******************************************************************************
	vAPI.toolbarButton.events.listeners 
******************************************************************************/

vAPI.toolbarButton.events={
	
	listeners:[],
	onClick:function(callback){
		vAPI.toolbarButton.events.listeners.push(callback)
		
	},
	handleClick:function(tab){
		for(var i=0;i<vAPI.toolbarButton.events.listeners.length;i++)
			vAPI.toolbarButton.events.listeners[i](tab)
		
	},
	remove:function(callback){
		
		var i=0;
		for( i=0;i<vAPI.toolbarButton.events.listeners.length;i++){
			if(callback == vAPI.toolbarButton.events.listeners[i]){
				
				break
			}
				
		}
			
			if(i<vAPI.toolbarButton.events.listeners.length)
					vAPI.toolbarButton.events.listeners.splice(i,1);
			
		
		//???
	}
	
	
}




if (!vAPI.hasOwnProperty('tabWatcher')) {
	vAPI.tabWatcher={}
}



vAPI.tabWatcher.events={
	
	activatelisteners:[],
	
	onActivate:function(callback){
		vAPI.tabWatcher.events.activatelisteners.push(callback)
		
	},
	handleActivate:function(tab){
		for(var i=0;i<vAPI.tabWatcher.events.activatelisteners.length;i++)
			vAPI.tabWatcher.events.activatelisteners[i](tab)
		
	},
	remove:function(callback){
		
		var i=0;
		for(i=0;i<vAPI.tabWatcher.events.activatelisteners.length;i++){
			if(callback == vAPI.tabWatcher.events.activatelisteners[i]){
				
				break
			}
				
		}
		
			if(i<vAPI.tabWatcher.events.activatelisteners.length){
					vAPI.tabWatcher.events.activatelisteners.splice(i,1);
					return
					}
			
			
			
			
		
		//???
	}
	
	
}




