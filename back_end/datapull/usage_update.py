import pandas as pd
import os
from pymongo import MongoClient
import time

# Connect to the MongoDB database
mongo_host = os.environ.get('MONGO_HOST')
mongo_port = int(os.environ.get('MONGO_PORT'))
mongo_db_name = os.environ.get('MONGO_DB_NAME')

client = MongoClient(host=mongo_host, port=mongo_port)
db = client[mongo_db_name]
collection = db["usage_details"]
# client = MongoClient("mongodb://localhost:27017")
# db = client["energy_usage_db"]
# collection = db["usage_details"]

# Read the CSV file using pandas
data = pd.read_csv("2023_data.csv")

# Convert the data to a list of dictionaries
data_dict = data.to_dict(orient="records")


def insert_data():
    # Insert all records in the data_dict list
    for record in data_dict:
        collection.insert_one(record)
        print("Inserted a record:", record)
        # time.sleep(10)


insert_data()
