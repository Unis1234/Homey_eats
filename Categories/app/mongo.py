from pymongo import MongoClient
 
myClient=MongoClient("mongodb://localhost:27017")
mydatabase=myClient['foodapp']
collection = mydatabase['UserData']
category_collection = mydatabase['Categories']  # Collection for categories
subcategory_collection = mydatabase['Subcategories']