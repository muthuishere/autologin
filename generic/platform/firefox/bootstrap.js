
/* global APP_SHUTDOWN, APP_STARTUP */
/* exported startup, shutdown, install, uninstall */

'use strict';

/******************************************************************************/

// Accessing the context of the background page:
// var win = Services.appShell.hiddenDOMWindow.document.querySelector('iframe[src*=ublock]').contentWindow;

let bgProcess;
let version;
const hostName = 'autologin';
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

function install() {
    // https://bugzil.la/719376
    Components.classes['@mozilla.org/intl/stringbundle;1']
        .getService(Components.interfaces.nsIStringBundleService)
        .flushBundles();
}

/******************************************************************************/

function uninstall() {}

/******************************************************************************/
