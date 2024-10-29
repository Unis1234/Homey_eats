from rest_framework import serializers
from .models import MenuItem, Category, Subcategory
 
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
 
class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = '__all__'
 
class MenuItemSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name', read_only=True)  # Ensure the queryset is correct
 
    class Meta:
        model = MenuItem
        fields = '__all__'

# from rest_framework import serializers
# from .models import MenuItem

# class MenuItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MenuItem
#         fields = ['dishName', 'category', 'description', 'ingredients', 'price', 'preparationTime', 'available', 'image']

#     def create(self, validated_data):
#         return MenuItem.objects.create(**validated_data)


        