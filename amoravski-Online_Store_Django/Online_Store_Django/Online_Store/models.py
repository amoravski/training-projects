from django.db import models

class Products(models.Model):
    name = models.TextField()
    price = models.DecimalField(max_digits=100,decimal_places=2)
    amount = models.DecimalField(max_digits=100,decimal_places=2)
    created_at = models.DateTimeField()
    def __str__(self):
        return self.name

class Category_Names(models.Model):
    name = models.TextField()
    def __str__(self):
        return self.name

class Categories(models.Model):
    product = models.ForeignKey('Products', on_delete = models.CASCADE)
    category_name = models.ForeignKey('Category_Names', on_delete = models.CASCADE)
    def __str__(self):
        return self.product.__str__() + ' - ' + self.category_name.__str__()

