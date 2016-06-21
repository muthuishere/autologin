


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



vAPI.getdomainName=function (str) {
	
	if(str.indexOf("http") != 0)
			return str
		
					var   a= document.createElement('a');
					 a.href = str;
					 var domain = a.hostname+(a.port ? ':'+a.port : '');
					return domain
	

}
