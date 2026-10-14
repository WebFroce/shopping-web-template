from django.urls import path

from .views import (
    ProductListCreateView,
    ProductDetailView,
)
from .views import CategoryListView


urlpatterns = [
    path(
        "",
        ProductListCreateView.as_view(),
        name="product-list"
    ),
    
    path(
        "categories/",
        CategoryListView.as_view(),
        name="category-list"
    ),

    path(
        "<str:slug>/",
        ProductDetailView.as_view(),
        name="product-detail"
    ),
    
]
