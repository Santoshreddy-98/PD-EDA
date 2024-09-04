from django.db import models

# Create your models here.



class Paths(models.Model):
    path = models.IntegerField()
    data = models.CharField(max_length= 100000)


class EdaFile(models.Model):
    fileDef_Data = models.FileField(upload_to='file_store')
    fileLef_Data = models.FileField(upload_to='file_store')
    fileTiming_Data = models.FileField(upload_to='file_store')
        