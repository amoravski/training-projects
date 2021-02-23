from django.contrib import admin

# Register your models here.
from .models import Products
from .models import Category_Names
from .models import Categories

admin.site.register(Products)
admin.site.register(Category_Names)
admin.site.register(Categories)
