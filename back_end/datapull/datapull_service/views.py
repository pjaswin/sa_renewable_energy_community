from django.http import JsonResponse
from django.db import connection
from pymongo import MongoClient
import pandas as pd
from datetime import datetime, timedelta
import os
def fetch_data(request, id_):
    # MongoDB connection
    mongo_host = os.environ.get('MONGO_HOST')
    mongo_port = int(os.environ.get('MONGO_PORT'))
    mongo_db_name = os.environ.get('MONGO_DB_NAME')

    client = MongoClient(host=mongo_host, port=mongo_port)
    mongo_db = client[mongo_db_name]
    collection = mongo_db["usage_details"]

    # Convert the start and end dates to datetime objects
    current_date = datetime.now().date()
    previous_month_end = current_date.replace(day=1) - timedelta(days=1)
    previous_month_start = previous_month_end.replace(day=1)

    start_date_string = previous_month_start.strftime("%Y-%m-%d")
    end_date_string = previous_month_end.strftime("%Y-%m-%d")

    print(start_date_string)  # Output: 2023-06-01
    print(end_date_string)  # Output: 2023-06-30

    # Add the date range condition to the MongoDB query
    cursor = collection.find(
        {"Date": {"$gte": start_date_string, "$lte": end_date_string}}
    ).limit(800)

    # Convert the documents into a list of dictionaries
    data_dict = [document for document in cursor]

    # Convert the list of dictionaries into a pandas DataFrame
    data = pd.DataFrame(data_dict)

    energy_usage = data[
        [
            f"Energy_Consumption_House_{id_}",
            f"Renewable_Energy_Consumption_House_{id_}",
            "Date",
        ]
    ]

    energy_usage["Date"] = pd.to_datetime(energy_usage["Date"])

    # Group by date and sum the corresponding columns
    daily_energy_usage = energy_usage.groupby(energy_usage["Date"].dt.date)[
        [f"Energy_Consumption_House_{id_}", f"Renewable_Energy_Consumption_House_{id_}"]
    ].sum()

    # Reset the index to make the date a column
    daily_energy_usage = daily_energy_usage.reset_index()

    # Print the sample output
    print(">>>>>>>", daily_energy_usage.tail())

    energy_usage_dict = daily_energy_usage.to_dict(orient="list")

    return JsonResponse(energy_usage_dict)
