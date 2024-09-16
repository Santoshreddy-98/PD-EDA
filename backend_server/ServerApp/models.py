from django.db import models




class DashboardParser(models.Model):
    content = models.JSONField()
    project_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'MainDashboard'


class DetailDashboarParser(models.Model):
    content = models.JSONField()
    project_name = models.CharField(max_length=100)
    timing_data = models.JSONField()
    
    class Meta:
        db_table = 'detail_dashboard'


class Paths(models.Model):
    data = models.JSONField()

    def __str__(self):
        return str(self.data)
    class Meta:
        db_table = 'Paths'