#!/bin/bash
counter=1
limit=10000
while [ $counter -le $limit ]
do
    python3 gen.py $counter
    ((counter ++))
done
