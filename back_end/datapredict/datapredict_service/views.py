import pickle
import pandas as pd
from django.http import JsonResponse
from django.views import View
from datetime import datetime, timedelta
from pymongo import MongoClient
import os

mongo_host = os.environ.get('MONGO_HOST')
mongo_port = int(os.environ.get('MONGO_PORT'))
mongo_db_name = os.environ.get('MONGO_DB_NAME')

client = MongoClient(host=mongo_host, port=mongo_port)
mongo_db = client[mongo_db_name]
collection = mongo_db["usage_details"]

class FetchFutureDataView(View):
    def get(self, request, id_):
        current_date = datetime.now().date()
        first_day_of_month = current_date.replace(day=1)
        year = current_date.year
        month = current_date.month
        last_day_of_month = first_day_of_month.replace(month=month % 12 + 1, day=1) - timedelta(days=1)
        first_day_string = first_day_of_month.strftime("%Y-%m-%d")
        last_day_string = last_day_of_month.strftime("%Y-%m-%d")

        cursor = collection.find(
            {"Date": {"$gte": first_day_string, "$lte": last_day_string}}
        ).limit(800)

        data_dict = [document for document in cursor]
        data = pd.DataFrame(data_dict)

        X = data[["Hour_of_the_Day", "Day_of_the_Week", "Month", "Temperature"]]
        y = data[
            [
                f"Energy_Consumption_House_" + id_,
                f"Renewable_Energy_Consumption_House_" + id_,
            ]
        ]
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_file_path = os.path.join(current_dir, f"models/fin_model_house_{id_}.pkl")
        loaded_model = pickle.load(open(model_file_path, "rb"))
        # loaded_model = pickle.load(open(f"./models/fin_model_house_" + id_ + ".pkl", "rb"))

        y_pred = loaded_model.predict(X)

        y_pred_df = pd.DataFrame(
            {
                "predicted_usage" + id_: y_pred[:, 0],
                "Energy_Consumption_House_"
                + id_: y.iloc[:, 0],
                "Date": data["Date"],
            }
        )

        y_pred_df["Date"] = pd.to_datetime(y_pred_df["Date"])

        pred_energy_usage = y_pred_df.groupby(y_pred_df["Date"].dt.date)[
            [f"Energy_Consumption_House_{id_}", "predicted_usage" + id_]
        ].sum()

        pred_energy_usage = pred_energy_usage.reset_index()

        pred_energy_usage_dict = pred_energy_usage.to_dict(orient="list")

        return JsonResponse(pred_energy_usage_dict)
