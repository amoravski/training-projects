import numpy
import math
import matplotlib
import matplotlib.pyplot as plt
from MeanValueTheorem import mean_value_finder as mvf

def values(f,a,b,e,digits):
    for i in numpy.arange(a+e,b,e):
        print(i)
        yield(mvf(f,a,i,digits), i)

fig, ax = plt.subplots()
for i in values(lambda x : math.sin(x),0,math.pi*2,math.pi/36,0):
    ax.plot(i[0][0],i[1], 'o', color='black')

ax.set(xlabel="point", ylabel="interval length")
ax.grid()
fig.savefig("e.png")
plt.show()
