from django.urls import path
from .views import ChartList, DetailDashboard, MainDashboard,SelectMainRun, CrossProbing,UpdateDataETAView,Multirun, SelectRun, UpdateDataPLAView,UpdateDataCommentsView


urlpatterns = [   

    path('django_api/chart_read/', ChartList.as_view(), name='chart_read'),

    # ********* Detail Dashboard urls **********
    path('django_api/detail_parser/', DetailDashboard.as_view(), name='detail_parser'),

    # ******* Main Dashboard urls *********
    path('django_api/process_directories/', MainDashboard.as_view(), name='process_directories'),
    path('django_api/choose-mainrun/', SelectMainRun.as_view(), name='choose-mainrun'),

    path('django_api/update_comment/',UpdateDataCommentsView.as_view(),name='update_comment' ),
    path('django_api/update_eta/',UpdateDataETAView.as_view(),name= 'update_eta' ),
    path('django_api/update_pla/',UpdateDataPLAView.as_view(),name= 'update_pla' ), 

    path('django_api/multirun/',Multirun.as_view(),name= 'multirun' ), 
    path('django_api/choose-multirun/',SelectRun.as_view(),name= 'choose-multirun'),

    # ******** Cross Probbing **********
    path('django_api/cross_probing/', CrossProbing.as_view(), name='cross_probing')
    
]

