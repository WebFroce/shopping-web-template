import core.models
import django.core.validators
from django.db import migrations, models


def create_default_content(apps, schema_editor):
    SiteSettings = apps.get_model("core", "SiteSettings")
    NavigationItem = apps.get_model("core", "NavigationItem")

    SiteSettings.objects.get_or_create(pk=1)
    NavigationItem.objects.bulk_create([
        NavigationItem(title_fa="خانه", title_en="Home", url="/", order=1),
        NavigationItem(title_fa="فروشگاه", title_en="Shop", url="/Gallery", order=2),
        NavigationItem(title_fa="سؤالات متداول", title_en="FAQ", url="/faq", order=3),
        NavigationItem(title_fa="تماس با ما", title_en="Contact", url="/contact_Us", order=4),
    ])


def remove_default_content(apps, schema_editor):
    apps.get_model("core", "NavigationItem").objects.all().delete()
    apps.get_model("core", "SiteSettings").objects.all().delete()


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="NavigationItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title_fa", models.CharField(max_length=80, verbose_name="عنوان فارسی")),
                ("title_en", models.CharField(max_length=80, verbose_name="عنوان انگلیسی")),
                ("url", models.CharField(help_text="برای مسیر داخلی مانند /Gallery یا آدرس کامل https://...", max_length=300, verbose_name="مسیر یا آدرس")),
                ("order", models.PositiveSmallIntegerField(default=0, verbose_name="ترتیب")),
                ("is_active", models.BooleanField(default=True, verbose_name="فعال")),
                ("open_in_new_tab", models.BooleanField(default=False, verbose_name="بازشدن در تب جدید")),
            ],
            options={"verbose_name": "آیتم منو", "verbose_name_plural": "منوی ناوبری", "ordering": ("order", "id")},
        ),
        migrations.CreateModel(
            name="SiteSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("site_name", models.CharField(default="Nexa Home", max_length=120, verbose_name="نام سایت")),
                ("logo", models.ImageField(blank=True, null=True, upload_to="branding/", verbose_name="لوگو")),
                ("language", models.CharField(choices=[("fa", "فارسی"), ("en", "English")], default="fa", max_length=2, verbose_name="زبان قالب")),
                ("direction", models.CharField(choices=[("auto", "خودکار بر اساس زبان"), ("rtl", "راست به چپ"), ("ltr", "چپ به راست")], default="auto", max_length=4, verbose_name="جهت نمایش")),
                ("primary_color", models.CharField(default="#17211B", max_length=7, validators=[core.models.color_validator], verbose_name="رنگ اصلی")),
                ("secondary_color", models.CharField(default="#DCE8DF", max_length=7, validators=[core.models.color_validator], verbose_name="رنگ مکمل")),
                ("accent_color", models.CharField(default="#D97745", max_length=7, validators=[core.models.color_validator], verbose_name="رنگ تأکیدی")),
                ("background_color", models.CharField(default="#F4F5F0", max_length=7, validators=[core.models.color_validator], verbose_name="رنگ پس‌زمینه")),
                ("surface_color", models.CharField(default="#FFFFFF", max_length=7, validators=[core.models.color_validator], verbose_name="رنگ کارت‌ها")),
                ("text_color", models.CharField(default="#17211B", max_length=7, validators=[core.models.color_validator], verbose_name="رنگ متن")),
                ("muted_color", models.CharField(default="#6C746E", max_length=7, validators=[core.models.color_validator], verbose_name="رنگ متن فرعی")),
                ("font_family", models.CharField(default="IRANSansX, Tahoma, Arial, sans-serif", help_text="مثال: IRANSansX, Tahoma, Arial, sans-serif", max_length=160, verbose_name="فونت قالب")),
                ("border_radius", models.PositiveSmallIntegerField(default=22, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(48)], verbose_name="گردی گوشه‌ها (پیکسل)")),
                ("container_width", models.PositiveSmallIntegerField(default=1320, validators=[django.core.validators.MinValueValidator(960), django.core.validators.MaxValueValidator(1800)], verbose_name="حداکثر عرض محتوا (پیکسل)")),
                ("announcement_fa", models.CharField(blank=True, max_length=240, verbose_name="اعلان بالای سایت (فارسی)")),
                ("announcement_en", models.CharField(blank=True, max_length=240, verbose_name="اعلان بالای سایت (English)")),
                ("hero_title_fa", models.CharField(default="خانه‌ای که شبیه شماست", max_length=180, verbose_name="عنوان اصلی (فارسی)")),
                ("hero_title_en", models.CharField(default="A home that feels like you", max_length=180, verbose_name="عنوان اصلی (English)")),
                ("hero_subtitle_fa", models.TextField(default="مبلمان مدرن، باکیفیت و ماندگار برای ساختن فضایی آرام و متفاوت.", verbose_name="توضیح اصلی (فارسی)")),
                ("hero_subtitle_en", models.TextField(default="Modern, lasting furniture for calm and distinctive spaces.", verbose_name="توضیح اصلی (English)")),
                ("hero_button_fa", models.CharField(default="مشاهده محصولات", max_length=80, verbose_name="متن دکمه اصلی (فارسی)")),
                ("hero_button_en", models.CharField(default="Explore products", max_length=80, verbose_name="متن دکمه اصلی (English)")),
                ("hero_image", models.ImageField(blank=True, null=True, upload_to="branding/", verbose_name="تصویر اصلی")),
                ("footer_text_fa", models.TextField(default="انتخابی مدرن برای خانه‌ای گرم، ساده و ماندگار.", verbose_name="متن فوتر (فارسی)")),
                ("footer_text_en", models.TextField(default="A modern choice for a warm, simple and lasting home.", verbose_name="متن فوتر (English)")),
                ("contact_email", models.EmailField(blank=True, max_length=254, verbose_name="ایمیل تماس")),
                ("contact_phone", models.CharField(blank=True, max_length=30, verbose_name="شماره تماس")),
                ("address_fa", models.CharField(blank=True, max_length=300, verbose_name="نشانی (فارسی)")),
                ("address_en", models.CharField(blank=True, max_length=300, verbose_name="Address (English)")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="آخرین ویرایش")),
            ],
            options={"verbose_name": "تنظیمات سایت", "verbose_name_plural": "تنظیمات سایت"},
        ),
        migrations.RunPython(create_default_content, remove_default_content),
    ]
