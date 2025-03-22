from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
import json


import numpy as np
from sklearn.ensemble import IsolationForest
app = Flask(__name__)
CORS(app)  

@app.route('/ai_analysis', methods=['POST'])
def ai_analysis():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "no file provided"}), 400
        file = request.files['file']
        if file.filename.split('.')[-1].lower() != 'json':
            return jsonify({"error": "Invalid file type. Please upload a JSON file."}), 400
        try:
            data = json.load(file)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON format."}), 400
        
        transactions = data.get("transactions", [])
        if not transactions:
            return jsonify({"error": "No transactions found in the file."}), 400
        
        gas_fees = [txn.get("gas_fee", 0) for txn in transactions]
        amounts = [txn.get("amount", 0) for txn in transactions]
        timestamps = [txn.get("timestamp", "") for txn in transactions]

        gas_fee_anomalies = detect_anomalies(gas_fees, "Gas Fee")
        amount_anomalies = detect_anomalies(amounts, "Transaction Amount")
        flagged_transactions = gas_fee_anomalies + amount_anomalies
        return jsonify({
            "message": "AI Analysis Complete!",
            "flagged_transactions": flagged_transactions
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    print("Received a request on /upload!")
    if request.method == 'GET':
        return jsonify({"message": "This endpoint is for file uploads via POST requests only."}), 200

    if request.method == 'POST':
        try:
            if 'file' not in request.files:
                return jsonify({"error": "No file provided"}), 400

            file = request.files['file']
            
            if file.filename.split('.')[-1].lower() != 'json':
                print("invalid")
                return jsonify({"error": "Invalid file type. Please upload a JSON file."}), 400

            try:
                data = json.load(file)  
            except json.JSONDecodeError:
                return jsonify({"error": "Failed to parse JSON. Ensure the file contains valid JSON data."}), 400

            print("Uploaded JSON data:", data)

            return jsonify({
                
                "message": "File processed successfully!",
                "received_data": data
            }), 200

        except Exception as e:
            return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
