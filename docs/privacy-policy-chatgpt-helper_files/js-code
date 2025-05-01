"use strict";window.LCG_TRACKING_INITIALIZE=function(){var _DEBUG=_coalesce(window.LCG_TRACKING_DEBUG,false);if(_DEBUG)
console.log("[LCG][dd][6f1f5c0d]","initializing...");var _PUSH_URL=new URL(_coalesce(window.LCG_TRACKING_PUSH_URL,"/track"),document.location).href;var _PUSH_SESSION=_coalesce(window.LCG_TRACKING_SESSION,"00000000000000000000000000000000");var _CONTEXT_APPLICATION=_coalesce(window.LCG_TRACKING_APPLICATION,null);var _CONTEXT_ENVIRONMENT=_coalesce(window.LCG_TRACKING_ENVIRONMENT,null);var _CONTEXT_EXPERIMENT=_coalesce(window.LCG_TRACKING_EXPERIMENT,null);var _CONTEXT_VARIANT=_coalesce(window.LCG_TRACKING_VARIANT,null);var _CONTEXT_EPOCH=_coalesce(window.LCG_TRACKING_EPOCH,null);var _CONTEXT_SCOPE=_coalesce(window.LCG_TRACKING_SCOPE,null);var _CONTEXT_DATA=_coalesce(window.LCG_TRACKING_DATA,null);var _CONTEXT_SESSION=_coalesce(window.LCG_TRACKING_SESSION,null);var _CONTEXT_TRANSACTION=_coalesce(window.LCG_TRACKING_TRANSACTION,null);var _CONTEXT_TRANSACTION_RESET=-1;var _CONTEXT_TRANSACTION_COUNTER=0;var _CONTEXT_LAST_document_location=document.location.href;var _CONTEXT_LAST_document_referrer=document.referrer;var _PUSH_CONTEXT_INCLUDE=_coalesce(window.LCG_TRACKING_PUSH_CONTEXT_INCLUDE,false);var _PUSH_DOCUMENT_INCLUDE=_coalesce(window.LCG_TRACKING_PUSH_DOCUMENT_INCLUDE,false);var _PUSH_VIEWPORT_INCLUDE=_coalesce(window.LCG_TRACKING_PUSH_VIEWPORT_INCLUDE,false);var _COLLECT_INITIALIZED_ENABLED=_coalesce(window.LCG_TRACKING_COLLECT_INITIALIZED_ENABLED,true);var _COLLECT_INITIALIZED_FULL=_coalesce(window.LCG_TRACKING_COLLECT_INITIALIZED_FULL,false);var _COLLECT_BEACON_ENABLED=_coalesce(window.LCG_TRACKING_COLLECT_BEACON_ENABLED,false);var _COLLECT_BEACON_INTERVAL=_coalesce(window.LCG_TRACKING_COLLECT_BEACON_INTERVAL,60)*1000;var _COLLECT_CONTEXT_ENABLED=_coalesce(window.LCG_TRACKING_COLLECT_CONTEXT_ENABLED,true);var _COLLECT_DOCUMENT_ENABLED=_coalesce(window.LCG_TRACKING_COLLECT_DOCUMENT_ENABLED,true);var _COLLECT_DEVICE_ENABLED=_coalesce(window.LCG_TRACKING_COLLECT_DEVICE_ENABLED,true);var _COLLECT_VIEWPORT_ENABLED=_coalesce(window.LCG_TRACKING_COLLECT_VIEWPORT_ENABLED,false);var _COLLECT_VIEWPORT_INTERVAL=_coalesce(window.LCG_TRACKING_COLLECT_VIEWPORT_INTERVAL,60)*1000;var _COLLECT_PERFORMANCE_NAVIGATION_ENABLED=_coalesce(window.LCG_TRACKING_COLLECT_PERFORMANCE_NAVIGATION_ENABLED,true);var _COLLECT_PERFORMANCE_ENTRIES_ENABLED=_coalesce(window.LCG_TRACKING_COLLECT_PERFORMANCE_ENTRIES_ENABLED,false);var _COLLECT_PERFORMANCE_ENTRIES_INTERVAL=_coalesce(window.LCG_TRACKING_COLLECT_PERFORMANCE_ENTRIES_INTERVAL,6)*1000;var _INJECT_A_ELEMENTS=_coalesce(window.LCG_TRACKING_INJECT_A_ELEMENTS_ENABLED,false);var _INJECT_DATA_ELEMENTS=_coalesce(window.LCG_TRACKING_INJECT_DATA_ELEMENTS_ENABLED,true);if(_DEBUG){console.log("[LCG][dd][89c0ee13]","configuration","_PUSH_URL",_PUSH_URL);console.log("[LCG][dd][89c0ee13]","configuration","_PUSH_SESSION",_PUSH_SESSION);console.log("[LCG][dd][89c0ee13]","configuration","_CONTEXT_APPLICATION",_CONTEXT_APPLICATION);console.log("[LCG][dd][89c0ee13]","configuration","_CONTEXT_ENVIRONMENT",_CONTEXT_ENVIRONMENT);console.log("[LCG][dd][89c0ee13]","configuration","_CONTEXT_EXPERIMENT",_CONTEXT_EXPERIMENT);console.log("[LCG][dd][89c0ee13]","configuration","_CONTEXT_VARIANT",_CONTEXT_VARIANT);console.log("[LCG][dd][89c0ee13]","configuration","_CONTEXT_EPOCH",_CONTEXT_EPOCH);console.log("[LCG][dd][89c0ee13]","configuration","_CONTEXT_SCOPE",_CONTEXT_SCOPE);console.log("[LCG][dd][89c0ee13]","configuration","_CONTEXT_SESSION",_CONTEXT_SESSION);console.log("[LCG][dd][89c0ee13]","configuration","_CONTEXT_TRANSACTION",_CONTEXT_TRANSACTION);console.log("[LCG][dd][89c0ee13]","configuration","_PUSH_CONTEXT_INCLUDE",_PUSH_CONTEXT_INCLUDE);console.log("[LCG][dd][89c0ee13]","configuration","_PUSH_DOCUMENT_INCLUDE",_PUSH_DOCUMENT_INCLUDE);console.log("[LCG][dd][89c0ee13]","configuration","_PUSH_VIEWPORT_INCLUDE",_PUSH_VIEWPORT_INCLUDE);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_INITIALIZED_ENABLED",_COLLECT_INITIALIZED_ENABLED);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_INITIALIZED_FULL",_COLLECT_INITIALIZED_FULL);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_BEACON_ENABLED",_COLLECT_BEACON_ENABLED);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_BEACON_INTERVAL",_COLLECT_BEACON_INTERVAL/1000.0);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_CONTEXT_ENABLED",_COLLECT_CONTEXT_ENABLED);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_DOCUMENT_ENABLED",_COLLECT_DOCUMENT_ENABLED);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_DEVICE_ENABLED",_COLLECT_DEVICE_ENABLED);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_VIEWPORT_ENABLED",_COLLECT_VIEWPORT_ENABLED);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_VIEWPORT_INTERVAL",_COLLECT_VIEWPORT_INTERVAL/1000.0);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_PERFORMANCE_NAVIGATION_ENABLED",_COLLECT_PERFORMANCE_NAVIGATION_ENABLED);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_PERFORMANCE_ENTRIES_ENABLED",_COLLECT_PERFORMANCE_ENTRIES_ENABLED);console.log("[LCG][dd][89c0ee13]","configuration","_COLLECT_PERFORMANCE_ENTRIES_INTERVAL",_COLLECT_PERFORMANCE_ENTRIES_INTERVAL/1000.0);console.log("[LCG][dd][89c0ee13]","configuration","_INJECT_A_ELEMENTS",_INJECT_A_ELEMENTS);console.log("[LCG][dd][89c0ee13]","configuration","_INJECT_DATA_ELEMENTS",_INJECT_DATA_ELEMENTS);}
function _queryContext(){return({"$schema":"20200304a","application":_CONTEXT_APPLICATION,"environment":_CONTEXT_ENVIRONMENT,"experiment":_CONTEXT_EXPERIMENT,"variant":_CONTEXT_VARIANT,"epoch":_CONTEXT_EPOCH,"scope":_CONTEXT_SCOPE,"data":_CONTEXT_DATA,});}
function _queryDocument(){return _query_0("20190617a",window,{"location":[function(){return(_CONTEXT_LAST_document_location);}],"referrer":[function(){return(_CONTEXT_LAST_document_referrer);}],"title":["document","title"],});}
function _queryDevice(){return _query_0("20190617a",window,{"user_agent":["navigator","userAgent"],"platform":["navigator","platform"],"language":["navigator","language"],"languages":["navigator","languages"],"connection_type":["navigator","connection","effectiveType"],"connection_downlink":["navigator","connection","downlink"],"connection_rtt":["navigator","connection","rtt"],"connection_save":["navigator","connection","saveData"],"screen_width":["screen","width"],"screen_height":["screen","height"],"screen_width_actual":["screen","availWidth"],"screen_height_actual":["screen","availHeight"],"screen_orientation":["screen","orientation","type"],"screen_px_ratio":["devicePixelRatio"],});}
function _queryViewport(){return _query_0("20190617a",window,{"window_width":["outerWidth"],"window_height":["outerHeight"],"viewport_width":["innerWidth"],"viewport_height":["innerHeight"],"viewport_scroll_x":["scrollX"],"viewport_scroll_y":["scrollY"],"viewport_px_ratio":["devicePixelRatio"],});}
function _queryPerformanceNavigation(){return _query_0("20190617a",window,{"navigation":["performance","navigation"],"timing":["performance","timing"],});}
function _query_0(_schema,_root,_attributes){var _outcome={"$schema":_schema,};for(var _attribute in _attributes){var _value=_root;for(var _path in _attributes[_attribute]){_path=_attributes[_attribute][_path];switch(typeof(_path)){case "string":if(typeof(_value)!="object"){console.log("[LCG][ee][a3387bbe]",_root,_attributes[_attribute]);_value=undefined;}
_value=_value[_path];break;case "function":try{_value=_path(_value);}catch(_error){console.log("[LCG][ee][baaf52a2]",_root,_attributes[_attribute],_error);_value=undefined;}
break;default:console.log("[LCG][ee][fe47f09e]",_path);break;}
if(_value===undefined)
break;}
switch(typeof(_value)){case "undefined":case "null":_value=null;break;case "boolean":case "number":break;case "string":if(_value=="")
_value=null;break;case "object":try{_value=JSON.stringify(_value);_value=JSON.parse(_value);}catch(_error){console.log("[LCG][ee][c453d5cb]",_error);_value="<invalid:object>";}
break;default:_value="<invalid:"+typeof(_value)+">";break;}
_outcome[_attribute]=_value;}
return(_outcome);}
var _queryPerformanceEntriesBuffer=[];function _queryPerformanceEntries(){var _entries=[];while((_queryPerformanceEntriesBuffer.length>0)&&(_entries.length<8)){var _event=_queryPerformanceEntriesBuffer.shift();try{_event=JSON.stringify(_event);_event=JSON.parse(_event);}catch(_error){console.log("[LCG][ee][be009ca3]",_event,_error);continue;}
_entries.push(_event);}
if(_entries.length==0)
return null;var _outcome={"$schema":"20190617a","entries":_entries,};return _outcome;}
if(_COLLECT_PERFORMANCE_ENTRIES_ENABLED){function _queryPerformanceEntriesHandle(_events){for(var _index in _events){var _event=_events[_index];try{_event=_event.toJSON();switch(_event.entryType){case "resource":if(_event.name.startsWith(_PUSH_URL+"/"))
_event=null;break;case "layout-shift":var _eventSources=[];for(var _index in _event.sources)
_eventSources.push({currentRect:_event.sources[_index].currentRect,previousRect:_event.sources[_index].previousRect,});_event.sources=_eventSources;break;}}catch(_error){console.log("[LCG][ee][b389872a]",_event,_error);_event=null;}
if(_event!==null)
_queryPerformanceEntriesBuffer.push(_event);}}
try{var _queryPerformanceEntriesObserver=new PerformanceObserver(function(_event){_queryPerformanceEntriesHandle(_event.getEntries());});var _queryPerformanceEntriesTypes=PerformanceObserver.supportedEntryTypes||["navigation","resource"];try{_queryPerformanceEntriesHandle(_queryPerformanceEntriesObserver.takeRecords());}catch(_error){console.log("[LCG][ee][be33d4f8]",_error);}
try{for(var _index in _queryPerformanceEntriesTypes)
_queryPerformanceEntriesObserver.observe({type:_queryPerformanceEntriesTypes[_index],buffered:true});}catch(_error){console.log("[LCG][ee][f5e0353f]",_error);try{_queryPerformanceEntriesObserver.observe({entryTypes:_queryPerformanceEntriesTypes});}catch(_error){console.log("[LCG][ee][d2a55550]",_error);}}}catch(_error){console.log("[LCG][ee][7972e482]",_error);}}
function _pushInitialized(){if(!_COLLECT_INITIALIZED_FULL){return(_push_0("initialized",null,true));}else{var _message={"context":_perhapsUndefined(_COLLECT_CONTEXT_ENABLED?_queryContext():null),"document":_perhapsUndefined(_COLLECT_DOCUMENT_ENABLED?_queryDocument():null),"device":_perhapsUndefined(_COLLECT_DEVICE_ENABLED?_queryDevice():null),"viewport":_perhapsUndefined(_COLLECT_VIEWPORT_ENABLED?_queryViewport():null),"performance":_perhapsUndefined(_COLLECT_PERFORMANCE_NAVIGATION_ENABLED?_queryPerformanceNavigation():null),};return(_push_0("initialized-full",_message,false));}}
function _pushBeacon(){return(_push_0("beacon",null));}
function _pushContext(){return(_push_0("query-context",_queryContext()));}
function _pushDocument(){return(_push_0("query-document",_queryDocument()));}
function _pushDevice(){return(_push_0("query-device",_queryDevice()));}
function _pushViewport(){return(_push_0("query-viewport",_queryViewport()));}
function _pushPerformanceNavigation(){return(_push_0("query-performance",_queryPerformanceNavigation()));}
function _pushPerformanceEntries(){while(true){var _message=_queryPerformanceEntries();if(_message==null)
return;_push_0("query-performance",_message);}}
function _pushEvent(_component,_action,_arguments){return(_pushEvent_0(_component,_action,_arguments));}
function _pushEvent_0(_component,_action,_arguments){return(_push_0("event",{"component":_perhapsUndefined(_component),"action":_perhapsUndefined(_action),"arguments":_perhapsUndefined(_arguments),}));}
function _injectDomA(){var _elements=document.getElementsByTagName("a");for(var _index=0;_index<_elements.length;_index+=1){var _element=_elements[_index];if(_element.dataset.lcgTrackInjected!=null)
continue;if((_element.id!=null)||(_element.href!=null)||(_element.name!=null)||(_element.title!=null))
if(_element.dataset.lcgTrack==null)
_injectA(_element);}}
function _injectA(_element){if(_DEBUG)
console.log("[LCG][dd][4d119f93]","injecting A",{tag:"a",id:_perhapsUndefined(_element.id),href:_perhapsUndefined(_element.href),name:_perhapsUndefined(_element.name),title:_perhapsUndefined(_element.title),});_element.addEventListener("click",function(_event){_pushEvent_0("__dom_a","click",{tag:"a",id:_perhapsUndefined(_element.id),href:_perhapsUndefined(_element.href),name:_perhapsUndefined(_element.name),title:_perhapsUndefined(_element.title),});});_element.dataset.lcgTrackInjected="true";}
function _injectDomData(){var _elements=document.getElementsByTagName("*");for(var _index=0;_index<_elements.length;_index+=1){var _element=_elements[_index];if(_element.dataset.lcgTrackInjected!=null)
continue;if(_element.dataset.lcgTrack!=null)
_injectData(_element);}}
function _injectData(_element){var _descriptor=_element.dataset.lcgTrack.split(" ");if(_descriptor.length==1){_descriptor=[_descriptor[0],"/click"];}else if(_descriptor.length!=2){console.log("[LCG][ee][84b2e619]","invalid element tracking descriptor",_descriptor,_element);return;}
var _component=_descriptor[0];var _action=_descriptor[1];var _arguments=_element.dataset.lcgTrackData;if(_arguments!=null)
try{_arguments=JSON.parse(_arguments);}catch(_error){console.log("[LCG][ee][5d800ea4]","invalid element tracking arguments",_arguments,_element,_error);_arguments=null;}
if((typeof(_component)!="string")||!_component.match(/^(\/[a-z0-9]+([_-]{1,2}[a-z0-9]+)*)+$/)){console.log("[LCG][ee][34d9190e]","invalid event component identifier",_component);return;}
if((typeof(_action)!="string")||!_action.match(/^(\/[a-z0-9]+([_-]{1,2}[a-z0-9]+)*)+$/)){console.log("[LCG][ee][d428460b]","invalid event action identifier",_action);return;}
if(_arguments==undefined)
_arguments=null;if((_arguments!==null)&&(typeof(_arguments)!="object")){console.log("[LCG][ee][3cdce654]","invalid event arguments",_arguments);return;}
if(_DEBUG)
console.log("[LCG][dd][302ecbfb]","injecting track",{component:_component,action:_action,arguments:_arguments,});_element.addEventListener("click",function(_event){_pushEvent(_component,_action,_arguments);});_element.dataset.lcgTrackInjected="true";}
function _collect(){if(_pushBeaconInterval!==null){clearInterval(_pushBeaconInterval);_pushBeaconInterval=null;}
if(_pushViewportInterval!==null){clearInterval(_pushViewportInterval);_pushViewportInterval=null;}
if(_pushPerformanceEntriesInterval!==null){clearInterval(_pushPerformanceEntriesInterval);_pushPerformanceEntriesInterval=null;_pushPerformanceEntries();}
_CONTEXT_TRANSACTION_RESET+=1;_CONTEXT_TRANSACTION_COUNTER=0;if(_CONTEXT_TRANSACTION_RESET>0){_COLLECT_PERFORMANCE_NAVIGATION_ENABLED=false;}
if(_COLLECT_INITIALIZED_ENABLED)
_pushInitialized();else if(_COLLECT_BEACON_ENABLED)
_pushBeacon();if(!_COLLECT_INITIALIZED_FULL){if(_COLLECT_CONTEXT_ENABLED)
_pushContext();if(_COLLECT_DOCUMENT_ENABLED)
_pushDocument();if(_COLLECT_DEVICE_ENABLED)
_pushDevice();if(_COLLECT_VIEWPORT_ENABLED)
_pushViewport();if(_COLLECT_PERFORMANCE_NAVIGATION_ENABLED)
_pushPerformanceNavigation();if(_COLLECT_PERFORMANCE_ENTRIES_ENABLED)
_pushPerformanceEntries();}
if((_COLLECT_BEACON_ENABLED)&&(_COLLECT_BEACON_INTERVAL>0)){_pushBeaconInterval=setInterval(_pushBeacon,_COLLECT_BEACON_INTERVAL);}
if((_COLLECT_VIEWPORT_ENABLED)&&(_COLLECT_VIEWPORT_INTERVAL>0)){_pushViewportInterval=setInterval(_pushViewport,_COLLECT_VIEWPORT_INTERVAL);}
if((_COLLECT_PERFORMANCE_ENTRIES_ENABLED)&&(_COLLECT_PERFORMANCE_ENTRIES_INTERVAL>0)){_pushPerformanceEntriesInterval=setInterval(_pushPerformanceEntries,_COLLECT_PERFORMANCE_ENTRIES_INTERVAL);}
if(_INJECT_A_ELEMENTS)
_injectDomA();if(_INJECT_DATA_ELEMENTS)
_injectDomData();}
var _pushBeaconInterval=null;var _pushViewportInterval=null;var _pushPerformanceEntriesInterval=null;function _push_0(_type,_message,_includeAll){var _transaction=_CONTEXT_TRANSACTION;if(_CONTEXT_TRANSACTION_RESET>=0){_transaction+="-"+_CONTEXT_TRANSACTION_RESET;}
_CONTEXT_TRANSACTION_COUNTER+=1;var _payload={"$schema":"20190617a","type":_type,"session":_CONTEXT_SESSION,"transaction":_transaction,"reset":_CONTEXT_TRANSACTION_RESET,"counter":_CONTEXT_TRANSACTION_COUNTER,"timestamp":Date.now(),"message":_message,};if(_PUSH_CONTEXT_INCLUDE||(_includeAll&&!_COLLECT_CONTEXT_ENABLED))
_payload["context"]=_queryContext();if(_PUSH_DOCUMENT_INCLUDE||(_includeAll&&!_COLLECT_DOCUMENT_ENABLED))
_payload["document"]=_queryDocument();if(_PUSH_VIEWPORT_INCLUDE||(_includeAll&&!_COLLECT_DEVICE_ENABLED))
_payload["viewport"]=_queryViewport();return(_pushPayload(_type,_CONTEXT_TRANSACTION_COUNTER,_payload));}
function _pushPayload(_type,_counter,_payload){var _session=_PUSH_SESSION;if(_DEBUG)
console.log("[LCG][dd][f0e23c63]","pushing",_type,_counter,_payload);_payload=_encodePayload(_payload);var _signature=_signPayload(_session,_payload);return(_sendPush(_session,_signature,_type,_counter,_payload));}
function _encodePayload(_payload){try{_payload=JSON.stringify(_payload);}catch(_error){console.log("[LCG][ee][6bd3813a]",_payload,_error);return;}
_payload.replace(/[\u007F-\uFFFF]/g,function(_character){var _code=_character.charCodeAt(0);return("\\u"+("0000"+_code.toString(16)).substr(-4));});_payload=btoa(_payload);while(true){var _oldPayload=_payload;_payload=_payload.replace('+','-');_payload=_payload.replace('/','_');_payload=_payload.replace('=','');if(_oldPayload==_payload)
break;}
return(_payload);}
function _signPayload(_session,_payload){return("-");}
function _sendPush(_session,_signature,_type,_counter,_payload){var _url=_PUSH_URL+"/"+_PUSH_SESSION+"/"+_signature+"/"+_payload;_delay(function(){var _request=new XMLHttpRequest();_request.onload=(function(_event){if((_request.status==200)||(_request.status==204)){if(_DEBUG)
console.log("[LCG][dd][0c1ba5c9]","pushed",_type,_counter);}else{console.log("[LCG][ee][7ac02341]",{"url":_url,"url_length":_url.length,"status":_request.status,"response":_request.response,});}});_request.open("GET",_url);_request.send();});}
function _delay(_action){setTimeout(_action,0);}
function _coalesce(){for(var _index in arguments){var _argument=arguments[_index];if(_argument!==undefined)
return(_argument);}
return(undefined);}
function _perhapsUndefined(_value){switch(_value){case undefined:case null:case "":return(undefined);default:return(_value);}}
window.LCG_TRACKING_PUSH=_pushEvent;window.LCG_TRACKING_LOCATION_CHANGED=function(_next,_previous){_delay(function(){if(_CONTEXT_LAST_document_location!=document.location.href){_CONTEXT_LAST_document_referrer=_CONTEXT_LAST_document_location;_CONTEXT_LAST_document_location=document.location.href;console.log("[LCG][dd][66bb19ab]  initiating reset...",{previous:_previous,next:_next});_collect();}else{if(_DEBUG)
console.log("[LCG][dd][3ffc67d4]  skipping reset...",{previous:_previous,next:_next});}});};_delay(_collect);if(_DEBUG)
console.log("[LCG][dd][3b3e6cd0]","initialized!");};window.LCG_TRACKING_BOOTSTRAP=function(){var _DEBUG=window.LCG_TRACKING_DEBUG;if(_DEBUG===undefined)_DEBUG=false;var _INITIALIZE_DELAY=window.LCG_TRACKING_INITIALIZE_DELAY;if(_INITIALIZE_DELAY===undefined)_INITIALIZE_DELAY=0;if((document.readyState=="complete")||(document.readyState=="interactive")){if(_DEBUG){console.log("[LCG][dd][e72124d2]","bootstrapping (initializing)...");}
if(_INITIALIZE_DELAY<=0){setTimeout(window.LCG_TRACKING_INITIALIZE,0);}else{setTimeout(window.LCG_TRACKING_INITIALIZE,_INITIALIZE_DELAY);}}else{if(_DEBUG){console.log("[LCG][dd][7920d8bd]","bootstrapping (waiting)...");}
document.addEventListener("DOMContentLoaded",window.LCG_TRACKING_BOOTSTRAP);}};if(window.LCG_TRACKING_SESSION!==undefined){setTimeout(window.LCG_TRACKING_BOOTSTRAP,0);}