from rest_framework import serializers

from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category

        fields = (
            "id",
            "name",
            "slug",
            "description",
            "image",
        )

        read_only_fields = (
            "id",
            "slug",
        )

class ProductSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(
        source="category",
        read_only=True
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "category_detail",
            "name",
            "slug",
            "description",
            "price",
            "stock",
            "image",
            "is_active",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "slug",
            "created_at",
            "updated_at",
        )

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "قیمت باید بیشتر از صفر باشد."
            )

        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "موجودی نمی‌تواند منفی باشد."
            )

        return value