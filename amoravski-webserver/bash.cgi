#!/bin/bash

echo "content-type: text/plain"
echo ""
first=$(printenv first)
second=$(printenv second)
if [ -n "$first" ] && [ -n "$second" ]
then
    echo $(($first + $second))
fi
