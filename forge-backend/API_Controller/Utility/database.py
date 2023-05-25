import os
import requests
import json
import time

class DB:
	def __init__(self):
		self.db = os.getenv('forge_db_url')
		self.prices = {}


	def convert_money(self,amount,currency_1,currency_2):
		forex_to_USD = {
			'EUR' : 0.93,
			'INR' : 82.76
		}
		if currency_1 != 'USD':
			amount = forex_to_USD[currency_1]

		
		if currency_2 != 'USD':
			amount *= forex_to_USD[currency_2]
		
		return amount
		

	def get_price(self, symbol,currency):
		GAP = 5 # minutes
		if symbol in self.prices:
			print("Getting price of "+ symbol + ' from cache')
			fetched_at = self.prices[symbol][0]
			gap = int(time.time()) - fetched_at
			if gap < GAP *60:
				return self.convert_money(self.prices[symbol][1], 'USD', currency)
		current_price = 'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=cdejmo2ad3i8vpup3i2gcdejmo2ad3i8vpup3i30'
		value = json.loads(requests.get(current_price).content)['c']
		self.prices[symbol] = [int(time.time()), value]
		print("Getting fresh price of "+ symbol)
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