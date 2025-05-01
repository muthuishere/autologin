

// For background page or non-background pages

/* global self */

/******************************************************************************/
/******************************************************************************/

(function() {



self.vAPI = self.vAPI || {};

var chrome = self.chrome;
var vAPI = self.vAPI;


vAPI.getURL = chrome.runtime.getURL;
vAPI.i18n = chrome.i18n.getMessage;


self.AppExtn  = (function() {



    /******************************************************************************/
    
    var oneSecond = 1000;
    var oneMinute = 60 * oneSecond;
    var oneHour = 60 * oneMinute;
    
    
    return {
        userSettings: {
        
        },
    
     
    
        pageStores: {},    
   
        storageUsed: 0,
    
        noopFunc: function(){},
    
    
        // so that I don't have to care for last comma
        dummy: 0
    };
    
    /******************************************************************************/
    
    })();

vAPI.AppExtn= AppExtn; 
/******************************************************************************/

})();

/******************************************************************************/
