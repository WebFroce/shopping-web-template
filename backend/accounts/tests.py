from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationApiTests(APITestCase):
    def test_user_can_register_login_view_profile_and_logout(self):
        register_response = self.client.post(
            "/api/auth/register/",
            {
                "username": "new-user",
                "email": "new@example.com",
                "password": "A-strong-password-2026",
                "password_confirm": "A-strong-password-2026",
            },
        )

        self.assertEqual(
            register_response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(User.objects.count(), 1)

        login_response = self.client.post(
            "/api/auth/login/",
            {
                "username": "new-user",
                "password": "A-strong-password-2026",
            },
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        token = login_response.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

        profile_response = self.client.get("/api/auth/profile/")
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data["username"], "new-user")

        logout_response = self.client.post("/api/auth/logout/")
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        profile_after_logout = self.client.get("/api/auth/profile/")
        self.assertEqual(
            profile_after_logout.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
