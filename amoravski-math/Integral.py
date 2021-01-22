import numpy

def func(x):
    return pow(x,2)

def approximate_integral_darboux(f, a, b, e):
    lower_darboux = 0
    upper_darboux = 0
    for i in numpy.arange(a,b,e):
        lower_darboux += calculate_inf(f,i,i+e,e/2) * e
        upper_darboux += calculate_sup(f,i,i+e,e/2) * e
    return (lower_darboux,upper_darboux)

def approximate_integral_riemann(f, a, b, e):
    riemann_sum = 0
    for i in numpy.arange(a,b,e):
        riemann_sum += f(numpy.random.rand()*e + i) * e
    return riemann_sum;

def approximate_integral_middle(f, a, b, e):
    middle_sum = 0
    for i in numpy.arange(a,b,e):
        middle_sum += f(i+e/2) * e
    return middle_sum;

def calculate_inf(f,a,b,e):
    inf=f(a)
    for i in numpy.arange(a,b,e):
        if inf>f(i):
            inf = f(i)
    return inf

def calculate_sup(f,a,b,e):
    sup=f(a)
    for i in numpy.arange(a,b,e):
        if sup<f(i):
            sup = f(i)
    return sup

def limit_integral_darboux(f, a, b, digits):
    e=1
    while True:
        l,u = approximate_integral_darboux(f,a,b,e)
        if u-l<pow(10, (-1)*digits):
            return l+(u-l)/2
        e = e/10

def limit_integral_riemann(f, a, b, digits):
    e=1
    previous = approximate_integral_riemann(f,a,b,e)
    while True:
        e = e/10
        riemann_sum = approximate_integral_riemann(f,a,b,e)
        if abs(previous - riemann_sum)<pow(10, (-1)*digits):
            return riemann_sum
        previous = riemann_sum

def limit_integral_middle(f, a, b, digits):
    e=1
    previous = approximate_integral_middle(f,a,b,e)
    while True:
        e = e/10
        middle_sum = approximate_integral_middle(f,a,b,e)
        if abs(previous - middle_sum)<pow(10, (-1)*digits):
            return middle_sum
        previous = middle_sum

#print(limit_integral_darboux(func,0,10,2))
#print(limit_integral_riemann(func,0,20,2))
print(limit_integral_middle(func,0,20,2))
