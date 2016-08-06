
/* global APP_SHUTDOWN, APP_STARTUP */
/* exported startup, shutdown, install, uninstall */

'use strict';

/******************************************************************************/

// Accessing the context of the background page:
// var win = Services.appShell.hiddenDOMWindow.document.querySelector('iframe[src*=ublock]').contentWindow;

let bgProcess;
let version;
const hostName = 'autologin';
let extensionstartupdata;

/*
const APP_STARTUP = 1	
const APP_SHUTDOWN = 2	
const ADDON_ENABLE = 3	
const ADDON_DISABLE = 4	
const ADDON_INSTALL=5	
const ADDON_UNINSTALL=6	
const ADDON_UPGRADE=7	
const ADDON_DOWNGRADE=8	//The add-on is being downgraded.
*/

const restartListener = {
    get messageManager() {
        return Components.classes['@mozilla.org/parentprocessmessagemanager;1']
            .getService(Components.interfaces.nsIMessageListenerManager);
    },

    receiveMessage: function() {
        shutdown();
        startup();
    }
};

/******************************************************************************/

function startup(data, reason) {
    if ( data !== undefined ) {
        version = data.version;
    }

    let appShell = Components.classes['@mozilla.org/appshell/appShellService;1']
        .getService(Components.interfaces.nsIAppShellService);

    let onReady = function(e) {
		
        if ( e ) {
            this.removeEventListener(e.type, onReady);
        }

        let hiddenDoc = appShell.hiddenDOMWindow.document;

        if ( hiddenDoc.readyState === 'loading' ) {
            hiddenDoc.addEventListener('DOMContentLoaded', onReady);
            return;
        }

        bgProcess = hiddenDoc.documentElement.appendChild(
            hiddenDoc.createElementNS('http://www.w3.org/1999/xhtml', 'iframe')
        );
        bgProcess.setAttribute(
            'src',
            'chrome://' + hostName + '/content/background.html#' + version
        );
		
		if(extensionstartupdata){
			
			console.log(extensionstartupdata , "INSTALL Bootstrap",reason)
			 
			appShell.hiddenDOMWindow.sessionStorage.setItem('extensionstartupdata',JSON.stringify(extensionstartupdata));
			extensionstartupdata=null;
		}
		

        restartListener.messageManager.addMessageListener(
            hostName + '-restart',
            restartListener
        );
    };

	
    if ( reason !== APP_STARTUP ) {
        onReady();
        return;
    }

    let ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1']
        .getService(Components.interfaces.nsIWindowWatcher);

    ww.registerNotification({
        observe: function(win, topic) {
            if ( topic !== 'domwindowopened' ) {
                return;
            }

            try {
                appShell.hiddenDOMWindow;
            } catch (ex) {
                return;
            }

            ww.unregisterNotification(this);
            win.addEventListener('DOMContentLoaded', onReady);
        }
    });
}

/******************************************************************************/

function shutdown(data, reason) {
    if ( reason === APP_SHUTDOWN ) {
        return;
    }

    bgProcess.parentNode.removeChild(bgProcess);

    if ( data === undefined ) {
        return;
    }

    // Remove the restartObserver only when the extension is being disabled
    restartListener.messageManager.removeMessageListener(
        hostName + '-restart',
        restartListener
    );
}

/******************************************************************************/



function install(aData, aReason) {
	
	 Components.classes['@mozilla.org/intl/stringbundle;1']
        .getService(Components.interfaces.nsIStringBundleService)
        .flushBundles();
		
		
		
	 
			var installData=aData || {}
			
			installData.installedVersion=installData.version
			
			if(installData.oldVersion){
				
					installData.existingVersion=installData.oldVersion
				  delete  installData.oldVersion;
				  
			}
						
		
	  
		 
			 if (aReason == ADDON_INSTALL) {
				   
				   installData.reason == "install" 
	   
				
		
				 extensionstartupdata={
						"reason":"install",
					  "data":installData
					  
				  }
				  
				  console.log("INSTALL DATA",extensionstartupdata)
			
			 } else if (aReason == ADDON_UPGRADE || aReason == ADDON_DOWNGRADE) {
				 
				 
				  installData.reason == "update" 
				 extensionstartupdata={
						"reason":"update",
					  "data":installData
					  
				  }
				  console.log("INSTALL DATA",extensionstartupdata)
			 }
	 
}




/******************************************************************************/

function uninstall(aData, aReason) {
     if (aReason == ADDON_UNINSTALL) {
          console.log('really uninstalling');
     } else {
          console.log('not a permanent uninstall, likely an upgrade or downgrade');
     }
}



/******************************************************************************/
