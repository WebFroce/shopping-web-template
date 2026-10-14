from django.db import transaction
from rest_framework import serializers

from products.models import Product

from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    product_slug = serializers.CharField(source="product.slug", read_only=True)
    image = serializers.ImageField(source="product.image", read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product",
            "product_slug",
            "product_name",
            "image",
            "unit_price",
            "quantity",
            "subtotal",
        )


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    line_items = OrderItemInputSerializer(many=True, write_only=True)
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "status_display",
            "first_name",
            "last_name",
            "phone",
            "address",
            "postal_code",
            "notes",
            "total_amount",
            "items",
            "line_items",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "status",
            "total_amount",
            "created_at",
            "updated_at",
        )

    def validate_line_items(self, value):
        if not value:
            raise serializers.ValidationError(
                "سبد خرید نمی‌تواند خالی باشد."
            )

        product_ids = [item["product_id"] for item in value]
        if len(product_ids) != len(set(product_ids)):
            raise serializers.ValidationError(
                "هر محصول فقط یک‌بار باید در اقلام سفارش ارسال شود."
            )

        return value

    def create(self, validated_data):
        line_items = validated_data.pop("line_items")
        user = self.context["request"].user
        product_ids = [item["product_id"] for item in line_items]

        with transaction.atomic():
            products = {
                product.id: product
                for product in Product.objects.select_for_update().filter(
                    id__in=product_ids,
                    is_active=True,
                )
            }

            missing_ids = set(product_ids) - set(products)
            if missing_ids:
                raise serializers.ValidationError({
                    "line_items": (
                        "یک یا چند محصول وجود ندارند یا غیرفعال شده‌اند."
                    )
                })

            total_amount = 0
            for item in line_items:
                product = products[item["product_id"]]
                quantity = item["quantity"]

                if product.stock < quantity:
                    raise serializers.ValidationError({
                        "line_items": (
                            f"موجودی «{product.name}» کافی نیست؛ "
                            f"موجودی فعلی {product.stock} عدد است."
                        )
                    })

                total_amount += product.price * quantity

            order = Order.objects.create(
                user=user,
                total_amount=total_amount,
                **validated_data,
            )

            order_items = []
            changed_products = []

            for item in line_items:
                product = products[item["product_id"]]
                quantity = item["quantity"]

                order_items.append(OrderItem(
                    order=order,
                    product=product,
                    product_name=product.name,
                    unit_price=product.price,
                    quantity=quantity,
                ))

                product.stock -= quantity
                changed_products.append(product)

            OrderItem.objects.bulk_create(order_items)
            Product.objects.bulk_update(changed_products, ["stock"])

        return order
