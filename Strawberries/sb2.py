import numpy
def calculate_healthy(infected,K, L, R, sb):
    new_infected = set()
    for s in sb:
        infected[s[0]][s[1]] = 1;
        neigh = get_neigh(K,L, infected, s)
        for ne in neigh:
            new_infected.add(ne)
    if R!=0:
        calculate_healthy(infected,K,L,R-1,new_infected)
    else:
        counter = 0;
        for _ in infected:
            for i in _:
                if i==0:
                    counter+=1
        print(counter)

def get_neigh(K,L, infected, s):
    if s[0]+1 < K and infected[s[0]+1][s[1]]!=1:
        yield (s[0]+1, s[1])
    if s[0]-1 >= 0 and infected[s[0]-1][s[1]]!=1:
        yield (s[0]-1, s[1])
    if s[1]+1 < L and infected[s[0]][s[1]+1]!=1:
        yield (s[0], s[1]+1)
    if s[1]-1 >= 0 and infected[s[0]][s[1]-1]!=1:
        yield (s[0], s[1]-1)

# Input stuff
try:
    rows = []
    row = input().split(' ')
    if len(row) != 3:
        raise ValueError
    rows.append( [int(row[0]), int(row[1]), int(row[2])] )
    above_limits = [x for x in rows if x[0] <= 0 or x[0] > 1000 or x[1] <= 0 or x[1] > 1000 or x[2] <= 0 or x[2] >= 100]
    if above_limits:
        raise ValueError
    K = rows[0][0]
    L = rows[0][1]
    R = rows[0][2]
except ValueError:
    print("Strawberry data improper!")
else:
    sb = set()
    tr=0
    execute = True
    while tr<2:
        tracker = input()
        if tracker == '':
            break
        else:
            try:
                rows = []
                row = tracker.split(' ')
                if len(row) != 2:
                    raise ValueError
                rows.append((int(row[0])-1, int(row[1])-1)) 
                above_limits = [x for x in rows if x[0] < 0 or x[0] > K-1 or x[1] < 0 or x[1] > L-1 ]
                if above_limits:
                    raise ValueError
            except ValueError:
                print("Strawberry data improper!")
                execute = False
                break
            else:
                sb.add(rows[0])
        tr+=1
    infected = numpy.zeros((K,L))
    if execute:
        calculate_healthy(infected, K, L, R, sb)

