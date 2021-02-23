from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('products/', views.ProductListView.as_view(), name='products'),
    #path('book/<int:pk>', views.ProductDetailView.as_view(), name='product-detail'),
]
