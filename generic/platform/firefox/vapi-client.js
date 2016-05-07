

/* global addMessageListener, removeMessageListener, sendAsyncMessage */

// For non background pages

/******************************************************************************/

(function(self) {

'use strict';

/******************************************************************************/


var vAPI = self.vAPI = self.vAPI || {};
vAPI.firefox = true;
vAPI.supportsbasicAuth = false;
vAPI.sessionId = String.fromCharCode(Date.now() % 25 + 97) +
    Math.random().toString(36).slice(2);

/******************************************************************************/

var messagingConnector = function(response) {
    if ( !response ) {
        return;
    }

    var channels = vAPI.messaging.channels;
    var channel, listener;

    if ( response.broadcast === true && !response.channelName ) {
        for ( channel in channels ) {
            if ( channels.hasOwnProperty(channel) === false ) {
                continue;
            }
            listener = channels[channel].listener;
            if ( typeof listener === 'function' ) {
                listener(response.msg);
            }
        }
        return;
    }

    if ( response.requestId ) {
        listener = vAPI.messaging.listeners[response.requestId];
        delete vAPI.messaging.listeners[response.requestId];
        delete response.requestId;
    }

    if ( !listener ) {
        channel = channels[response.channelName];
        listener = channel && channel.listener;
    }

    if ( typeof listener === 'function' ) {
        listener(response.msg);
    }
};




/******************************************************************************/

vAPI.messaging = {
    channels: {},
    listeners: {},
    requestId: 1,

    setup: function() {
		
		
        this.connector = function(msg) {
            messagingConnector(JSON.parse(msg));
        };

        addMessageListener(this.connector);

        this.channels['vAPI'] = {};
        this.channels['vAPI'].listener = function(msg) {
			
			
            if ( msg.cmd === 'injectScript' ) {
                var details = msg.details;

                if ( !details.allFrames && window !== window.top ) {
                    return;
                }

                self.injectScript(details.file);
            }
			else if ( msg.cmd === 'injectContentScript' ) {
                var details = msg.details;

                if ( !details.allFrames && window !== window.top ) {
                    return;
                }

                self.injectContentScript(details.code);
            }
        };
    },

    close: function() {
        if ( !this.connector ) {
            return;
        }

        removeMessageListener();
        this.connector = null;
        this.channels = {};
        this.listeners = {};
    },

    channel: function(channelName, callback) {
        if ( !channelName ) {
            return;
        }

        this.channels[channelName] = {
            channelName: channelName,
            listener: typeof callback === 'function' ? callback : null,
            send: function(message, callback) {
					
					//console.log("client: message setup started")
                if ( !vAPI.messaging.connector ) {
                    vAPI.messaging.setup();
                }

                message = {
                    channelName: self._sandboxId_ + '|' + this.channelName,
                    msg: message
                };

                if ( callback ) {
                    message.requestId = vAPI.messaging.requestId++;
                    vAPI.messaging.listeners[message.requestId] = callback;
                }

				
				
                sendAsyncMessage('autologin:background', message);
            },
            close: function() {
                delete vAPI.messaging.channels[this.channelName];
            }
        };

        return this.channels[channelName];
    },

    toggleListener: function({type, persisted}) {
		
		
        if ( !vAPI.messaging.connector ) {
            return;
        }

        if ( type === 'pagehide' ) {
            removeMessageListener();
            return;
        }

        if ( persisted ) {
            addMessageListener(vAPI.messaging.connector);
        }
    }
};

window.addEventListener('pagehide', vAPI.messaging.toggleListener, true);
window.addEventListener('pageshow', vAPI.messaging.toggleListener, true);

/******************************************************************************/

})(this);

/******************************************************************************/
