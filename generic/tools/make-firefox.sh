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
DEBUG_DIR="/autologin-ffprofile/extensions" #(muthu windows)


# os x launch command


#extensions ID , Ensure the installation is already installed and extract xpi and place it on same folder
EXTN_ID="autologin-uu3gdWEcFsp4Eg-$ENV@jetpack"
#EXTN_ID="{{F477FD06-0A2A-11E6-9501-81EE76E92AEE}}"

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
cp -R src/images $DES/
cp -R src/js $DES/
cp -R src/_locales $DES/
cp src/*.html $DES/

cp src/autologin/env/env.json $DES/
cp -R src/autologin/js/* $DES/js/
cp -R src/images $DES/
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


echo "Update URL: $UPDATEURL"
python tools/make-firefox-meta.py $DES/ $ENV $UPDATEURL
rm $DES/env.json

if [ "$2" != "debug" ]; then

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
