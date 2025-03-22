from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
import json
import numpy as np
from sklearn.ensemble import IsolationForest
app = Flask(__name__)
CORS(app)  
#test commit because issues

def detect_anomalies(values, field_name):
    anomolies = []
    if len(values) > 1:
         model = IsolationForest(contamination=0.1, random_state=42)
         reshaped_values = np.array(values).reshape(-1, 1)
         model.fit(reshaped_values)
         predictions = model.predict(reshaped_values)

         for i, pred in enumerate(predictions):
            if pred == -1:  
                anomolies.append({
                    "transaction_id": f"TXN_{i+1}",
                    "reason": f"Anomalous {field_name}: {values[i]}"
                })
    return anomolies