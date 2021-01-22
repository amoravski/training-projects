import numpy
import math
import Derivative
def func(x):
    return pow(math.e,x)

def mean_value_finder(f,a,b, digits):
    mean_value = (f(b)-f(a))/(b-a)
    e=1
    while True:
        for i in numpy.arange(a,b,e):
            if abs(Derivative.approx_derivative_definition(f, i, digits) - mean_value) < pow(10, (-1)*digits):
                return (i, f(i))
        e=e/10
