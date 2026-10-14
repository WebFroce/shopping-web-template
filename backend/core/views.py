from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny

from .models import SiteSettings
from .serializers import SiteConfigSerializer


class SiteConfigView(RetrieveAPIView):
    serializer_class = SiteConfigSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return SiteSettings.load()
