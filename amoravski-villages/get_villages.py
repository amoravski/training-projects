#!/usr/bin/env python3
import cgi
import json
import postgre_villages

fs = cgi.FieldStorage()
if 'filter' in fs:
    result = postgre_villages.get_villages(fs['filter'].value + '%' )
else:
    result = postgre_villages.get_villages("%")

final_dict = dict()
for index, result_str in enumerate(result):
    temp_dict = dict()
    result_str = result_str[1:-1].split(',')
    temp_dict['name'] = postgre_villages.sanitize_string(result_str[0])
    temp_dict['obstina'] = postgre_villages.sanitize_string(result_str[1])
    temp_dict['oblast'] = postgre_villages.sanitize_string(result_str[2])
    final_dict['{}'.format(index)] = temp_dict

print("Content-Type: application/json;charset=utf-8")
print("Access-Control-Allow-Origin: *")
print()
print(json.dumps(final_dict))
