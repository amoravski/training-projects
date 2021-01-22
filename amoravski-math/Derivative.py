import math
def func(x):
    return math.sin(x)

def approx_derivative_definition(f, x0, digits):
    h=0.01
    previous = (f(x0+h) - f(x0))/h
    while True:
        h = h/10
        d = (f(x0+h) - f(x0))/h
        if abs(previous-d)<pow(10,(-1)*digits):
            return d
        previous = d

        
#print(func(1))
print(approx_derivative_definition(func,math.pi/2,5))
