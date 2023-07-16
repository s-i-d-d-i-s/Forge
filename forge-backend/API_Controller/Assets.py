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
			assets = self.db.get_assets(uid,auth_token)
			response = []
			for asset in assets:	
				asset['price'] = round(self.db.convert_money(float(asset['price']), asset['currency'], currency),2)
				response.append(asset)
			return json.dumps(response)
