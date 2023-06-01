import requests
import json
from flask import request, Response
from .Utility import database 
import datetime
import os
import time


class UserService:
	def __init__(self, app):
		self.db = database.DB()

		@app.route('/initialize/<uid>/<auth_token>')
		def initialize(uid, auth_token):
			response = self.db.initialize_user_account(uid,auth_token)
			return json.dumps(response)
		
		@app.route('/mark-onboarded/<uid>/<auth_token>')
		def onboard(uid, auth_token):
			response = self.db.mark_onboarded(uid,auth_token)
			return json.dumps(response)
