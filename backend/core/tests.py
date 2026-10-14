from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import CarouselSlide, NavigationItem, SiteSettings


class SiteSettingsModelTests(TestCase):
    def test_settings_is_a_singleton(self):
        first = SiteSettings.load()
        second = SiteSettings(site_name="Updated")
        second.save()

        self.assertEqual(first.pk, 1)
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(SiteSettings.objects.get().site_name, "Updated")


class SiteConfigApiTests(APITestCase):
    def setUp(self):
        settings = SiteSettings.load()
        settings.site_name = "فروشگاه تست"
        settings.language = SiteSettings.Language.PERSIAN
        settings.direction = SiteSettings.Direction.AUTO
        settings.design_preset = SiteSettings.DesignPreset.LUXURY
        settings.save()

        NavigationItem.objects.all().delete()
        NavigationItem.objects.create(
            title_fa="فروشگاه",
            title_en="Shop",
            url="/Gallery",
            order=1,
        )
        NavigationItem.objects.create(
            title_fa="مخفی",
            title_en="Hidden",
            url="/hidden",
            order=2,
            is_active=False,
        )
        CarouselSlide.objects.create(
            image="carousel/active.jpg",
            title_fa="اسلاید فعال",
            title_en="Active slide",
            link_url="/Gallery",
            order=1,
        )
        CarouselSlide.objects.create(
            image="carousel/hidden.jpg",
            title_fa="اسلاید مخفی",
            title_en="Hidden slide",
            order=2,
            is_active=False,
        )

    def test_config_is_public_and_localized(self):
        response = self.client.get("/api/site/config/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["site_name"], "فروشگاه تست")
        self.assertEqual(response.data["direction"], "rtl")
        self.assertEqual(response.data["design_preset"], "luxury")
        self.assertEqual(len(response.data["navigation"]), 1)
        self.assertEqual(response.data["navigation"][0]["label"], "فروشگاه")
        self.assertTrue(response.data["carousel_configured"])
        self.assertEqual(len(response.data["carousel_slides"]), 1)
        self.assertEqual(response.data["carousel_slides"][0]["title"], "اسلاید فعال")
        self.assertEqual(response.data["carousel_slides"][0]["url"], "/Gallery")


class SiteSettingsAdminResetTests(TestCase):
    def setUp(self):
        self.admin_user = get_user_model().objects.create_superuser(
            username="site-admin",
            email="admin@example.com",
            password="StrongTestPassword123!",
        )
        self.client.force_login(self.admin_user)
        self.settings = SiteSettings.load()
        self.settings.site_name = "فروشگاه سفارشی"
        self.settings.language = SiteSettings.Language.ENGLISH
        self.settings.design_preset = SiteSettings.DesignPreset.STUDIO
        self.settings.primary_color = "#123456"
        self.settings.contact_email = "hello@example.com"
        self.settings.save()
        self.navigation_item = NavigationItem.objects.create(
            title_fa="لینک سفارشی",
            title_en="Custom link",
            url="/custom",
        )
        self.reset_url = reverse("admin:core_sitesettings_reset_defaults")

    def test_reset_confirmation_is_available_from_admin(self):
        response = self.client.get(self.reset_url)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "بازگردانی تنظیمات پیش‌فرض")

    def test_change_form_contains_reset_button(self):
        response = self.client.get(
            reverse("admin:core_sitesettings_change", args=(self.settings.pk,))
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "بازگردانی به حالت پیش‌فرض")
        self.assertContains(response, self.reset_url)

    def test_post_resets_site_settings_without_changing_navigation(self):
        response = self.client.post(self.reset_url)

        self.assertRedirects(
            response,
            reverse("admin:core_sitesettings_change", args=(self.settings.pk,)),
        )
        self.settings.refresh_from_db()
        self.assertEqual(self.settings.site_name, "Nexa Home")
        self.assertEqual(self.settings.language, SiteSettings.Language.PERSIAN)
        self.assertEqual(
            self.settings.design_preset,
            SiteSettings.DesignPreset.WARM,
        )
        self.assertEqual(self.settings.primary_color, "#17211B")
        self.assertEqual(self.settings.contact_email, "")
        self.assertTrue(
            NavigationItem.objects.filter(pk=self.navigation_item.pk).exists()
        )

    def test_staff_user_without_change_permission_cannot_reset_settings(self):
        staff_user = get_user_model().objects.create_user(
            username="readonly-staff",
            password="StrongTestPassword123!",
            is_staff=True,
        )
        self.client.force_login(staff_user)

        response = self.client.post(self.reset_url)

        self.assertEqual(response.status_code, 403)
        self.settings.refresh_from_db()
        self.assertEqual(self.settings.site_name, "فروشگاه سفارشی")
