#!/usr/bin/env python3
import cgi
import json
import postgre_villages

final_dict = dict()
statistics = postgre_villages.get_statistics(['villages', 'municipality', 'region'])
for stat in statistics:
    final_dict[stat[0]] = stat[1]
print("Content-Type: application/json;charset=utf-8")
print("Access-Control-Allow-Origin: *")
print()
print(json.dumps(final_dict))
