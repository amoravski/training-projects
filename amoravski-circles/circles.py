import math
import matplotlib.pyplot as plt
from matplotlib.path import Path
import matplotlib.patches as patches
from collections import defaultdict
from collections import deque

def bfs(graph, vertex,size,rows):
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
        print(parent)
        print(level)
        print(-1)
        size = 1
    draw_circles(rows, parent,size)

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
    bfs(graph, '1',size, rows)


def dist(p1,p2):
    return math.sqrt(pow(p1[0]-p2[0],2) + pow(p1[1]-p2[1],2))

def draw_circles(circles, parent,size):
    fig, ax = plt.subplots()
    ax.axis('equal')
    for index,circle in enumerate(circles):
        circle_plot = plt.Circle((circle[0],circle[1]),circle[2], fill = False)
        ax.add_artist(circle_plot)
    i = str(size)
    verts = []
    while(True):
        if(int(i) == 1):
            circle = circles[0]
            verts.append((circle[0], circle[1]))
            break
        circle = circles[int(i) - 1]
        verts.append((circle[0], circle[1]))
        i = parent[str(i)]
    verts = list(reversed(verts))
    for index, vert in enumerate(circles):
        ax.text(vert[0],vert[1], index)
    path = Path(verts, None)
    patch = patches.PathPatch(path, facecolor='none', lw=2)
    ax.add_patch(patch)
    ax.autoscale(enable=True,tight=False)
    fig.savefig('plotcircles.png')

# Main code
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
