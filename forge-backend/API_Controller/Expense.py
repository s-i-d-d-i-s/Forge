import requests
import json
from flask import request, Response
from .Utility import database 
import datetime
import os
import random
from datetime import datetime
from dateutil import parser


class ExpenseService:
	def __init__(self, app):
		self.db = database.DB()

		

		@app.route('/get-accounts-overview/<uid>/<auth_token>/<currency>')
		def get_accounts_overview(uid, auth_token, currency):
			accounts = self.db.get_accounts_overview(uid,auth_token,currency)
			return json.dumps(accounts)
		

		@app.route('/get-accounts/<uid>/<auth_token>')
		def get_accounts(uid, auth_token):
			accounts = self.db.get_accounts(uid,auth_token)
			return json.dumps(accounts)
		
		@app.route('/get-expenses/<uid>/<auth_token>/<currency>')
		def get_expenses(uid, auth_token, currency):
			expenses = self.db.get_expenses(uid,auth_token)
			for expense in expenses:
				expense['amount'] = round(self.db.convert_money(expense['amount'],expense['currency'],currency),2)
			return json.dumps(expenses)
		
		@app.route('/get-net-worth-history/<uid>/<auth_token>/<currency>')
		def get_net_worth_history(uid, auth_token, currency):
			expenses = self.db.get_expenses(uid,auth_token)
			stocks = self.db.get_stocks(uid,auth_token)
			history = []
			for expense in expenses:
				history.append([expense['timestamp'], self.db.convert_money(expense['amount'],expense['currency'],currency), expense['amountType']])

			for stock in stocks:
				history.append([stock['timestamp'], float(stock['amount'])*self.db.get_price(stock['name'],currency), "Credit"])

			history = sorted(history,key=lambda x:parser.isoparse(x[0]).strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
			response = []
			total_net_worth = 0
			for obj in history:
				amount = obj[1]
				if obj[2] == "Debit":
					amount *= -1
				total_net_worth += amount
				response.append([parser.isoparse(obj[0]).strftime('%d-%m-%Y'), round(total_net_worth,2)])

			print(total_net_worth)
			return json.dumps(response)
		
		@app.route('/undo-expense/<uid>/<auth_token>')
		def undo_expense(uid, auth_token):
			self.db.undo_last_expense(uid, auth_token)
			return json.dumps("Undo Success")