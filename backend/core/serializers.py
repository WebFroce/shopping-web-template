from rest_framework import serializers

from .models import CarouselSlide, NavigationItem, SiteSettings


class NavigationItemSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = NavigationItem
        fields = ("id", "label", "url", "open_in_new_tab")

    def get_label(self, obj):
        return obj.localized_title(self.context["language"])


class CarouselSlideSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    url = serializers.CharField(source="link_url")

    class Meta:
        model = CarouselSlide
        fields = ("id", "image", "title", "url", "open_in_new_tab")

    def get_title(self, obj):
        return obj.localized_title(self.context["language"])


class SiteConfigSerializer(serializers.ModelSerializer):
    direction = serializers.CharField(source="resolved_direction", read_only=True)
    announcement = serializers.SerializerMethodField()
    hero = serializers.SerializerMethodField()
    footer = serializers.SerializerMethodField()
    theme = serializers.SerializerMethodField()
    navigation = serializers.SerializerMethodField()
    carousel_slides = serializers.SerializerMethodField()
    carousel_configured = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = (
            "site_name",
            "logo",
            "language",
            "direction",
            "design_preset",
            "announcement",
            "hero",
            "footer",
            "theme",
            "navigation",
            "carousel_slides",
            "carousel_configured",
            "updated_at",
        )

    def get_announcement(self, obj):
        return obj.localized("announcement")

    def get_hero(self, obj):
        return {
            "title": obj.localized("hero_title"),
            "subtitle": obj.localized("hero_subtitle"),
            "button_text": obj.localized("hero_button"),
            "image": self._absolute_image(obj.hero_image),
        }

    def get_footer(self, obj):
        return {
            "text": obj.localized("footer_text"),
            "email": obj.contact_email,
            "phone": obj.contact_phone,
            "address": obj.localized("address"),
        }

    def get_theme(self, obj):
        return {
            "primary": obj.primary_color,
            "secondary": obj.secondary_color,
            "accent": obj.accent_color,
            "background": obj.background_color,
            "surface": obj.surface_color,
            "text": obj.text_color,
            "muted": obj.muted_color,
            "font_family": obj.font_family,
            "border_radius": obj.border_radius,
            "container_width": obj.container_width,
        }

    def get_navigation(self, obj):
        items = NavigationItem.objects.filter(is_active=True)
        return NavigationItemSerializer(
            items,
            many=True,
            context={"language": obj.language},
        ).data

    def get_carousel_slides(self, obj):
        slides = CarouselSlide.objects.filter(is_active=True)
        return CarouselSlideSerializer(
            slides,
            many=True,
            context={
                "language": obj.language,
                "request": self.context.get("request"),
            },
        ).data

    def get_carousel_configured(self, obj):
        return CarouselSlide.objects.exists()

    def _absolute_image(self, image):
        if not image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(image.url) if request else image.url
