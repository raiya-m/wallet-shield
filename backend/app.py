from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import json
import numpy as np
from sklearn.ensemble import IsolationForest
app = Flask(__name__)
CORS(app)
@app.route('/ai_analysis', methods=['POST'])
def ai_analysis():
    try:
        logging.debug("AI Analysis endpoint triggered.")
        if 'file' not in request.files:
            logging.debug("No file found in request.")
            return jsonify({"error": "No file provided"}), 400


        file = request.files['file']
        logging.debug(f"File received: {file.filename}")


        if file.filename.split('.')[-1].lower() != 'json':
            logging.debug(f"Invalid file type uploaded: {file.filename}")
            return jsonify({"error": "Invalid file type. Please upload a JSON file."}), 400


        try:
            data = json.load(file)
            logging.debug("JSON file successfully parsed.")
        except json.JSONDecodeError:
            logging.debug("Failed to parse JSON file.")
            return jsonify({"error": "Invalid JSON format."}), 400


        transactions = data.get("transactions", [])
        logging.debug(f"Total transactions found: {len(transactions)}")
        if not transactions:
            logging.debug("No transactions found in the JSON file.")
            return jsonify({"error": "No transactions found in the file."}), 400


        gas_fees = [txn.get("gas_fee", 0) for txn in transactions]
        amounts = [txn.get("amount", 0) for txn in transactions]


        gas_fee_anomalies = detect_anomalies(gas_fees, "Gas Fee")
        amount_anomalies = detect_anomalies(amounts, "Transaction Amount")
        flagged_transactions = gas_fee_anomalies + amount_anomalies
        logging.debug(f"Flagged Transactions: {flagged_transactions}")


        return jsonify({
            "message": "AI Analysis Complete!",
            "flagged_transactions": flagged_transactions
        }), 200
    except Exception as e:
        logging.error(f"An error occurred during AI analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500




def detect_anomalies(values, field_name):
    logging.debug(f"Detecting anomalies for {field_name}")
    anomalies = []  


    if len(values) > 1:
        try:
            model = IsolationForest(contamination=0.2, random_state=42)  
            reshaped_values = np.array(values).reshape(-1, 1)
            model.fit(reshaped_values)
            predictions = model.predict(reshaped_values)
            logging.debug(f"Predictions for {field_name}: {predictions}")


            for i, pred in enumerate(predictions):
                if pred == -1:  
                    anomalies.append({
                        "transaction_id": f"TXN_{i+1}",
                        "reason": f"Anomalous {field_name}: {values[i]}"
                    })
        except Exception as e:
            logging.error(f"An error occurred during anomaly detection for {field_name}: {str(e)}")
    else:
        logging.debug(f"Insufficient data for anomaly detection in {field_name}.")
   
    logging.debug(f"Flagged anomalies for {field_name}: {anomalies}")
    return anomalies




@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    logging.debug("Upload endpoint triggered.")
    if request.method == 'GET':
        logging.debug("GET request to /upload")
        return jsonify({"message": "POST requests only."}), 200
    if request.method == 'POST':
        try:
            logging.debug("POST request to /upload")
            if 'file' not in request.files:
                logging.debug("No file found in request.")
                return jsonify({"error": "no file provided"}), 400


            file = request.files['file']
            logging.debug(f"File received: {file.filename}")


            if file.filename.split('.')[-1].lower() != 'json':
                logging.debug(f"Invalid file type uploaded: {file.filename}")
                return jsonify({"error": "Invalid file type. Please upload a JSON file."}), 400


            try:
                data = json.load(file)
                logging.debug("JSON file parsed.")
            except json.JSONDecodeError:
                logging.debug("Failed to parse JSON file.")
                return jsonify({"error": "Failed to parse JSON. Ensure the file contains valid JSON data."}), 400


            logging.debug(f"Uploaded JSON data: {data}")


            return jsonify({
                "message": "File processed successfully! :3",
                "received_data": data
            }), 200
        except Exception as e:
            logging.error(f"An unexpected error occurred during file upload: {str(e)}")
            return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)