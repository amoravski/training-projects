import math
import matplotlib
import matplotlib.pyplot as plt

def func(y,t):
    # 2 - exp(-4t) - 2y
    return pow(t,2)

def EulerApproximation(f,h,t0,y0, t1):
    # dy/dt = f(y,t), with y(t0) = y0
    m = f(y0,t0)
    y = y0
    t = t0
    while t < t1:
        y = y + m*h
        t += h
        m = f(y,t)
    return y

def EulerApproximationPlot(f,h,t0,y0, t1):
    fig,ax = plt.subplots()
    m = f(y0,t0)
    ax.plot(t0,y0, 'o', color='black')
    y = y0
    t = t0
    while t <= t1:
        y = y + m*h
        t += h
        m = f(y,t)
        ax.plot(t,y, 'o', color='black')
    ax.set(xlabel="time", ylabel="value")
    ax.grid()
    plt.show()

print(EulerApproximationPlot(func,0.1,-1000,15,1000))
