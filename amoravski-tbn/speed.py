import itertools
import numpy
import math
import copy

def calculate_min_max_speed(N, roads):
    # make adjecency matrix
    adj = numpy.zeros((int(N),int(N)))
    for road in roads:
        adj[road[1]-1,road[2]-1] += 1
        adj[road[2]-1,road[1]-1] += 1
    #print(adj)
    paths_all = []
    for i in range(1,N):
        paths = []
        printAllPathsUtil(adj,0,i,[False]*N, [], paths)
        paths_all.append(paths)
    #print(paths_all)
    path_speeds_all = []
    for paths in paths_all:
        path_speeds_path = []
        for path in paths:
            path_speeds = []
            for index in range(len(path)-1):
                path_s = -1
                for road in roads:
                    if (road[1]-1==path[index] and road[2]-1==path[index+1]) or (road[2]-1==path[index] and road[1]-1==path[index+1]):
                        path_s=road[0]
                path_speeds.append(path_s)
            path_speeds_path.append(copy.deepcopy(path_speeds))
        path_speeds_all.append(copy.deepcopy(path_speeds_path))
    # We have all paths from 1 to other nodes, uniquely identifying speeds
    #print(path_speeds_all)
    min_max_speed(path_speeds_all)

def min_max_speed(path_speeds):
    possibilities = []
    for paths in path_speeds:
        p = []
        for path in paths:
            s_min=path[0]
            s_max=path[0]
            for speed in path:
                if s_min >= speed:
                    s_min = speed
                if s_max <= speed:
                    s_max = speed
            p.append([s_min,s_max])
        possibilities.append(p)
    #print(possibilities)
    difference = 0
    flag = False
    min_speed = possibilities[0][0][0]
    min_speed = possibilities[0][0][1]
    # contains
    for speeds in possibilities:
        for index, speed in enumerate(speeds):
            for index1, speed1 in enumerate(speeds):
                if speed[0]>=speed1[0] and speed[1]<=speed1[1] and (speed[1]-speed[0] < speed1[1]-speed1[0]):
                    del speeds[index1]
    #print(possibilities)
    global_min = -1
    global_max = 0
    for speeds in possibilities:
        for speed in speeds:
            if global_min > speed[0] or global_min == -1:
                global_min = speed[0]
            if global_max < speed[1]:
                global_max = speed[1]
    global_diff = global_max - global_min
    for diff in range(global_diff):
        for i in range(global_min, global_max - diff+1):
            global_flag = False
            flag = 0
            for speeds in possibilities:
                for speed in speeds:
                    if speed[0]>=i and speed[1]<=i+diff:
                        flag+=1
                        break
            if flag == len(possibilities):
                print((i,i+diff))
                return


def printAllPathsUtil(adj, u, d, visited, path, paths): 
  
        visited[u]= True
        path.append(u) 
  
        if u == d: 
            paths.append(copy.deepcopy(path))
        else: 
            for i, connected in enumerate(adj[u]): 
                if connected >= 1:
                    if visited[i]== False: 
                        printAllPathsUtil(adj, i, d, visited, path, paths) 
                      
        path.pop() 
        visited[u]= False
        
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
        calculate_min_max_speed(N, roads)
