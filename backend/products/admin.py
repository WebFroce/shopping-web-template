from django.contrib import admin

from .models import Product, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
    )

    search_fields = (
        "name",
        "slug",
    )

    readonly_fields = (
        "slug",
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "stock",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
        "description",
    )

    list_filter = (
        "category",
        "is_active",
        "created_at",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "slug",
        "created_at",
        "updated_at",
    )