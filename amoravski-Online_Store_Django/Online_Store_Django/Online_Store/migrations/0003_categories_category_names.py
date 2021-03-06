# Generated by Django 3.1.7 on 2021-02-23 09:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Online_Store', '0002_auto_20210223_0837'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category_Names',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Categories',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Online_Store.category_names')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Online_Store.products')),
            ],
        ),
    ]
