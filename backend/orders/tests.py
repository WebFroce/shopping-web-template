from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from products.models import Category, Product

from .models import Order


class OrderApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="customer",
            password="StrongPass123!",
        )
        self.other_user = User.objects.create_user(
            username="other-customer",
            password="StrongPass123!",
        )
        self.category = Category.objects.create(name="میز")
        self.product = Product.objects.create(
            category=self.category,
            name="میز ناهارخوری",
            price="2500000.00",
            stock=5,
        )
        self.payload = {
            "first_name": "سروش",
            "last_name": "مرادی",
            "phone": "09120000000",
            "address": "تهران، خیابان نمونه",
            "postal_code": "1234567890",
            "notes": "تحویل در ساعات اداری",
            "line_items": [
                {
                    "product_id": self.product.id,
                    "quantity": 2,
                }
            ],
        }

    def test_authentication_is_required(self):
        list_response = self.client.get("/api/orders/")
        create_response = self.client.post(
            "/api/orders/",
            self.payload,
            format="json",
        )

        self.assertEqual(list_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(create_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_order_calculates_total_and_reduces_stock(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            "/api/orders/",
            self.payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["total_amount"], "5000000.00")
        self.assertEqual(response.data["items"][0]["quantity"], 2)

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)
        self.assertEqual(Order.objects.get().user, self.user)

    def test_insufficient_stock_does_not_create_order(self):
        self.client.force_authenticate(self.user)
        self.payload["line_items"][0]["quantity"] = 6

        response = self.client.post(
            "/api/orders/",
            self.payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), 0)

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 5)

    def test_duplicate_product_is_rejected(self):
        self.client.force_authenticate(self.user)
        self.payload["line_items"].append({
            "product_id": self.product.id,
            "quantity": 1,
        })

        response = self.client.post(
            "/api/orders/",
            self.payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), 0)

    def test_user_only_sees_their_own_orders(self):
        self.client.force_authenticate(self.other_user)
        create_response = self.client.post(
            "/api/orders/",
            self.payload,
            format="json",
        )
        order_id = create_response.data["id"]

        self.client.force_authenticate(self.user)
        list_response = self.client.get("/api/orders/")
        detail_response = self.client.get(f"/api/orders/{order_id}/")

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data["count"], 0)
        self.assertEqual(detail_response.status_code, status.HTTP_404_NOT_FOUND)
