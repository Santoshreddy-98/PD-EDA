from django.contrib import admin
from .models import Paths, EdaFile

# Register your models here.

class FileAdmin(admin.ModelAdmin):
    list_display = ["path", "data"]
admin.site.register(Paths, FileAdmin)

admin.site.register(EdaFile)