import copy
import functools as ft

def min_capacity(N, K):
    N = sorted(N, reverse=True)
    capacity = max(N)
    while capacity<ft.reduce(lambda a,b:a+b, N):
        cur_cap = 0
        copyN = copy.deepcopy(N)
        for _ in range(K):
            for i in range(len(copyN)):
                els = [(i,s) for i,s in enumerate(copyN) if s + cur_cap <= capacity]
                if els == []:
                    break
                index = els[0][0]
                size = els[0][1]
                cur_cap += size
                del copyN[index]
            cur_cap = 0
        if not copyN:
            break
        capacity += 1
    return capacity
first_row = input().split(' ')
second_row = input().split(' ')
try:
    size = int(first_row[0])
    trips = int(first_row[1])
    sheep = list(map(int, second_row))
except ValueError:
    print("Input not valid type, must be int")
else:
    above_limit = [x for x in sheep if x>100000 or x<1]
    if size < 1 or size > 1000:
        print("N not in bounds")
    elif trips < 1 or trips > 1000:
        print("K not in bounds")
    elif len(sheep) != size:
        print("Array size doesn't match")
    elif above_limit:
        print("Kozi sizes not in bounds")
    else:
        print(min_capacity(sheep,trips))
