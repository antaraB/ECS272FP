'''
(1) Creates dictionary with raw tweet, id, date
(2) Preprocessing on tweets (stemming/lemmatizing)
'''
import re
import argparse
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordLemmatizer
import pickle
#from preprocess import preprocessTweets, createDictFromFile


if __name__=="__main__":
	# for testing
	filename="data/BarackObama_tweets_dict.p"
	#filename=''

	parser=argparse.ArgumentParser()
	parser.add_argument('filename',action='store', help="Complete path of .csv file")
	args=parser.parse_args() 
		
	if not filename:
		filename=args.filename

	# dictionary storing all values 
	tweetdata=pickle.load(open(filename))

	# stem and tokenize words

	stemmer = PorterStemmer()
	lemmatizer = WordLemmatizer()
	for tweet in tweetdata:
		#initializing plutchik vector
		pvec=[0]*8 
		pcount =[0]*8
		#tokenizing
		#words=tweetdata[tweet]['text'].split(' ')
		tokens=word_tokenize(tweetdata[]tweet['text'])
		for t in tokens:

