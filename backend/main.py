from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import json
import numpy as np
from sklearn.ensemble import IsolationForest
import os
import requests
from dotenv import load_dotenv
load_dotenv()  
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set. Please check your .env file.")

print(f"Loaded GEMINI_API_KEY: {GEMINI_API_KEY}")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
logging.basicConfig(level=logging.DEBUG)

def fetch_transactions(wallet_address):
    api_key = os.getenv("ETHERSCAN_API_KEY")
    url = f"https://api.etherscan.io/api?module=account&action=txlist&address={wallet_address}&startblock=0&endblock=99999999&sort=asc&apikey={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data"}

@app.route('/ai_analysis', methods=['POST'])
def ai_analysis():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

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

@app.route("/gemini_suggest", methods=["POST"])
def gemini_suggest():
    data = request.get_json()
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"response": "No prompt provided."}), 400
    try:
        logging.debug(f"Sending prompt to Gemini: {prompt}")
        res = requests.post(
            GEMINI_URL, 
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}]
            },
        )
        res.raise_for_status()
        gemini_response = res.json()
        candidates = gemini_response.get("candidates", [])
        if candidates:
            reply = candidates[0]["content"]["parts"][0]["text"]
        else:
            reply = "No response from Gemini."

        return jsonify({"response": reply})
    except requests.exceptions.RequestException as e:
        logging.error(f"Error contacting Gemini: {e}")
        return jsonify({"response": "Error contacting Gemini."}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"response": "Unexpected error occurred."}), 500


if __name__ == "__main__":
    app.run(debug=True)