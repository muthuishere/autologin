(function() {

'use strict';



if ( !vAPI ) {
  
    return;
}



var messager = vAPI.messaging.channel('vapi-init.js');
 messager.send({ action: 'inject' });


})();