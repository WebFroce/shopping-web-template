from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from products.models import Product


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "در انتظار بررسی"
        PROCESSING = "processing", "در حال پردازش"
        SHIPPED = "shipped", "ارسال‌شده"
        DELIVERED = "delivered", "تحویل‌شده"
        CANCELLED = "cancelled", "لغوشده"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="orders",
        verbose_name="کاربر",
    )
    status = models.CharField(
        "وضعیت",
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    first_name = models.CharField("نام", max_length=100)
    last_name = models.CharField("نام خانوادگی", max_length=100)
    phone = models.CharField("شماره تماس", max_length=20)
    address = models.TextField("نشانی")
    postal_code = models.CharField("کد پستی", max_length=20, blank=True)
    notes = models.TextField("توضیحات", blank=True)
    total_amount = models.DecimalField(
        "مبلغ کل",
        max_digits=14,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    created_at = models.DateTimeField("تاریخ ثبت", auto_now_add=True)
    updated_at = models.DateTimeField("آخرین ویرایش", auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "سفارش"
        verbose_name_plural = "سفارش‌ها"

    def __str__(self):
        return f"سفارش {self.pk} - {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="سفارش",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        related_name="order_items",
        null=True,
        verbose_name="محصول",
    )
    product_name = models.CharField("نام محصول", max_length=200)
    unit_price = models.DecimalField(
        "قیمت واحد",
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    quantity = models.PositiveIntegerField(
        "تعداد",
        validators=[MinValueValidator(1)],
    )

    class Meta:
        verbose_name = "قلم سفارش"
        verbose_name_plural = "اقلام سفارش"

    @property
    def subtotal(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.product_name} × {self.quantity}"
