#!/bin/bash
# usage: selftest.sh  -> prints slice2 selftest JSON (and console errors)
cd /tmp && timeout 90 google-chrome --headless=new --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --window-size=800,450 --virtual-time-budget=20000 --enable-logging=stderr --v=0 --dump-dom "http://localhost:8765/index.html?selftest&cb=$RANDOM" 2>/tmp/st_err.log | grep -o '<pre id="selftest".*</pre>' | sed 's/<[^>]*>//g' > /tmp/st.json
grep -i "console\|Uncaught" /tmp/st_err.log | grep -v "GPU stall\|WebGL" | head -5
python3 -c "import json; d=json.load(open('/tmp/st.json')); d.pop('trace'); print(json.dumps(d, indent=1))"
