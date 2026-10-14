from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = (
        "product",
        "product_name",
        "unit_price",
        "quantity",
        "subtotal",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "status",
        "total_amount",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "id",
        "user__username",
        "first_name",
        "last_name",
        "phone",
    )
    readonly_fields = (
        "user",
        "total_amount",
        "created_at",
        "updated_at",
    )
    inlines = (OrderItemInline,)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "product_name",
        "unit_price",
        "quantity",
    )
    search_fields = ("product_name", "order__id")
