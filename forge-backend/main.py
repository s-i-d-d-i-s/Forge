from flask import Flask
from flask_cors import CORS
from API_Controller.Stocks import StockService
import os

app = Flask(__name__)

CORS(app)
StockService(app)

port = os.getenv('PORT')
if port == None:
   port = 5000


if __name__ == '__main__':
   app.run(host="0.0.0.0", port=port)