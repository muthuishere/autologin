#!/bin/bash
#
# This script assumes a linux environment

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
BASE_DIR="$(dirname "$SCRIPTPATH")"

cd $BASE_DIR

if (( $# < 1 )); then
	echo "Invalid arguments , Usage: make-chromium.sh (local|dev|qa|prod) [debug]" >&2
    exit 1
fi

ENV=$1

if [ "$ENV" = "mock" ] || [ "$ENV" = "dev" ] ||  [ "$ENV" = "qa" ] ||  [ "$ENV" = "prod" ]; then
	echo ""
else
	echo "Invalid arguments , Usage: make-chromium.sh (mock|dev|qa|prod) [debug]" >&2
	exit 1
fi

echo "*** autologin.chromium: Copying files"
DES=dist/build/autologin.chromium
rm -rf $DES
mkdir -p $DES


cp -R src/css $DES/
cp -R src/img $DES/
cp -R src/images $DES/
cp -R src/js $DES/
cp -R src/lib $DES/
cp -R src/js $DES/


cp src/autologin/env/env.json $DES/
cp -R src/autologin/js/* $DES/js/
cp -R src/autologin/html/* $DES/

cat src/autologin/env/conf-$ENV.js >> $DES/js/autologin-conf.js
#cp platform/chromium/autologin/*.js $DES/js/

cp -R src/_locales $DES/
cp -R $DES/_locales/nb $DES/_locales/no
cp src/*.html $DES/
cp platform/chromium/*.js $DES/js/

cp -R platform/chromium/img $DES/

cp platform/chromium/*.html $DES/

echo "*** autologin.chromium: Generating meta..."
python tools/make-chromium-meta.py $DES/ $ENV

rm $DES/env.json

if [ "$2" != "debug" ]; then

	# # iterate through background script files in html head block
	# echo "*** combining background scripts..."
	# echo 'cat /html/head/script/@src' | xmllint --shell $DES/background.html | grep "src" | awk -F\" '{print $(NF-1)}' | while read backgroundScript;
	# do
		# # combine the script file to a single background file
		# cat $DES/$backgroundScript >> $DES/background-all.js
	# done

	# # minify and obfuscate background script
	# echo "*** minifying and obfuscating background scripts..."
	# java -jar tools/closure-compiler.jar --charset 'utf-8' --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/background-all.js --js_output_file $DES/background-min.js
	# rm $DES/background-all.js

	# # update background.html to include only background-min.js
	# echo "*** updating background.html to use minified background script..."
	# inHead="no";
	# cat $DES/background.html | while read backgroundLine;
	# do
		# if [[ $backgroundLine == *\<head\>* ]]
		# then
			# # found beginning of head block
			# inHead="yes";
			# # output updated head block to file
			# echo '<head><script type="text/javascript" src="background-min.js"></script></head>' >> $DES/newbackground.html;
		# else
			# if [[ $backgroundLine == *\<\/head\>* ]]
			# then
				# # found end of head block
				# inHead="no";
			# else
				# # see if we are in the head block
				# if [[ $inHead == "no" ]]
				# then
					# # not in head block, output the line as-is to file
					# echo $backgroundLine >> $DES/newbackground.html;
				# fi
			# fi
		# fi
	# done
	# mv $DES/newbackground.html $DES/background.html

	# # go through each content script section
	# echo "*** minifying and obfuscating content scripts..."
	# mkdir -p $DES/jsmin/js
	# SCRIPTLENGTH=`cat $DES/manifest.json | jsawk 'return this.content_scripts.length'`
	# let SCRIPTLENGTH-=1
	# for SCRIPTINDEX in 0 $SCRIPTLENGTH
	# do

		# # go through each content script
		# cat $DES/manifest.json | jsawk 'return this.content_scripts['$SCRIPTINDEX'].js.join(",")' | tr ',' '\n' | while read contentScript;
		# do
			# # minify and obfuscate
			# java -jar tools/closure-compiler.jar --charset 'utf-8' --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/$contentScript --js_output_file $DES/jsmin/$contentScript
		# done

	# done

	# # special case for scripts injected at runtime
	# for CONTENTSCRIPT in element-picker.js
	# do
		# java -jar tools/closure-compiler.jar --warning_level=QUIET --language_in=ECMASCRIPT6_STRICT --language_out=ECMASCRIPT5_STRICT --js $DES/js/$CONTENTSCRIPT --js_output_file $DES/jsmin/js/$CONTENTSCRIPT
	# done

	# # we do not need dashboard, devtools, etc (at least for now...)
	# echo "*** cleaning up unnecessary files"
	# mkdir $DES/keephtml
	# mv $DES/background.html $DES/keephtml/
	# mv $DES/epicker.html $DES/keephtml/
	# rm $DES/*.html
	# mv $DES/keephtml/*.html $DES/
	# rmdir $DES/keephtml
	# rm -R $DES/js $DES/lib $DES/css

	# # rename content scripts back to original
	# mv $DES/jsmin/* $DES
	# rm -R $DES/jsmin

    echo "*** autologin.chromium: Creating package..."
    pushd $(dirname $DES/)
    zip autologin.chromium.zip -qr $(basename $DES/)/*
    popd

fi

echo "*** autologin.chromium: Package done."
		