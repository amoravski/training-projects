import itertools
import numpy
import math

def traverse(u, visited, graph):
    visited[u] = True
    for v in range(N):
        if graph[u][v]!=0:
            if not visited[v]:
                traverse(v, visited, graph)

def isConnected(N, graph):
    vis = numpy.zeros(N);
    for u in range(N):
        for i in range(N):
            vis[i] = False
            traverse(u, vis, graph)
            print(vis)
        for i in range(N):
            if not vis[i]:
                print(vis)
                print("ending")
                return False
    return True


def calculate_min_max_speed(N, roads):
    roads_sorted = sorted(roads, key= lambda tup: tup[0])
    min_difference=0
    while(True):
        for index, road in enumerate(roads):
            roads_filtered = [ sorted([new_road[1], new_road[2]]) for new_road in roads if new_road[0] >= road[0] and new_road[0]-road[0]<=min_difference]
            graph=numpy.zeros((N,N))
            for n in range(N):
                graph[n][n]=1
            for filtered_road in roads_filtered:
                graph[filtered_road[0]-1][filtered_road[1]-1]=1
                graph[filtered_road[1]-1][filtered_road[0]-1]=1
            if isConnected(N,graph):
                print(min_difference)
                return (road[0], road[0]+min_difference)
        min_difference+=1

try:
    rows = []
    row = input().split(' ')
    if len(row) != 2:
        raise ValueError
    rows.append( [int(row[0]), int(row[1])] )
    above_limits = [x for x in rows if x[0] <= 0 or x[0] > 10000 or x[1] <= 1 or x[1] > 1000]
    if above_limits:
        raise ValueError
    N = rows[0][0]
    M = rows[0][1]
except ValueError:
    print("Data improper!")
else:
    tr=0
    roads = []
    execute = True
    while tr<M:
        tracker = input()
        try:
            rows = []
            row = tracker.split(' ')
            if len(row) != 3:
                raise ValueError
            rows.append((int(row[2]), int(row[0]), int(row[1]))) 
            above_limits = [x for x in rows if x[0] <= 0 or x[0] > 30000 or x[1] < 0 or x[1] > N or x[2] < 0 or x[2] > N]
            if above_limits:
                raise ValueError
        except ValueError:
            print("Road data improper!")
            execute = False
            break
        else:
            roads.append(rows[0])
            tr+=1

    if execute:
        print(calculate_min_max_speed(N, roads))
