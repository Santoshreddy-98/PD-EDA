from rest_framework import serializers
from .models import DashboardParser, DetailDashboarParser



class DashboardSerialzer(serializers.ModelSerializer):
    class Meta:
        model = DashboardParser
        fields = '__all__'


class DetailDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetailDashboarParser
        fields = '__all__'
