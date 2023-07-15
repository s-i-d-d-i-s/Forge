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
				asset['price'] = self.db.convert_money(asset['price'], asset['currency'], currency)
				response.append(asset)
			return json.dumps(response)
