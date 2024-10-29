from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from bson.objectid import ObjectId
from pymongo import MongoClient
from .models import MenuItem, Category, Subcategory
from .serializers import MenuItemSerializer, CategorySerializer, SubcategorySerializer
from . import serializers


myClient = MongoClient("mongodb://localhost:27017")
mydatabase = myClient['foodapp']
collection = mydatabase['UserData']
category_collection = mydatabase['Categories']  # Collection for categories
subcategory_collection = mydatabase['Subcategories']  # Collection for subcategories

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def create(self, request):
        serializer = self.get_serializer_class()(data=request.data)
        if serializer.is_valid():
            category_data = serializer.validated_data

            # Prepare data for MongoDB insertion
            mongo_data = {
                "name": category_data.get("name"),
            }

            # Insert into MongoDB
            collection = mydatabase['Categories']  # Ensure this matches your MongoDB collection name
            inserted_data = collection.insert_one(mongo_data)

            # Save to Django's database (for API tracking)
            category_instance = Category.objects.create(
                name=category_data.get("name")
            )

            # Return both MongoDB and Django response for API purposes
            response_data = serializer.data
            response_data['_id'] = str(inserted_data.inserted_id)  # MongoDB ID
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer

    def create(self, request):
        serializer = self.get_serializer_class()(data=request.data)
        if serializer.is_valid():
            subcategory_data = serializer.validated_data
            
            # Prepare data for MongoDB insertion
            mongo_data = {
                "name": subcategory_data.get("name"),
                "parent_category": str(subcategory_data.get("parent_category").id) if subcategory_data.get("parent_category") else None
            }
            
            # Insert the prepared data into MongoDB
            collection = mydatabase['Subcategories']  # Ensure this matches your MongoDB collection name
            inserted_data = collection.insert_one(mongo_data)  # Insert to MongoDB
            
            # Save to Django's database (for API tracking)
            subcategory_instance = Subcategory.objects.create(
                name=subcategory_data.get("name"),
                parent_category=subcategory_data.get("parent_category")
            )
            
            # Return both MongoDB and Django response for API purposes
            response_data = serializer.data
            response_data['_id'] = str(inserted_data.inserted_id)  # MongoDB ID
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


import logging
from rest_framework.response import Response
from rest_framework import status, viewsets
from bson import ObjectId
from django.shortcuts import get_object_or_404
from .models import MenuItem, Category  # Ensure you import the Category model
from .serializers import MenuItemSerializer  # Ensure you import your serializer

logger = logging.getLogger(__name__)

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        return MenuItem.objects.all()

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer_class()(data=request.data)
        
        if serializer.is_valid():
            # Convert Decimal fields to float if necessary
            if 'price' in serializer.validated_data:
                serializer.validated_data['price'] = float(serializer.validated_data['price'])

            # Handle image file
            image_file = request.FILES.get('image')
            if image_file:
                serializer.validated_data['image'] = image_file  # Use the file object directly

            # Extract category ID if present
            category_id = request.data.get('category')
            if category_id:
                category = get_object_or_404(Category, id=category_id)
                serializer.validated_data['category'] = category

            # Extract subcategory ID if present
            subcategory_id = request.data.get('subcategory')
            if subcategory_id:
                subcategory = get_object_or_404(Subcategory, id=subcategory_id)
                serializer.validated_data['subcategory'] = subcategory

            # Save using Django ORM
            menu_item = serializer.save()

            # Prepare the data for MongoDB insertion manually
            menu_item_data = {
                "name": menu_item.name,
                "description": menu_item.description,
                "ingredients": menu_item.ingredients,
                "price": str(menu_item.price),  # Convert Decimal to string if needed
                "preparation_time": menu_item.preparation_time,
                "available": menu_item.available,
                "category": str(menu_item.category.id) if menu_item.category else None,
                "subcategory": str(menu_item.subcategory.id) if menu_item.subcategory else None,
                "image": menu_item.image.url if menu_item.image else None,
            }
            
            # Save to MongoDB
            collection.insert_one(menu_item_data)

            return Response({'msg': 'Record is created'}, status=status.HTTP_201_CREATED)
        
        # Log validation errors
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        user_record = collection.find_one({"_id": ObjectId(pk)})
        if user_record:
            serializer = self.get_serializer_class()(user_record)
            return Response(serializer.data)
        return Response({'msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk):
        user_record = collection.find_one({"_id": ObjectId(pk)})
        if user_record:
            serializer = self.get_serializer_class()(user_record, data=request.data)
            if serializer.is_valid():
                # Update MongoDB record
                collection.update_one({"_id": ObjectId(pk)}, {"$set": serializer.validated_data})
                return Response({'msg': 'Record is updated'})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk):
        result = collection.delete_one({"_id": ObjectId(pk)})
        if result.deleted_count:
            return Response({'msg': 'Record is deleted'})
        return Response({'msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
