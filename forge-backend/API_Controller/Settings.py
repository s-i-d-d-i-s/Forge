import requests
import json
from flask import request, Response
from .Utility import database 
import datetime
import os
import time


class SettingService:
	def __init__(self, app):
		self.db = database.DB()

		@app.route('/get-settings/<uid>/<auth_token>')
		def get_settings(uid, auth_token):
			data = {
				'EUR_to_INR': self.db.convert_money(1,'EUR','INR'),
				'USD_to_EUR': self.db.convert_money(1,'USD','EUR')
            }
			return json.dumps(data)
