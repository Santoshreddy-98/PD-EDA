from django.urls import path
from . import views


urlpatterns = [
    path('def', views.PostView.as_view()),
    path('timing/<int:pk>',views.Timing_Data,name='timing')
    # path('diearea', views.dieArea)
]

