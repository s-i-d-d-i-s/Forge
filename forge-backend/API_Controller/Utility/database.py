import os
import requests
import json

class DB:
	def __init__(self):
		self.db = os.getenv('forge_db_url')

	def convert_money(self,amount,currency_1,currency_2):
		
		if currency_1 == currency_2:
			return amount
		
		USD_to_FX = {
			'EUR' : 0.90,
			'INR' : 82.02
		}
		if currency_1 != 'USD':
			amount /= USD_to_FX[currency_1]

		
		if currency_2 != 'USD':
			amount *= USD_to_FX[currency_2]
		
		return amount
		

	def get_price(self, symbol,currency):
		GAP = 5 # minutes		
		current_price = 'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=cdejmo2ad3i8vpup3i2gcdejmo2ad3i8vpup3i30'
		value = json.loads(requests.get(current_price).content)['c']
		return self.convert_money(value, 'USD', currency)
	
	def get_stock_overview(self,uid,user_token):
		stocks = {}
		stock_list = self.get_stocks(uid,user_token)
		for stock in stock_list:
			if stock['name'] in stocks:
				stocks[stock['name']]['amount'] += float(stock['amount'])
			else:
				stocks[stock['name']] = {'amount': 0}
				stocks[stock['name']]['amount'] += float(stock['amount'])
		return stocks
	
	def get_stocks(self,uid,user_token):
		url = self.db + 'users/<<uid>>/investment.json'.replace('<<uid>>', uid)
		url = url + '?auth=' + user_token + '&uid=' + uid
		data = json.loads(requests.get(url).content)
		stocks = []
		for d in data:
			stocks.append(data[d])
		return stocks
	


	def get_expenses(self,uid,user_token):
		url = self.db + 'users/<<uid>>/expenses.json'.replace('<<uid>>', uid)
		url = url + '?auth=' + user_token + '&uid=' + uid
		data = json.loads(requests.get(url).content)
		expenses = []
		for d in data:
			expenses.append(data[d])
		return expenses

	def get_assets(self,uid,user_token):
		url = self.db + 'users/<<uid>>/assets.json'.replace('<<uid>>', uid)
		url = url + '?auth=' + user_token + '&uid=' + uid
		data = json.loads(requests.get(url).content)
		assets = []
		for d in data:
			assets.append(data[d])
		return assets
	
	def get_accounts(self,uid,user_token):
		url = self.db + 'users/<<uid>>/accounts.json'.replace('<<uid>>', uid)
		url = url + '?auth=' + user_token + '&uid=' + uid
		
		data = json.loads(requests.get(url).content)
		accounts = []
		for d in data:
			accounts.append(data[d])
		return accounts
	
	def get_accounts_overview(self,uid,user_token,viewing_currency):
		
		expenses = self.get_expenses(uid,user_token)
		accounts_list = self.get_accounts(uid,user_token)
		accounts = {}
		for exp in expenses:
			account = exp['account']
			amount = exp['amount']
			currency = exp['currency']
			amountType = exp['amountType']
			if account not in accounts:
				accounts[account] = {'currency':currency,'amount':0}
			if amountType == 'Debit':
				amount *= -1
			accounts[account]['amount'] += amount
		
		for account in accounts_list:
			if account['closed'] and account['name'] in accounts:
				accounts.pop(account['name'])

		response = []
		for account in accounts:
			obj = accounts[account]
			obj['name'] = account
			obj['amount'] = round(self.convert_money(obj['amount'], obj['currency'], viewing_currency),2)
			print(obj,obj['currency'], viewing_currency)
			response.append(obj)
		response = sorted(response,key=lambda x: x['amount'],reverse=True)
		return response
	
	def undo_last_expense(self,uid,user_token):
		url = self.db + 'users/<<uid>>/expenses.json'.replace('<<uid>>', uid)
		url = url + '?auth=' + user_token + '&uid=' + uid
		last_key = list(json.loads(requests.get(url + '&orderBy="$key"&limitToLast=1').content).keys())[0]
		delete_url = self.db + f'users/{uid}/expenses/{last_key}.json?auth={user_token}&uid={uid}'
		print(requests.delete(delete_url))
		



	def get_settings(self,uid,user_token):
		url = self.db + f'users/{uid}/settings.json?auth={user_token}&uid={uid}'
		data = json.loads(requests.get(url).content)
		return data
	
	def mark_onboarded(self,uid,user_token):
		url = self.db + f'users/{uid}/settings.json?auth={user_token}&uid={uid}'
		data = {	
			'onboarded': True
		}
		response = requests.put(url,json.dumps(data))
		if response.status_code != 200:
			return False
		return True
	
	def initialize_user_account(self,uid,user_token):
		url = self.db + f'users/{uid}.json?auth={user_token}&uid={uid}'
		old_data = json.loads(requests.get(url).content)
		if old_data == None:
			data = {
				'accounts' : [],
				'expenses' : [],
				'investment': [],
				'settings': {
					'EUR_to_INR' : 88,
					'USD_to_EUR' : 1,
					'monthly_cap': 1600,
					'onboarded': False
				}
			}
			response = requests.put(url,json.dumps(data))
			if response.status_code != 200:
				return False
		return True
