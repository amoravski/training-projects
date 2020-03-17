from PIL import Image, ImageDraw
from hashlib import md5
import argparse

GS = 9
BS = 10
SS = 10

parser = argparse.ArgumentParser(description="String")
parser.add_argument("string")
args = parser.parse_args()
string = vars(args)["string"]
hashed = int(md5(string.encode('utf-8')).hexdigest(), 16)

w = h = BS * 2 + SS * GS

img = Image.new('RGB', (w,h), "white")
pixels = img.load()

color = (hashed & 0xff, hashed >> 8 & 0xff, hashed >> 16 & 0xff)

hashed >>= 24

square_x = square_y = 0

for x in range(GS * (GS+1) // 2):
    if hashed & 1:
        x = BS + square_x * SS
        y = BS + square_y * SS
        ImageDraw.Draw(img).rectangle(
            (x, y, x + SS, y + SS),
            fill=color,
            outline=color
        )
        x = BS + (GS - 1 - square_x) * SS
        ImageDraw.Draw(img).rectangle(
            (x, y, x + SS, y + SS),
            fill=color,
            outline=color
        )
    hashed >>= 1
    square_y += 1
    if square_y == GS:
        square_y = 0
        square_x +=1


img.save('{}.png'.format(string))
