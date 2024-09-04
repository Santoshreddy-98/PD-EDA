from rest_framework import serializers
from .models import Paths, EdaFile

   
class PyToDb(serializers.ModelSerializer):
    class Meta:
        model = Paths
        fields ='__all__'     


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EdaFile
        fields = ("id","fileDef_Data","fileLef_Data","fileTiming_Data")