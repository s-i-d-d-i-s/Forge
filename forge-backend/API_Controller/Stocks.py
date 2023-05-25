import requests
import json
from flask import request, Response
from .Utility import database 
import datetime
import os
import time


class StockService:
	def __init__(self, app):
		self.db = database.DB()

		

		@app.route('/get-stock-overview/<uid>/<auth_token>/<currency>')
		def get_stock_overview(uid, auth_token, currency):
			stocks = self.db.get_stock_overview(uid,auth_token)
			response = []
			for stock in stocks:	
				stocks[stock]['price'] = self.db.get_price(stock,currency)
				response.append({
					'name': stock,
					'amount': stocks[stock]['amount'],
					'price': stocks[stock]['price']
				})

			return json.dumps(response)
		
		@app.route('/get-stock-history/<uid>/<auth_token>/<currency>/<symbol>')
		def get_stock_history(uid, auth_token, currency,symbol):

			def convert_to_quarter(datetime_str):
				dt = datetime.datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S.%fZ")
				quarter = (dt.month - 1) // 3 + 1
				quarter_str = f"Q{quarter} {dt.year}"
				return quarter_str
						
			def convert_to_custom_format(datetime_str):
				dt = datetime.datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S.%fZ")
				custom_format = dt.strftime("%d %b %Y")
				return custom_format
			
			stocks = self.db.get_stocks(uid,auth_token)
			response = {}
			stocks = sorted(stocks,key= lambda x:datetime.datetime.fromisoformat(x['timestamp']),reverse=True)
			for stock in stocks:	
				timestamp  = stock['timestamp']
				quater = convert_to_quarter(timestamp)
				if quater not in response:
					response[quater] = []
				stock['timestamp'] = convert_to_custom_format(stock['timestamp'])
				response[quater].append(stock)
			return json.dumps(response)

		@app.route('/get-stock-list/<uid>/<auth_token>/<currency>')
		def get_stock_list(uid, auth_token, currency):
			stocks = self.db.get_stocks(uid,auth_token)
			response = []
			for stock in stocks:	
				stock['price'] = self.db.get_price(stock['name'], currency)
				response.append(stock)
			return json.dumps(response)
