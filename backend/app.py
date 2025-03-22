from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
import json
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    force=True  # so flask doesn't override logging config
)

logger = logging.getLogger(__name__)


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

@app.route('/ai_analysis', methods=['POST'])
def ai_analysis():
    try:
        logger.info("POST /ai_analysis called")
        if 'file' not in request.files:
            logger.warning("No file provided in request")
            return jsonify({"error": "no file provided"}), 400

        file = request.files['file']
        logger.info("Received file: %s", file.filename)

        if file.filename.split('.')[-1].lower() != 'json':
            logger.warning("Invalid file type: %s", file.filename)
            return jsonify({"error": "Invalid file type. Please upload a JSON file."}), 400

        try:
            data = json.load(file)
        except json.JSONDecodeError as e:
            logger.error("Invalid JSON format: %s", e)
            return jsonify({"error": "Invalid JSON format."}), 400

        transactions = data.get("transactions", [])
        logger.info("Transaction count: %d", len(transactions))

        if not transactions:
            logger.warning("No transactions found in uploaded JSON")
            return jsonify({"error": "No transactions found in the file."}), 400

        gas_fees = [txn.get("gas_fee", 0) for txn in transactions]
        amounts = [txn.get("amount", 0) for txn in transactions]
        logger.debug("Gas fees: %s", gas_fees)
        logger.debug("Amounts: %s", amounts)

        gas_fee_anomalies = detect_anomalies(gas_fees, "Gas Fee")
        amount_anomalies = detect_anomalies(amounts, "Transaction Amount")
        flagged_transactions = gas_fee_anomalies + amount_anomalies
        logger.info("Flagged %d transactions", len(flagged_transactions))

        return jsonify({
            "message": "AI Analysis Complete!",
            "flagged_transactions": flagged_transactions
        }), 200

    except Exception as e:
        logger.exception("Unexpected error during AI analysis")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
