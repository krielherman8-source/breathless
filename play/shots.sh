#!/bin/bash
# usage: shots.sh [sliceN] name1 name2 ...  -> /workspace/breathless/play/<slice>_<name>.png
# default slice prefix: slice2 (pass slice3 as first arg for craft shots)
# env: SIZE=1280,800 (window, default 1280,720), BUDGET=ms virtual time (slice 25 polish shots use SIZE=1280,800 BUDGET=2500)
PREFIX=slice2
if [[ "$1" == slice* ]]; then PREFIX="$1"; shift; fi
mkdir -p /workspace/breathless/play
for n in "$@"; do
  timeout 60 google-chrome --headless=new --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --hide-scrollbars --window-size=${SIZE:-1280,720} --virtual-time-budget=${BUDGET:-1500} --screenshot=/workspace/breathless/play/${PREFIX}_$n.png "http://localhost:8765/index.html?shot=$n&cb=$RANDOM$RANDOM$$" >/dev/null 2>&1
  echo "$n: $(stat -c %s /workspace/breathless/play/${PREFIX}_$n.png 2>/dev/null)"
done
