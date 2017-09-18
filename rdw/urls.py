"""rdw URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/dev/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from rainfall_detection import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^ajax_init/$', views.ajax_init, name='ajax-init'),
    url(r'^ajax_rain/$', views.ajax_rain, name='ajax-rain'),
    url(r'^ajax_con_rain/$', views.ajax_con_rain, name='ajax-con-rain'),
    url(r'^ajax_con_day/$', views.ajax_con_day, name='ajax-con_day'),
    url(r'^ajax_analyse/$', views.ajax_analyse, name='ajax-analyse'),
]
