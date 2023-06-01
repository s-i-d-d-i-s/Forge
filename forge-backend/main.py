from flask import Flask
from flask_cors import CORS
from API_Controller.Users import UserService
from API_Controller.Stocks import StockService
from API_Controller.Expense import ExpenseService
from API_Controller.Settings import SettingService
import os

app = Flask(__name__)

CORS(app)
StockService(app)
ExpenseService(app)
SettingService(app)
UserService(app)


port = os.getenv('PORT')
if port == None:
   port = 5000


if __name__ == '__main__':
   app.run(host="0.0.0.0", port=port)