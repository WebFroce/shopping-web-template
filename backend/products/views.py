from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .filters import ProductFilter
from .pagination import ProductPagination


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(
        is_active=True
    )

    serializer_class = ProductSerializer

    pagination_class = ProductPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ProductFilter

    search_fields = [
        "name",
        "description",
        "category__name",
    ]

    ordering_fields = [
        "price",
        "stock",
        "created_at",
        "name",
    ]

    ordering = [
        "-created_at",
    ]


class ProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Product.objects.filter(
        is_active=True
    )

    serializer_class = ProductSerializer
    lookup_field = "slug"


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None