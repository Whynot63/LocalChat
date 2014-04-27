from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from ServerScript.models import ChatPoint
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LocalChat.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin', include(admin.site.urls)),
    url(r'^$', 'ServerScript.views.map_with_points'),
    url(r'^print_chatpoint$', 'ServerScript.views.print_chatpoint_array'),
    url(r'^set_message$', 'ServerScript.views.create_message'),
    url(r'^print_message$', 'ServerScript.views.print_chatmessages_array'),
    url(r'^set_chatpoint$', 'ServerScript.views.set_chatpoint'),
    url(r'^404$', 'ServerScript.views.page404'),
    url(r'', 'ServerScript.views.not_found')
)
