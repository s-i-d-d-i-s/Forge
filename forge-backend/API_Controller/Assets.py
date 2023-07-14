import requests
import json
from flask import request, Response
from .Utility import database 
import datetime
import os
import time


class AssetService:
	def __init__(self, app):
		self.db = database.DB()

		@app.route('/get-assets/<uid>/<auth_token>/<currency>')
		def get_assets(uid, auth_token, currency):
			stocks = self.db.get_stocks(uid,auth_token)
			response = []
			for stock in stocks:	
				stock['price'] = self.db.get_price(stock['name'], currency)
				response.append(stock)
			return json.dumps(response)
