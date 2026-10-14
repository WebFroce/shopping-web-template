from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models


color_validator = RegexValidator(
    regex=r"^#[0-9a-fA-F]{6}$",
    message="رنگ باید به‌صورت کد شش‌رقمی مانند #2563EB وارد شود.",
)


class SiteSettings(models.Model):
    class Language(models.TextChoices):
        PERSIAN = "fa", "فارسی"
        ENGLISH = "en", "English"

    class Direction(models.TextChoices):
        AUTO = "auto", "خودکار بر اساس زبان"
        RTL = "rtl", "راست به چپ"
        LTR = "ltr", "چپ به راست"

    class DesignPreset(models.TextChoices):
        WARM = "warm", "آتلیه ادیتوریال"
        MINIMAL = "minimal", "بنتو سیگنیچر"
        LUXURY = "luxury", "پرل لوکس"
        STUDIO = "studio", "آرورا شیشه‌ای"

    site_name = models.CharField("نام سایت", max_length=120, default="Nexa Home")
    logo = models.ImageField("لوگو", upload_to="branding/", blank=True, null=True)
    language = models.CharField(
        "زبان قالب",
        max_length=2,
        choices=Language.choices,
        default=Language.PERSIAN,
    )
    direction = models.CharField(
        "جهت نمایش",
        max_length=4,
        choices=Direction.choices,
        default=Direction.AUTO,
    )
    design_preset = models.CharField(
        "طرح ظاهری",
        max_length=16,
        choices=DesignPreset.choices,
        default=DesignPreset.WARM,
        help_text="چیدمان و ظاهر کلی هدر، صفحه اصلی، محصولات، فیلترها و فوتر را تعیین می‌کند.",
    )

    primary_color = models.CharField(
        "رنگ اصلی", max_length=7, default="#17211B", validators=[color_validator]
    )
    secondary_color = models.CharField(
        "رنگ مکمل", max_length=7, default="#DCE8DF", validators=[color_validator]
    )
    accent_color = models.CharField(
        "رنگ تأکیدی", max_length=7, default="#D97745", validators=[color_validator]
    )
    background_color = models.CharField(
        "رنگ پس‌زمینه", max_length=7, default="#F4F5F0", validators=[color_validator]
    )
    surface_color = models.CharField(
        "رنگ کارت‌ها", max_length=7, default="#FFFFFF", validators=[color_validator]
    )
    text_color = models.CharField(
        "رنگ متن", max_length=7, default="#17211B", validators=[color_validator]
    )
    muted_color = models.CharField(
        "رنگ متن فرعی", max_length=7, default="#6C746E", validators=[color_validator]
    )
    font_family = models.CharField(
        "فونت قالب",
        max_length=160,
        default="IRANSansX, Tahoma, Arial, sans-serif",
        help_text="مثال: IRANSansX, Tahoma, Arial, sans-serif",
    )
    border_radius = models.PositiveSmallIntegerField(
        "گردی گوشه‌ها (پیکسل)",
        default=22,
        validators=[MinValueValidator(0), MaxValueValidator(48)],
    )
    container_width = models.PositiveSmallIntegerField(
        "حداکثر عرض محتوا (پیکسل)",
        default=1320,
        validators=[MinValueValidator(960), MaxValueValidator(1800)],
    )

    announcement_fa = models.CharField("اعلان بالای سایت (فارسی)", max_length=240, blank=True)
    announcement_en = models.CharField("اعلان بالای سایت (English)", max_length=240, blank=True)
    hero_title_fa = models.CharField("عنوان اصلی (فارسی)", max_length=180, default="خانه‌ای که شبیه شماست")
    hero_title_en = models.CharField("عنوان اصلی (English)", max_length=180, default="A home that feels like you")
    hero_subtitle_fa = models.TextField(
        "توضیح اصلی (فارسی)",
        default="مبلمان مدرن، باکیفیت و ماندگار برای ساختن فضایی آرام و متفاوت.",
    )
    hero_subtitle_en = models.TextField(
        "توضیح اصلی (English)",
        default="Modern, lasting furniture for calm and distinctive spaces.",
    )
    hero_button_fa = models.CharField("متن دکمه اصلی (فارسی)", max_length=80, default="مشاهده محصولات")
    hero_button_en = models.CharField("متن دکمه اصلی (English)", max_length=80, default="Explore products")
    hero_image = models.ImageField("تصویر اصلی", upload_to="branding/", blank=True, null=True)

    footer_text_fa = models.TextField(
        "متن فوتر (فارسی)",
        default="انتخابی مدرن برای خانه‌ای گرم، ساده و ماندگار.",
    )
    footer_text_en = models.TextField(
        "متن فوتر (English)",
        default="A modern choice for a warm, simple and lasting home.",
    )
    contact_email = models.EmailField("ایمیل تماس", blank=True)
    contact_phone = models.CharField("شماره تماس", max_length=30, blank=True)
    address_fa = models.CharField("نشانی (فارسی)", max_length=300, blank=True)
    address_en = models.CharField("Address (English)", max_length=300, blank=True)

    updated_at = models.DateTimeField("آخرین ویرایش", auto_now=True)

    class Meta:
        verbose_name = "تنظیمات سایت"
        verbose_name_plural = "تنظیمات سایت"

    @classmethod
    def load(cls):
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings

    @property
    def resolved_direction(self):
        if self.direction != self.Direction.AUTO:
            return self.direction
        return "rtl" if self.language == self.Language.PERSIAN else "ltr"

    def localized(self, field_name):
        return getattr(self, f"{field_name}_{self.language}")

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.site_name


class NavigationItem(models.Model):
    title_fa = models.CharField("عنوان فارسی", max_length=80)
    title_en = models.CharField("عنوان انگلیسی", max_length=80)
    url = models.CharField(
        "مسیر یا آدرس",
        max_length=300,
        help_text="برای مسیر داخلی مانند /Gallery یا آدرس کامل https://...",
    )
    order = models.PositiveSmallIntegerField("ترتیب", default=0)
    is_active = models.BooleanField("فعال", default=True)
    open_in_new_tab = models.BooleanField("بازشدن در تب جدید", default=False)

    class Meta:
        ordering = ("order", "id")
        verbose_name = "آیتم منو"
        verbose_name_plural = "منوی ناوبری"

    def localized_title(self, language):
        return self.title_fa if language == SiteSettings.Language.PERSIAN else self.title_en

    def __str__(self):
        return self.title_fa


class CarouselSlide(models.Model):
    image = models.ImageField("تصویر اسلاید", upload_to="carousel/")
    title_fa = models.CharField("عنوان فارسی", max_length=140, blank=True)
    title_en = models.CharField("عنوان انگلیسی", max_length=140, blank=True)
    link_url = models.CharField(
        "لینک اختیاری",
        max_length=300,
        blank=True,
        help_text="برای مسیر داخلی مانند /Gallery یا آدرس کامل https://...",
    )
    open_in_new_tab = models.BooleanField("بازشدن لینک در تب جدید", default=False)
    order = models.PositiveSmallIntegerField("ترتیب", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        ordering = ("order", "id")
        verbose_name = "اسلاید کروسل"
        verbose_name_plural = "اسلایدهای کروسل"

    def localized_title(self, language):
        return self.title_fa if language == SiteSettings.Language.PERSIAN else self.title_en

    def __str__(self):
        return self.title_fa or self.title_en or f"اسلاید {self.pk or ''}".strip()
