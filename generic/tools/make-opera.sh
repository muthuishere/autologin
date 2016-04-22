#!/bin/bash
#
# This script assumes a linux environment



SCRIPT=$(readlink -f "$0")

SCRIPTPATH=$(dirname "$SCRIPT")

BASE_DIR="$(dirname "$SCRIPTPATH")"

cd $BASE_DIR



if (( $# < 1 )); then
	echo "Invalid arguments , Usage: make-opera.sh (local|dev|qa|prod)  all" >&2
    exit 1
fi

ENV=$1

#echo $ENV

if [ "$ENV" = "mock" ] || [ "$ENV" = "dev" ] ||  [ "$ENV" = "qa" ] ||  [ "$ENV" = "prod" ]; then
	echo ""
else
	echo "Invalid arguments , Usage: make-opera.sh (mock|dev|qa|prod)  all" >&2
	exit 1
fi

echo "*** autologin.opera: Copying files"



DES=dist/build/autologin.opera
rm -rf $DES
mkdir -p $DES

# cp -R assets $DES/
# rm $DES/assets/*.sh
cp -R src/css $DES/
cp -R src/img $DES/
cp -R src/js $DES/
cp -R src/lib $DES/

cp src/autologin/env/env.json $DES/
cp -R src/autologin/js/* $DES/js/
cat src/autologin/env/conf-$ENV.js >> $DES/js/autologin-conf.js
cp platform/chromium/autologin/*.js $DES/js/

cp -R src/_locales $DES/
cp -R $DES/_locales/nb $DES/_locales/no
cp src/*.html $DES/
cp platform/chromium/*.js $DES/js/

cp -R platform/chromium/img $DES/
cp platform/chromium/*.html $DES/



echo "*** autologin.opera: Generating meta..."
python tools/make-chromium-meta.py $DES/ $ENV
#cp platform/opera/manifest.json $DES/

#cp platform/chromium/manifest.json $DES/
# cp LICENSE.txt $DES/

rm $DES/env.json

if [ "$2" = all ]; then
    echo "*** autologin.opera: Creating package..."
    pushd $(dirname $DES/)
    zip autologin.opera.zip -qr $(basename $DES/)/*
    popd
fi

echo "*** autologin.opera: Package done."
		
		
		
	