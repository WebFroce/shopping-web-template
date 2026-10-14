from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Product


class ProductApiTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="صندلی")
        self.product = Product.objects.create(
            category=self.category,
            name="صندلی تست",
            price="1250000.00",
            stock=5,
        )
        self.user = User.objects.create_user(
            username="customer",
            password="StrongPass123!",
        )
        self.admin = User.objects.create_user(
            username="manager",
            password="StrongPass123!",
            is_staff=True,
        )

    def test_anyone_can_list_and_retrieve_products(self):
        list_response = self.client.get("/api/products/")
        detail_response = self.client.get(
            f"/api/products/{self.product.slug}/"
        )

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)

    def test_anonymous_user_cannot_create_product(self):
        response = self.client.post(
            "/api/products/",
            {
                "category": self.category.id,
                "name": "میز تست",
                "price": "2000000.00",
                "stock": 2,
            },
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_cannot_create_product(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            "/api/products/",
            {
                "category": self.category.id,
                "name": "میز تست",
                "price": "2000000.00",
                "stock": 2,
            },
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_user_can_create_product(self):
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            "/api/products/",
            {
                "category": self.category.id,
                "name": "میز تست",
                "price": "2000000.00",
                "stock": 2,
            },
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Product.objects.filter(name="میز تست").exists())
