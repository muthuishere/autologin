#!/bin/bash
#
# This script assumes an OS X or *NIX environment

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
BASE_DIR="$(dirname "$SCRIPTPATH")"
cd $BASE_DIR

if (( $# < 1 )); then
	echo "Invalid arguments , Usage: make-safari.sh (dev|qa|prod) [debug]" >&2
    exit 1
fi

ENV=$1

if [ "$ENV" = "mock" ] || [ "$ENV" = "dev" ] ||  [ "$ENV" = "qa" ] ||  [ "$ENV" = "prod" ]; then
	echo ""
else
	echo "Invalid arguments , Usage: make-safari.sh (mock|dev|qa|prod) [debug]" >&2
	exit 1
fi

echo "*** autologin.safariextension: Copying files..."
DES=dist/build/autologin.safariextension
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
cp platform/safari/autologin/*.js $DES/js/

mv $DES/img/icon_128.png $DES/Icon.png
cp platform/safari/*.js $DES/js/
cp -R platform/safari/img $DES/
cp platform/safari/Info.plist $DES/
cp platform/safari/Settings.plist $DES/

echo >> $DES/js/autologin-platform.js
cat $DES/js/cookies.min.js >> $DES/js/autologin-platform.js
echo  >> $DES/js/autologin-platform.js
echo  >> $DES/js/autologin-platform.js
echo  >> $DES/js/autologin-platform.js
cat $DES/js/fingerprint.min.js >> $DES/js/autologin-platform.js

rm $DES/js/cookies.min.js
rm $DES/js/fingerprint.min.js

echo "*** autologin.safariextension: Generating Info.plist..."
python tools/make-safari-meta.py $DES/ $ENV
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

	# iterate through start content script files in Info.plist
	echo "*** minifying and obfuscating start content scripts..."
	mkdir -p $DES/contentScripts/js
	xmllint --xpath "/plist/dict/key[text()='Content']/following-sibling::dict/key[text()='Scripts']/following-sibling::dict/key[text()='Start']/following-sibling::array[1]" $DES/Info.plist | grep -e "<string>.*<\/string>" | sed -e 's/<[^>]*>//g' | tr -d '[:blank:]' | while read startContentScript;
	do
		# minify and obfuscate
		java -jar tools/closure-compiler.jar --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/$startContentScript --js_output_file $DES/contentScripts/$startContentScript
	done

	# iterate through end content script files in Info.plist
	echo "*** minifying and obfuscating end content scripts..."
	xmllint --xpath "/plist/dict/key[text()='Content']/following-sibling::dict/key[text()='Scripts']/following-sibling::dict/key[text()='End']/following-sibling::array[1]" $DES/Info.plist | grep -e "<string>.*<\/string>" | sed -e 's/<[^>]*>//g' | tr -d '[:blank:]' | while read endContentScript;
	do
		# minify and obfuscate
		java -jar tools/closure-compiler.jar --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/$endContentScript --js_output_file $DES/contentScripts/$endContentScript
	done

	# some script files are injected at runtime
	mkdir $DES/jsmin
	for CONTENTSCRIPT in element-picker.js
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

	# rename content scripts back to original
	mv $DES/contentScripts/* $DES
	rm -R $DES/contentScripts
	cp $DES/jsmin/* $DES/js/
	rm -R $DES/jsmin

    echo "*** Use Safari's Extension Builder to create the signed autologin extension package -- can't automate it."
fi

echo "*** autologin.safariextension: Done."
