
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static


api_urls = [
    path('', include('ParserFlashScore.urls')),
    path('', include('user_api.urls'))
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_urls))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)