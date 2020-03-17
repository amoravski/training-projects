#!/bin/bash

counter=1
limit=10000
while [ $counter -le $limit ]
do
    curl -X POST "http://localhost:3000/product" -F "name=\"${counter}\"" -F "quantity=$counter" -F "added_by=1" -F "price=$counter" -F "created_at=1583160772" -F 'tags=["Ninja","Sinzddza","Gdadwzaa"]' -F "file=@$counter.png"
    ((counter ++))
done
