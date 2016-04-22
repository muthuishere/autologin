#!/bin/bash
#
# This script assumes a linux environment

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
BASE_DIR="$(dirname "$SCRIPTPATH")"

cd $BASE_DIR

if (( $# < 1 )); then
	echo "Invalid arguments , Usage: make-firefox.sh (mock|dev|qa|prod) [debug|hosted|store]" >&2
    exit 1
fi

ENV=$1

#default build type store 

BUILDTYPE="store"

if (( $# > 1 )); then
	BUILDTYPE=$2	
fi

#Change Firefox extension directory based on FF INSTALLATION
#DEBUG_DIR="/Users/kyle/Library/Application Support/Firefox/Profiles/80crapca.autologin-ffprofile/extensions" #(kyle)
DEBUG_DIR="/autologin-ffprofile/extensions" #(muthu windows)
#DEBUG_DIR="/Users/muthuishere/Library/Application Support/Firefox/Profiles/k4st2c9v.default/extensions" #(muthu mac)

# os x launch command
# /Applications/Firefox.app/Contents/MacOS/firefox-bin -P -no-remote -jsconsole

#extensions ID , Ensure the installation is already installed and extract xpi and place it on same folder
EXTN_ID="jid1-uu3gdWEcFsp4Eg-$ENV@jetpack"

if [ "$ENV" = "mock" ] || [ "$ENV" = "dev" ] ||  [ "$ENV" = "qa" ] ||  [ "$ENV" = "prod" ]; then
	echo ""
else
	echo "Invalid arguments , Usage: make-firefox.sh (mock|dev|qa|prod) [debug|hosted|store]" >&2
	exit 1
fi
		
echo "*** autologin.firefox: Copying files"
DES=dist/build/autologin.firefox
rm -rf $DES
mkdir -p $DES

cp -R src/css $DES/
cp -R src/img $DES/
cp -R src/js $DES/
cp -R src/lib $DES/
cp -R src/_locales $DES/
cp src/*.html $DES/

cp src/autologin/env/env.json $DES/
cp -R src/autologin/js/* $DES/js/
cat src/autologin/env/conf-$ENV.js >> $DES/js/autologin-conf.js
cp platform/firefox/autologin/*.js $DES/js/

mv $DES/img/icon_128.png $DES/icon.png
cp platform/firefox/vapi-*.js $DES/js/
cp platform/firefox/bootstrap.js $DES/
cp platform/firefox/frame*.js $DES/
cp -R platform/firefox/img $DES/
cp -R platform/firefox/css $DES/
cp platform/firefox/chrome.manifest $DES/
cp platform/firefox/install.rdf $DES/
cp platform/firefox/*.xul $DES/

echo "*** autologin.firefox: Generating meta..."

UPDATEURL=""
if [ "$BUILDTYPE" == "hosted" ]; then
	#TODO Update url here 
	if [ "$1" == "mock" ]; then
		UPDATEURL="https://localhost/update.php?env=$ENV"
	fi
	if [ "$1" == "dev" ]; then
		UPDATEURL="https://d3je29yutkjxpq.cloudfront.net/autologin-dev.xpi"
	fi
	if [ "$1" == "qa" ]; then
		UPDATEURL="https://d20hujj0w6qwly.cloudfront.net/autologin-qa.xpi"
	fi
	if [ "$1" == "prod" ]; then
		UPDATEURL="https://dk3wu32ros038.cloudfront.net/autologin.xpi"
	fi
	#Firefox to use accept self signed certificates for update set extensions.update.requireBuiltInCerts to false
fi

echo "Update URL: $UPDATEURL"
python tools/make-firefox-meta.py $DES/ $ENV $UPDATEURL
rm $DES/env.json

if [ "$2" != "debug" ]; then

	# iterate through background script files in html head block
	echo "*** combining background scripts..."
	echo 'cat /html/head/script/@src' | xmllint --shell $DES/background.html | grep "src" | awk -F\" '{print $(NF-1)}' | while read backgroundScript;
	do
		# combine the script file to a single background file
		cat $DES/$backgroundScript >> $DES/background-all.js
	done

	# minify and obfuscate background script
	echo "*** minifying and obfuscating background scripts..."
#	java -jar tools/yuicompressor-2.4.8.jar $DES/background-all.js -o $DES/background-min.js
	java -jar tools/closure-compiler.jar --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/background-all.js --js_output_file $DES/background-min.js
	rm $DES/background-all.js

	# update background.html to include only background-min.js
	echo "*** updating background.html to use minified background script..."
	inHead="no";
	cat $DES/background.html | while read backgroundLine;
	do
		if [[ $backgroundLine == *\<head\>* ]]
		then
			# found beginning of head block
			inHead="yes";
			# output updated head block to file
			echo '<head><script type="text/javascript" src="background-min.js"></script></head>' >> $DES/newbackground.html;
		else
			if [[ $backgroundLine == *\<\/head\>* ]]
			then
				# found end of head block
				inHead="no";
			else
				# see if we are in the head block
				if [[ $inHead == "no" ]]
				then
					# not in head block, output the line as-is to file
					echo $backgroundLine >> $DES/newbackground.html;
				fi
			fi
		fi
	done
	mv $DES/newbackground.html $DES/background.html

	# minify and obfuscate content scripts (individually)
	echo "*** minifying and obfuscating content scripts..."
	java -jar tools/closure-compiler.jar --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/bootstrap.js --js_output_file $DES/bootstrap-min.js
	rm $DES/bootstrap.js
	mv $DES/bootstrap-min.js $DES/bootstrap.js

	java -jar tools/closure-compiler.jar --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/frameModule.js --js_output_file $DES/frameModule-min.js
	rm $DES/frameModule.js
	mv $DES/frameModule-min.js $DES/frameModule.js

	java -jar tools/closure-compiler.jar --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/frameScript.js --js_output_file $DES/frameScript-min.js
	rm $DES/frameScript.js
	mv $DES/frameScript-min.js $DES/frameScript.js

	mkdir $DES/jsmin
	for CONTENTSCRIPT in vapi-client.js contentscript-start.js autologin-utils.js autologin-conf.js autologin-client.js contentscript-end.js autologin-content.js subscriber.js element-picker.js
	do
		java -jar tools/closure-compiler.jar --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/js/$CONTENTSCRIPT --js_output_file $DES/jsmin/$CONTENTSCRIPT
	done

	# we do not need dashboard, devtools, etc (at least for now...)
	echo "*** cleaning up unnecessary files"
	mkdir $DES/keephtml
	mv $DES/background.html $DES/keephtml/
	mv $DES/epicker.html $DES/keephtml/
	rm $DES/*.html
	mv $DES/keephtml/*.html $DES/
	rmdir $DES/keephtml
	rm -R $DES/js $DES/lib $DES/css
	mv $DES/jsmin $DES/js

    echo "*** autologin.firefox: Creating package..."
    pushd $DES/
    zip ../autologin.firefox.xpi -qr *
    popd

else

    echo "*** autologin.firefox: Placing build to debug folder..."

    	# ensure the directory exists
		if [ ! -d "$DEBUG_DIR/$EXTN_ID" ]; then
			echo "Invalid arguments. If debug is specified, ensure variables DEBUG_DIR, EXTN_ID are correctly defined." >&2
			echo "	DEBUG_DIR => Should point to firefox profile extensions folder." >&2
			exit 1
		fi

	echo "*** Ensure extension is already installed and firefox is closed $DEBUG_DIR/$EXTN_ID "
	rm -rf "$DEBUG_DIR/$EXTN_ID"
	 echo "*** removed files"
    cp -R "$DES" "$DEBUG_DIR/$EXTN_ID/"
fi

echo "*** autologin.firefox: Package done."
