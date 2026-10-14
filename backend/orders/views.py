from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Order
from .serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.select_related("user").prefetch_related(
            "items__product"
        )

        if self.request.user.is_staff:
            return queryset

        return queryset.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.select_related("user").prefetch_related(
            "items__product"
        )

        if self.request.user.is_staff:
            return queryset

        return queryset.filter(user=self.request.user)
