import math
import functools

def paint(line, index1, index2):
    for i in range(index1, index2+1):
        line[i]=1;

def calc_painted(n, a, b, c):
    linea = [0 for _ in range(n)]
    lineb = [0 for _ in range(n)]
    line_to_color = [0 for _ in range(n)]
    for index, _ in enumerate(linea):
        if index % a == 0:
            linea[index]=1
        if (n-index-1) % b == 0:
            lineb[index]=2
    print(linea);
    print(lineb);

    for index, value in enumerate(linea):
        if value != 0:
            if(index - c >= 0):
                if(lineb[index-c]!=0):
                    paint(line_to_color,index-c,index)
            if(index + c <= n-1):
                if(lineb[index+c]!=0):
                    paint(line_to_color,index,index+c)
    print(line_to_color)
    uncolored_meters = 0
    for index, value in enumerate(line_to_color):
        if index == len(line_to_color)-1:
            break
        if value==0:
            uncolored_meters+=1;
        if value==1 and line_to_color[index+1]==0:
            uncolored_meters+=1;

    return uncolored_meters


try:
    values = []
    values_raw = input().split(' ')
    if len(values_raw) != 4:
        raise ValueError
    values.append(int(values_raw[0]))
    values.append(int(values_raw[1]))
    values.append(int(values_raw[2]))
    values.append(int(values_raw[3]))
    above_limits = [x for x in values if x <= 0 or x>10000]
    if above_limits:
        raise ValueError
except ValueError:
    print("Data improper!")
else:
        print(calc_painted(values[0]+1,values[1],values[2],values[3]))

