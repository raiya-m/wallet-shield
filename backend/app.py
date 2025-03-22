from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import json
import numpy as np
from sklearn.ensemble import IsolationForest
from dotenv import load_dotenv
import os
import requests

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)


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
            logging.debug("Invalid file type.")
            return jsonify({"error": "Invalid file type. Please upload a JSON file."}), 400

        try:
            data = json.load(file)
            logging.debug("JSON parsed successfully.")
        except json.JSONDecodeError:
            logging.debug("Failed to parse JSON.")
            return jsonify({"error": "Invalid JSON format."}), 400

        transactions = data.get("transactions", [])
        if not transactions:
            logging.debug("No transactions found.")
            return jsonify({"error": "No transactions found in the file."}), 400

        gas_fees = [txn.get("gas_fee", 0) for txn in transactions]
        amounts = [txn.get("amount", 0) for txn in transactions]

        gas_fee_anomalies = detect_anomalies(gas_fees, "Gas Fee")
        amount_anomalies = detect_anomalies(amounts, "Transaction Amount")
        flagged_transactions = gas_fee_anomalies + amount_anomalies

        return jsonify({
            "message": "AI Analysis Complete!",
            "flagged_transactions": flagged_transactions
        }), 200
    except Exception as e:
        logging.error(f"AI analysis error: {str(e)}")
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
            for i, pred in enumerate(predictions):
                if pred == -1:
                    anomalies.append({
                        "transaction_id": f"TXN_{i+1}",
                        "reason": f"Anomalous {field_name}: {values[i]}"
                    })
        except Exception as e:
            logging.error(f"Anomaly detection error for {field_name}: {str(e)}")
    return anomalies


@app.route('/gemini_suggest', methods=['POST'])
def gemini_suggest():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        logging.debug(f"Gemini prompt received: {prompt}")

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        if not GEMINI_API_KEY:
            return jsonify({"error": "Gemini API key not set"}), 500

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        headers = { "Content-Type": "application/json" }
        payload = {
            "contents": [{
                "parts": [{ "text": prompt }]
            }]
        }

        res = requests.post(url, headers=headers, json=payload)
        res.raise_for_status()
        response_data = res.json()
        response_text = response_data["candidates"][0]["content"]["parts"][0]["text"]

        return jsonify({ "response": response_text })

    except Exception as e:
        logging.error(f"Gemini suggestion error: {str(e)}")
        return jsonify({"error": "Error contacting Gemini."}), 500


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    logging.debug("Upload endpoint triggered.")
    if request.method == 'GET':
        return jsonify({"message": "Use POST to upload a file."}), 200

    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename.split('.')[-1].lower() != 'json':
            return jsonify({"error": "Invalid file type. Please upload a JSON file."}), 400

        data = json.load(file)
        logging.debug(f"Uploaded JSON: {data}")

        return jsonify({
            "message": "File processed successfully.",
            "received_data": data
        }), 200

    except Exception as e:
        logging.error(f"Upload error: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
