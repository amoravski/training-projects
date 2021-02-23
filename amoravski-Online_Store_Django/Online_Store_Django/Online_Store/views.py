from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.list import ListView
from .models import Products

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

class ProductListView(ListView):
    model = Products

