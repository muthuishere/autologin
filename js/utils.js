


/******************************************************************************/

vAPI.formatCount=function (count) {
	
	if ( typeof count !== 'number' ) {
        return '';
    }
    var s = count.toFixed(0);
    if ( count >= 1000 ) {
        if ( count < 10000 ) {
            s = '>' + s.slice(0,1) + 'k';
        } else if ( count < 100000 ) {
            s = s.slice(0,2) + 'k';
        } else if ( count < 1000000 ) {
            s = s.slice(0,3) + 'k';
        } else if ( count < 10000000 ) {
            s = s.slice(0,1) + 'M';
        } else {
            s = s.slice(0,-6) + 'M';
        }
    }
    return s;
	

}



vAPI.getdomainName = function (str) {
    if (!str.startsWith("http")) return str;

    try {
        // Use URL class (works in all contexts)
        const url = new URL(str);
        return url.hostname + (url.port ? `:${url.port}` : '');
    } catch (e) {
        console.warn("Invalid URL:", str);
        return str;
    }
};

