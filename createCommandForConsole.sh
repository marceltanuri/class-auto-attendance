#!/usr/bin/env bash

while getopts ":h:u:t:p:" opt; do
  case $opt in
    h) api_url="$OPTARG"
    ;;
    u) user="$OPTARG"
    ;;
    t) turmaId="$OPTARG"
    ;;
    p) teachers="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    exit 1
    ;;
  esac

  case $OPTARG in
    -*) echo "Option $opt needs a valid argument"
    exit 1
    ;;
  esac
done

stty -echo
printf "API password: "
read pass
stty echo
printf "\n"

SCRIPTPATH=$(dirname "$SCRIPT")
echo $SCRIPTPATH

cd $SCRIPTPATH
gulp runWebpack
cd -

cp ${SCRIPTPATH}/dist/js/main.js ${SCRIPTPATH}/dist/js/commandForConsole.js

echo "await new _ClassAutoAttendance.App().run('${api_url}', '${user}', '${pass}', '${turmaId}', [${teachers}])" >> ${SCRIPTPATH}/dist/js/commandForConsole.js

xclip -selection clipboard ${SCRIPTPATH}/dist/js/commandForConsole.js
rm -rf ${SCRIPTPATH}/dist/js/commandForConsole.js




