from django.db import models
from slugify import slugify


class Category(models.Model):
    name = models.CharField(
        "نام دسته‌بندی",
        max_length=100,
        unique=True
    )

    slug = models.SlugField(
        "نامک",
        unique=True,
        blank=True
    )

    description = models.TextField(
        "توضیحات",
        blank=True
    )

    image = models.ImageField(
        "تصویر دسته‌بندی",
        upload_to="categories/",
        blank=True,
        null=True
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)

            slug = base_slug
            counter = 1

            while Category.objects.filter(
                slug=slug
            ).exclude(pk=self.pk).exists():

                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="دسته‌بندی",
        null=True,
        blank=True
    )

    name = models.CharField(
        "نام محصول",
        max_length=200
    )

    slug = models.SlugField(
        "نامک",
        unique=True,
        blank=True
    )

    description = models.TextField(
        "توضیحات",
        blank=True
    )

    price = models.DecimalField(
        "قیمت",
        max_digits=12,
        decimal_places=2
    )

    stock = models.PositiveIntegerField(
        "موجودی",
        default=0
    )

    image = models.ImageField(
        "تصویر",
        upload_to="products/",
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        "فعال",
        default=True
    )

    created_at = models.DateTimeField(
        "تاریخ ایجاد",
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        "آخرین ویرایش",
        auto_now=True
    )

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)

            slug = base_slug
            counter = 1

            while Product.objects.filter(
                slug=slug
            ).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
