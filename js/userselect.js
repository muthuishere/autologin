if (undefined == userselect) {

	var userselect = {
		disableIconURL: "",
		enableIconURL: "",
		hoverIconURL: "",
		backgroundIconURL: "",
		callback: null,
		startCapture: false,
		init: function(appextnid, sites, callback) {
			// TODO: Explain these comments better
				userselect.callback = callback
				userselect.sites = sites
				userselect.enableIconURL = appextnid + "images/selectuser.png"

				// if form has one password field and one text field and both elements are visible
				// call the autologin function to show

				// Set lostfocus for all elements
				// Set key press events for all input elements
					// If keypress event is enter, save all values
						// xpath & value
						// elem
							// xpath
							// value
							// event

				var divelem = document.createElement("div");
				var selectstr = "<select id='selectautologinuser'>"

				for (k = 0; k < sites.length; k++) {
					selectstr += "<option value='" + k + "'>" + sites[k].user + "</option>"
				}
				selectstr += "</select>"

				var myString = '<div style="position:fixed;z-index:1000;border:2px solid;border-radius:25px;border-color:#000;background-color: #A2BCD0;right:0px;top:50px;height:155px;width:340px;font-family: Calibri, Verdana, sans-serif">   <table id="" style="width:100%" > <tbody> <tr><td rowspan="4"><img src="' + vAPI.getURL("/images/autologin-128.png") + '" title="AutoLogin"/></td></tr> <tr> <th style="font-size:12px;color:black;font-face:Verdana"> Select User:</th></tr><tr> <th> ' + selectstr + ' </th> </tr><tr>   <th colspan="2">  <input type="button" value="go" id="autologinselectuserbtn">  </th>   </tr> </tbody> </table> </div>'

				divelem.innerHTML = myString

				document.body.appendChild(divelem);
				document.querySelector("input#autologinselectuserbtn").addEventListener('click', userselect.onselectuser, false);
		},
		onselectuser: function(event) {
				var val = document.querySelector("select#selectautologinuser").value
				userselect.callback(userselect.sites[val])
		},
	}
}
