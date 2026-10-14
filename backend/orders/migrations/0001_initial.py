import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("products", "0007_category_description_category_image"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "در انتظار بررسی"),
                            ("processing", "در حال پردازش"),
                            ("shipped", "ارسال‌شده"),
                            ("delivered", "تحویل‌شده"),
                            ("cancelled", "لغوشده"),
                        ],
                        default="pending",
                        max_length=20,
                        verbose_name="وضعیت",
                    ),
                ),
                ("first_name", models.CharField(max_length=100, verbose_name="نام")),
                ("last_name", models.CharField(max_length=100, verbose_name="نام خانوادگی")),
                ("phone", models.CharField(max_length=20, verbose_name="شماره تماس")),
                ("address", models.TextField(verbose_name="نشانی")),
                ("postal_code", models.CharField(blank=True, max_length=20, verbose_name="کد پستی")),
                ("notes", models.TextField(blank=True, verbose_name="توضیحات")),
                (
                    "total_amount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=14,
                        validators=[django.core.validators.MinValueValidator(0)],
                        verbose_name="مبلغ کل",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="آخرین ویرایش")),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="orders",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="کاربر",
                    ),
                ),
            ],
            options={
                "verbose_name": "سفارش",
                "verbose_name_plural": "سفارش‌ها",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("product_name", models.CharField(max_length=200, verbose_name="نام محصول")),
                (
                    "unit_price",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=12,
                        validators=[django.core.validators.MinValueValidator(0)],
                        verbose_name="قیمت واحد",
                    ),
                ),
                (
                    "quantity",
                    models.PositiveIntegerField(
                        validators=[django.core.validators.MinValueValidator(1)],
                        verbose_name="تعداد",
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="orders.order",
                        verbose_name="سفارش",
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="order_items",
                        to="products.product",
                        verbose_name="محصول",
                    ),
                ),
            ],
            options={
                "verbose_name": "قلم سفارش",
                "verbose_name_plural": "اقلام سفارش",
            },
        ),
    ]
