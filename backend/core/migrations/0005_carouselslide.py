from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0004_alter_sitesettings_design_preset"),
    ]

    operations = [
        migrations.CreateModel(
            name="CarouselSlide",
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
                    "image",
                    models.ImageField(upload_to="carousel/", verbose_name="تصویر اسلاید"),
                ),
                (
                    "title_fa",
                    models.CharField(blank=True, max_length=140, verbose_name="عنوان فارسی"),
                ),
                (
                    "title_en",
                    models.CharField(blank=True, max_length=140, verbose_name="عنوان انگلیسی"),
                ),
                (
                    "link_url",
                    models.CharField(
                        blank=True,
                        help_text="برای مسیر داخلی مانند /Gallery یا آدرس کامل https://...",
                        max_length=300,
                        verbose_name="لینک اختیاری",
                    ),
                ),
                (
                    "open_in_new_tab",
                    models.BooleanField(default=False, verbose_name="بازشدن لینک در تب جدید"),
                ),
                ("order", models.PositiveSmallIntegerField(default=0, verbose_name="ترتیب")),
                ("is_active", models.BooleanField(default=True, verbose_name="فعال")),
            ],
            options={
                "verbose_name": "اسلاید کروسل",
                "verbose_name_plural": "اسلایدهای کروسل",
                "ordering": ("order", "id"),
            },
        ),
    ]
