from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer

    permission_classes = [
        AllowAny
    ]


class LoginView(ObtainAuthToken):

    permission_classes = [
        AllowAny
    ]

    def post(
        self,
        request,
        *args,
        **kwargs
    ):

        serializer = self.serializer_class(
            data=request.data,
            context={
                "request": request
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data[
            "user"
        ]

        token, created = (
            Token.objects.get_or_create(
                user=user
            )
        )

        return Response({
            "token": token.key,

            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        })


class ProfileView(
    generics.RetrieveAPIView
):

    serializer_class = UserSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        request.user.auth_token.delete()

        return Response({
            "message":
                "با موفقیت از حساب کاربری خارج شدید."
        })
