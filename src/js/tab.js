

/* global vAPI, AppExtn */

/******************************************************************************/
/******************************************************************************/



(function() {

'use strict';

/******************************************************************************/

var µb = AppExtn;

// https://github.com/gorhill/httpswitchboard/issues/303
// Some kind of trick going on here:
//   Any scheme other than 'http' and 'https' is remapped into a fake
//   URL which trick the rest of AppExtn into being able to process an
//   otherwise unmanageable scheme. AppExtn needs web page to have a proper
//   hostname to work properly, so just like the 'chromium-behind-the-scene'
//   fake domain name, we map unknown schemes into a fake '{scheme}-scheme'
//   hostname. This way, for a specific scheme you can create scope with
//   rules which will apply only to that scheme.

/******************************************************************************/
/******************************************************************************/

µb.normalizePageURL = function(tabId, pageURL) {
    if ( vAPI.isBehindTheSceneTabId(tabId) ) {
        return 'http://behind-the-scene/';
    }
	
	
	return pageURL;
	/*
	
    var uri = this.URI.set(pageURL);
    var scheme = uri.scheme;
    if ( scheme === 'https' || scheme === 'http' ) {
        return uri.normalizedURI();
    }

    var fakeHostname = scheme + '-scheme';

    if ( uri.hostname !== '' ) {
        fakeHostname = uri.hostname + '.' + fakeHostname;
    } else if ( scheme === 'about' && uri.path !== '' ) {
        fakeHostname = uri.path + '.' + fakeHostname;
    }

    return 'http://' + fakeHostname + '/';
	*/
};


µb.tabContextManager = (function() {
    var tabContexts = Object.create(null);

  
    // This is to be used as last-resort fallback in case a tab is found to not
    // be bound while network requests are fired for the tab.
    var mostRecentRootDocURL = '';
    var mostRecentRootDocURLTimestamp = 0;

    var gcPeriod = 10 * 60 * 1000;

    var TabContext = function(tabId) {
        this.tabId = tabId.toString();
        this.stack = [];
        this.rawURL =
        this.normalURL =
        this.rootHostname =
        this.rootDomain = '';
        this.timer = null;
        this.onTabCallback = null;
        this.onTimerCallback = null;

        tabContexts[tabId] = this;
    };

    TabContext.prototype.destroy = function() {
        if ( vAPI.isBehindTheSceneTabId(this.tabId) ) {
            return;
        }
        if ( this.timer !== null ) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        delete tabContexts[this.tabId];
    };

    TabContext.prototype.onTab = function(tab) {
        if ( tab ) {
            this.timer = setTimeout(function(){
				this.onTimerCallback
			}, gcPeriod);
        } else {
            this.destroy();
        }
    };

    TabContext.prototype.onTimer = function() {
        this.timer = null;
        if ( vAPI.isBehindTheSceneTabId(this.tabId) ) {
            return;
        }
        vAPI.tabs.get(this.tabId, this.onTabCallback);
    };

    // This takes care of orphanized tab contexts. Can't be started for all
    // contexts, as the behind-the-scene context is permanent -- so we do not
    // want to slush it.
    TabContext.prototype.autodestroy = function() {
        if ( vAPI.isBehindTheSceneTabId(this.tabId) ) {
            return;
        }
        this.onTabCallback = this.onTab.bind(this);
        this.onTimerCallback = this.onTimer.bind(this);
        this.timer = setTimeout(function(){
			this.onTimerCallback
		}, gcPeriod);
    };

    // Update just force all properties to be updated to match the most current
    // root URL.
    TabContext.prototype.update = function() {
        if ( this.stack.length === 0 ) {
            this.rawURL = this.normalURL = this.rootHostname = this.rootDomain = '';
        } else {
            this.rawURL = this.stack[this.stack.length - 1];
            this.normalURL = µb.normalizePageURL(this.tabId, this.rawURL);
           this.rootHostname = DomUtils.parseUri(this.normalURL);
           this.rootDomain = DomUtils.parseUri.secondLevelDomainOnly(this.rootHostname);
        }
    };

    // Called whenever a candidate root URL is spotted for the tab.
    TabContext.prototype.push = function(url) {
        if ( vAPI.isBehindTheSceneTabId(this.tabId) ) {
            return;
        }
        var count = this.stack.length;
        if ( count !== 0 && this.stack[count - 1] === url ) {
            return;
        }
        this.stack.push(url);
        this.update();
    };

    // Called when a former push is a false positive:
    
    TabContext.prototype.unpush = function(url) {
        if ( vAPI.isBehindTheSceneTabId(this.tabId) ) {
            return;
        }
        // We are not going to unpush if there is no other candidate, the
        // point of unpush is to make space for a better candidate.
        if ( this.stack.length === 1 ) {
            return;
        }
        var pos = this.stack.indexOf(url);
        if ( pos === -1 ) {
            return;
        }
        this.stack.splice(pos, 1);
        if ( this.stack.length === 0 ) {
            this.destroy();
            return;
        }
        if ( pos !== this.stack.length ) {
            return;
        }
        this.update();
    };

    // This tells that the url is definitely the one to be associated with the
    // tab, there is no longer any ambiguity about which root URL is really
    // sitting in which tab.
    TabContext.prototype.commit = function(url) {
        if ( vAPI.isBehindTheSceneTabId(this.tabId) ) {
            return;
        }
        this.stack = [url];
        this.update();
    };

    // These are to be used for the API of the tab context manager.

    var push = function(tabId, url) {
        var entry = tabContexts[tabId];
        if ( entry === undefined ) {
            entry = new TabContext(tabId);
            entry.autodestroy();
        }
        entry.push(url);
        mostRecentRootDocURL = url;
        mostRecentRootDocURLTimestamp = Date.now();
        return entry;
    };

    // Find a tab context for a specific tab. If none is found, attempt to
    // fix this. When all fail, the behind-the-scene context is returned.
    var lookup = function(tabId, url) {
        var entry;
        if ( url !== undefined ) {
            entry = push(tabId, url);
        } else {
            entry = tabContexts[tabId];
        }
        if ( entry !== undefined ) {
            return entry;
        }
        
        // Google Hangout popup opens without a root frame. So for now we will
        // just discard that best-guess root frame if it is too far in the
        // future, at which point it ceases to be a "best guess".
        if ( mostRecentRootDocURL !== '' && mostRecentRootDocURLTimestamp + 500 < Date.now() ) {
            mostRecentRootDocURL = '';
        }

        if ( mostRecentRootDocURL !== '' ) {
            return push(tabId, mostRecentRootDocURL);
        }

        return tabContexts[vAPI.noTabId];
    };

    var commit = function(tabId, url) {
        var entry = tabContexts[tabId];
        if ( entry === undefined ) {
            entry = push(tabId, url);
        } else {
            entry.commit(url);
        }
        return entry;
    };

    var unpush = function(tabId, url) {
        var entry = tabContexts[tabId];
        if ( entry !== undefined ) {
            entry.unpush(url);
        }
    };

    var destroy = function(tabId) {
        var entry = tabContexts[tabId];
        if ( entry !== undefined ) {
            entry.destroy();
        }
    };

    var exists = function(tabId) {
        return tabContexts[tabId] !== undefined;
    };

    // Behind-the-scene tab context
    (function() {
        var entry = new TabContext(vAPI.noTabId);
        entry.stack.push('');
        entry.rawURL = '';
        entry.normalURL = µb.normalizePageURL(entry.tabId);
        entry.rootHostname = DomUtils.parseUri(entry.normalURL);
       entry.rootDomain = DomUtils.parseUri.secondLevelDomainOnly(entry.rootHostname);
    })();

    // Context object, typically to be used to feed filtering engines.
    var Context = function(tabId) {
        var tabContext = lookup(tabId);
        this.rootHostname = tabContext.rootHostname;
        this.rootDomain = tabContext.rootDomain;
        this.pageHostname = 
        this.pageDomain =
        this.requestURL =
        this.requestHostname =
        this.requestDomain = '';
    };

    var createContext = function(tabId) {
        return new Context(tabId);
    };

    return {
        push: push,
        unpush: unpush,
        commit: commit,
        lookup: lookup,
        destroy: destroy,
        exists: exists,
        createContext: createContext
    };
})();

/******************************************************************************/
/******************************************************************************/
// When the DOM content of root frame is loaded, this means the tab
// content has changed.

vAPI.tabs.onNavigation = function(details) {
	
	//console.log("On navigation ")
    if ( details.frameId !== 0 ) {
        return;
    }
    var tabContext = µb.tabContextManager.commit(details.tabId, details.url);
    var pageStore = µb.bindTabToPageStats(details.tabId, 'afterNavigate');

//console.log("Changing page refreshing all vi navigation",details)
//if(vAPI.tabs.updateOnNavigate)



    if ( pageStore && tabContext.rawURL.lastIndexOf('http', 0) === 0 ) {
        pageStore.hostnameToCountMap[tabContext.rootHostname] = 0;
    }
};

/******************************************************************************/

// It may happen the URL in the tab changes, while the page's document
// stays the same (for instance, Google Maps). Without this listener,
// the extension icon won't be properly refreshed.

vAPI.tabs.onUpdated = function(tabId, changeInfo, tab) {

//console.log("vAPI.tabs.onUpdated tab.js " + tab.url )
    if ( !tab.url || tab.url === '' ) {
        return;
    }
    if ( !changeInfo.url ) {
        return;
    }



//console.log("Changing page refreshing onupdated" + tab.url )

	
    µb.tabContextManager.commit(tabId, changeInfo.url);
    µb.bindTabToPageStats(tabId, 'tabUpdated');
	

	 if(tab.url.indexOf("http") == 0 || tab.url.indexOf("www") == 0  ){
	  
			
		}else{
			return;
		}
  
		
			globalAutologinHandler.processScripts(tab)
			

};

/******************************************************************************/

vAPI.tabs.onClosed = function(tabId) {
    if ( tabId < 0 ) {
        return;
    }
	
    µb.unbindTabFromPageStats(tabId);
};




/******************************************************************************/



vAPI.tabs.onPopup = function(details) {
    // console.debug('vAPI.tabs.onPopup: details = %o', details);

    var tabContext = µb.tabContextManager.lookup(details.openerTabId);
    var openerURL = '';
    if ( tabContext.tabId === details.openerTabId ) {
        openerURL = tabContext.normalURL;
    }
    if ( openerURL === '' ) {
        return;
    }

    var µburi = µb.URI;
    var openerHostname = DomUtils.parseUri(tab.url).hostname;
    var openerDomain = DomUtils.parseUri.secondLevelDomainOnly(openerHostname,false) 

    var targetURL = details.targetURL;

    var context = {
        pageHostname: openerHostname,
        pageDomain: openerDomain,
        rootHostname: openerHostname,
        rootDomain: openerDomain,
        requestURL: targetURL,
      requestHostname: DomUtils.parseUri(targetURL),
        requestType: 'popup'
    };

    var result = '';


    if (
        result === '' &&
        µb.getNetFilteringSwitch(openerURL) &&
        µb.getNetFilteringSwitch(targetURL)
    ) {
        result = µb.staticNetFilteringEngine.matchStringExactType(context, targetURL, 'popup');
    }


    var pageStore = µb.pageStoreFromTabId(details.openerTabId); 
    if ( pageStore ) {
        pageStore.logRequest(context, result);
    }
    µb.logger.writeOne(details.openerTabId, context, result);

    // Not blocked
    if ( µb.isAllowResult(result) ) {
        return;
    }

    // Blocked
    if ( µb.userSettings.showIconBadge ) {
        µb.updateBadgeAsync(details.openerTabId);
    }

    // It is a popup, block and remove the tab.
    if(details.targetTabId !== "preempt") {
        µb.unbindTabFromPageStats(details.targetTabId);
        vAPI.tabs.remove(details.targetTabId);
    }

    return true;
};

vAPI.tabs.registerListeners();

/******************************************************************************/
/******************************************************************************/

// Create an entry for the tab if it doesn't exist.

µb.bindTabToPageStats = function(tabId, context) {
  

	
    if ( µb.tabContextManager.exists(tabId) === false ) {
        this.unbindTabFromPageStats(tabId);
        return null;
    }
	
	
    // Reuse page store if one exists: this allows to guess if a tab is a popup
    var pageStore = this.pageStores[tabId];

    // Tab is not bound
    if ( !pageStore ) {
        return this.pageStores[tabId] = this.PageStore.factory(tabId);
    }

    
    // If context if 'beforeRequest', do not rebind
    if ( context === 'beforeRequest' ) {
        return pageStore;
    }

    // Rebind according to context. We rebind even if the URL did not change,
    // as maybe the tab was force-reloaded, in which case the page stats must
    // be all reset.
    pageStore.reuse(context);

		if ( context !== 'beforeRequest' ) {
		
		
		
		}
	
	
    return pageStore;
};

/******************************************************************************/

µb.unbindTabFromPageStats = function(tabId) {
    //console.debug('AppExtn> unbindTabFromPageStats(%d)', tabId);
    var pageStore = this.pageStores[tabId];
    if ( pageStore !== undefined ) {
        pageStore.dispose();
        delete this.pageStores[tabId];
    }
};

µb.pageStoreFromTabId = function(tabId) {
    return this.pageStores[tabId] || null;
};

/******************************************************************************/

// Permanent page store for behind-the-scene requests. Must never be removed.

µb.pageStores[vAPI.noTabId] = µb.PageStore.factory(vAPI.noTabId);

/******************************************************************************/
/******************************************************************************/




var pageStoreJanitorPeriod = 15 * 60 * 1000;
var pageStoreJanitorSampleAt = 0;
var pageStoreJanitorSampleSize = 10;

var pageStoreJanitor = function() {
    var vapiTabs = vAPI.tabs;
    var tabIds = Object.keys(µb.pageStores).sort();
    var checkTab = function(tabId) {
        vapiTabs.get(tabId, function(tab) {
            if ( !tab ) {
                //console.error('tab.js> pageStoreJanitor(): stale page store found:', µb.pageUrlFromTabId(tabId));
                µb.unbindTabFromPageStats(tabId);
            }
        });
    };
    if ( pageStoreJanitorSampleAt >= tabIds.length ) {
        pageStoreJanitorSampleAt = 0;
    }
    var tabId;
    var n = Math.min(pageStoreJanitorSampleAt + pageStoreJanitorSampleSize, tabIds.length);
    for ( var i = pageStoreJanitorSampleAt; i < n; i++ ) {
        tabId = tabIds[i];
        // Do not remove behind-the-scene page store
        if ( vAPI.isBehindTheSceneTabId(tabId) ) {
            continue;
        }
        checkTab(tabId);
    }
    pageStoreJanitorSampleAt = n;

    setTimeout(function(){
		pageStoreJanitor()
	}, pageStoreJanitorPeriod);
};

setTimeout(function(){
	pageStoreJanitor
}, pageStoreJanitorPeriod);

/******************************************************************************/
/******************************************************************************/

})();

/******************************************************************************/
