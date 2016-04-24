
/******************************************************************************/

var locationChangeListener; // Keep alive while frameScript is alive

(function() {

'use strict';

/******************************************************************************/

let {contentObserver, LocationChangeListener} = Components.utils.import(
    Components.stack.filename.replace('Script', 'Module'),
    null
);

let injectContentScripts = function(win) {
    if ( !win || !win.document ) {
        return;
    }

    contentObserver.observe(win.document);

    if ( win.frames && win.frames.length ) {
        let i = win.frames.length;
        while ( i-- ) {
            injectContentScripts(win.frames[i]);
        }
    }
};

let onLoadCompleted = function() {
    removeMessageListener('autologin-load-completed', onLoadCompleted);
    injectContentScripts(content);
};

addMessageListener('autologin-load-completed', onLoadCompleted);

console.log("setting locationChangeListener",LocationChangeListener)
console.log(contentObserver)

locationChangeListener = new LocationChangeListener(docShell);
console.log("end setting locationChangeListener")
/******************************************************************************/

})();

/******************************************************************************/
