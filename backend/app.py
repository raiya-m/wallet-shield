from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
import json


import numpy
from sklearn.ensemble import IsolationForest
app = Flask(__name__)
CORS(app)  