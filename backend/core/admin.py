from django import forms
from django.contrib import admin
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.utils.html import format_html

from .models import CarouselSlide, NavigationItem, SiteSettings


class SiteSettingsAdminForm(forms.ModelForm):
    class Meta:
        model = SiteSettings
        fields = "__all__"
        widgets = {
            "design_preset": forms.RadioSelect,
            **{
                field_name: forms.TextInput(attrs={"type": "color"})
                for field_name in (
                    "primary_color",
                    "secondary_color",
                    "accent_color",
                    "background_color",
                    "surface_color",
                    "text_color",
                    "muted_color",
                )
            },
        }


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    form = SiteSettingsAdminForm
    change_form_template = "admin/core/sitesettings/change_form.html"

    class Media:
        css = {"all": ("core/admin/site-settings.css",)}

    fieldsets = (
        ("انتخاب طرح آماده", {
            "fields": ("design_preset",),
            "description": (
                "یکی از طرح‌های آماده را انتخاب کنید. رنگ‌ها و فونت‌های بخش ظاهر قالب "
                "روی طرح انتخاب‌شده اعمال می‌شوند."
            ),
        }),
        ("برند و زبان", {
            "fields": ("site_name", "logo", "language", "direction")
        }),
        ("ظاهر قالب", {
            "fields": (
                "primary_color",
                "secondary_color",
                "accent_color",
                "background_color",
                "surface_color",
                "text_color",
                "muted_color",
                "font_family",
                "border_radius",
                "container_width",
            )
        }),
        ("صفحه اصلی", {
            "fields": (
                "announcement_fa",
                "announcement_en",
                "hero_title_fa",
                "hero_title_en",
                "hero_subtitle_fa",
                "hero_subtitle_en",
                "hero_button_fa",
                "hero_button_en",
                "hero_image",
            )
        }),
        ("فوتر و تماس", {
            "fields": (
                "footer_text_fa",
                "footer_text_en",
                "contact_email",
                "contact_phone",
                "address_fa",
                "address_en",
            )
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def get_urls(self):
        custom_urls = [
            path(
                "reset-defaults/",
                self.admin_site.admin_view(self.reset_defaults_view),
                name="core_sitesettings_reset_defaults",
            ),
        ]
        return custom_urls + super().get_urls()

    def reset_defaults_view(self, request):
        settings = SiteSettings.load()
        if not self.has_change_permission(request, settings):
            raise PermissionDenied

        change_url = reverse(
            "admin:core_sitesettings_change",
            args=(settings.pk,),
        )

        if request.method == "POST":
            for field in settings._meta.concrete_fields:
                if field.primary_key or not field.editable:
                    continue

                if field.has_default():
                    value = field.get_default()
                elif field.null:
                    value = None
                else:
                    value = ""

                setattr(settings, field.attname, value)

            settings.save()
            self.log_change(
                request,
                settings,
                "تنظیمات سایت به حالت پیش‌فرض بازگردانده شد.",
            )
            self.message_user(
                request,
                "تنظیمات سایت با موفقیت به حالت پیش‌فرض بازگردانده شد.",
                level="success",
            )
            return HttpResponseRedirect(change_url)

        context = {
            **self.admin_site.each_context(request),
            "title": "بازگردانی تنظیمات پیش‌فرض",
            "opts": self.model._meta,
            "original": settings,
            "change_url": change_url,
        }
        return TemplateResponse(
            request,
            "admin/core/sitesettings/reset_confirmation.html",
            context,
        )


@admin.register(NavigationItem)
class NavigationItemAdmin(admin.ModelAdmin):
    list_display = ("title_fa", "title_en", "url", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("title_fa", "title_en", "url")
    ordering = ("order", "id")


@admin.register(CarouselSlide)
class CarouselSlideAdmin(admin.ModelAdmin):
    list_display = (
        "thumbnail",
        "title_fa",
        "title_en",
        "order",
        "is_active",
    )
    list_editable = ("order", "is_active")
    search_fields = ("title_fa", "title_en", "link_url")
    ordering = ("order", "id")
    readonly_fields = ("image_preview",)
    fieldsets = (
        ("تصویر", {"fields": ("image", "image_preview")}),
        ("متن و لینک", {
            "fields": (
                "title_fa",
                "title_en",
                "link_url",
                "open_in_new_tab",
            )
        }),
        ("نمایش", {"fields": ("order", "is_active")}),
    )

    @admin.display(description="پیش‌نمایش")
    def thumbnail(self, obj):
        if not obj.image:
            return "—"
        return format_html(
            '<img src="{}" alt="" style="width:96px;height:56px;object-fit:cover;border-radius:8px">',
            obj.image.url,
        )

    @admin.display(description="پیش‌نمایش تصویر")
    def image_preview(self, obj):
        if not obj or not obj.image:
            return "بعد از انتخاب تصویر، پیش‌نمایش در این بخش نمایش داده می‌شود."
        return format_html(
            '<img src="{}" alt="" style="max-width:720px;width:100%;max-height:360px;object-fit:cover;border-radius:16px">',
            obj.image.url,
        )
