# Generated by Django 5.1.1 on 2024-10-25 16:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_rename_name_menuitem_dishname_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='menuitem',
            old_name='dishName',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='menuitem',
            old_name='preparationTime',
            new_name='preparation_time',
        ),
    ]
