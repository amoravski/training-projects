import math
from collections import defaultdict
from collections import deque

def bfs(graph, vertex,size):
    queue = deque([vertex])
    level = {vertex: 0}
    parent = {vertex: None}
    while queue:
        v = queue.popleft()
        for n in graph[v]:
            if n not in level:            
                queue.append(n)
                level[n] = level[v]+1
                parent[n] = v
    if str(size) in parent:
        print(level[str(size)])
    else:
        print(-1)

def calc_least_edges(rows,size):
    graph = defaultdict(list)
    nodes = []
    for i, c1 in enumerate(rows):
        for j, c2 in enumerate(rows):
            if i==j or i>j:
                continue
            else:
                distance = dist([c1[0],c1[1]],[c2[0],c2[1]])
                if distance > abs(c1[2] - c2[2]) and distance < c1[2] + c2[2]:
                    graph[str(i+1)].append(str(j+1))
    bfs(graph, '1',size)


def dist(p1,p2):
    return math.sqrt(pow(p1[0]-p2[0],2) + pow(p1[1]-p2[1],2))

size_raw = input()
try:
    size = int(size_raw)
    if size < 2 or size > 1000:
        print("N not in bounds")
        raise ValueError
except ValueError:
    print("Size input not valid")
else:
    rows = []
    try:
        for _ in range(size):
            row = input().split(' ')
            if len(row) != 3:
                raise ValueError
            rows.append( [int(row[0]), int(row[1]), int(row[2])] )
        above_limits = [x for x in rows if x[0] <= -10000 or x[0] >= 10000 or x[1] <= -10000 or x[1] >= 10000 or x[2] <= 0 or x[2] >= 10000]
        if above_limits:
            raise ValueError
    except ValueError:
        print("Circle data improper!")
    else:
        calc_least_edges(rows,size)


def bfs(visited, graph, node):
  visited.append(node)
  queue.append(node)

  while queue:
    s = queue.pop(0) 
    print (s, end = " ") 

    for neighbour in graph[s]:
      if neighbour not in visited:
        visited.append(neighbour)
        queue.append(neighbour)
