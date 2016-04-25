(function() {

'use strict';



if ( !vAPI ) {
  
    return;
}

console.log("VAPI init started")

var messager = vAPI.messaging.channel('vapi-init.js');
 messager.send({ action: 'inject' });


})();