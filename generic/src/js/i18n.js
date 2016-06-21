

/* global vAPI, uDom */

/******************************************************************************/

// This file should always be included at the end of the `body` tag, so as
// to ensure all i18n targets are already loaded.

(function() {

'use strict';

/******************************************************************************/

// Helper to deal with the i18n'ing of HTML files.

uDom('[data-i18n]').forEach(function(elem) {
    elem.html(vAPI.i18n(elem.attr('data-i18n')));
});

uDom('[title]').forEach(function(elem) {
    var title = vAPI.i18n(elem.attr('title'));
    if ( title ) {
        elem.attr('title', title);
    }
});

uDom('[placeholder]').forEach(function(elem) {
    elem.attr('placeholder', vAPI.i18n(elem.attr('placeholder')));
});

uDom('[data-i18n-tip]').forEach(function(elem) {
    elem.attr(
        'data-tip',
        vAPI.i18n(elem.attr('data-i18n-tip')).replace(/<br>/g, '\n').replace(/\n{3,}/g, '\n\n')
    );
});

/******************************************************************************/

vAPI.i18n.renderElapsedTimeToString = function(tstamp) {
    var value = (Date.now() - tstamp) / 60000;
    if ( value < 2 ) {
        return vAPI.i18n('elapsedOneMinuteAgo');
    }
    if ( value < 60 ) {
        return vAPI.i18n('elapsedManyMinutesAgo').replace('{{value}}', Math.floor(value).toLocaleString());
    }
    value /= 60;
    if ( value < 2 ) {
        return vAPI.i18n('elapsedOneHourAgo');
    }
    if ( value < 24 ) {
        return vAPI.i18n('elapsedManyHoursAgo').replace('{{value}}', Math.floor(value).toLocaleString());
    }
    value /= 24;
    if ( value < 2 ) {
        return vAPI.i18n('elapsedOneDayAgo');
    }
    return vAPI.i18n('elapsedManyDaysAgo').replace('{{value}}', Math.floor(value).toLocaleString());
};

/******************************************************************************/

})();

/******************************************************************************/
