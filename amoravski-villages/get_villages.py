import cgi
import postgre_villages

postgre_villages.get_villages(filter)

print("Content-Type: text/plain;charset=utf-8")
print()
print("Hello World!")
