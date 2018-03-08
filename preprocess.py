import re
import argparse
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordLemmatizer

# for testing
filename="data/@BarackObama_tweets.csv"

parser=argparse.ArgumentParser()
parser.add_argument('filename',action='store', help="Complete path of .csv file")
args=parser.parse_args() 
	
if not filename:
	filename=args.filename

# dictionary storing all values 

tweetdata={}

with open(filename) as f:
	 line= f.readline().split(',')
	 tweetid=line[0]
	 tweetdate=line[1] 
	 rawtweet=''.join(line[2:]).decode('utf-8')
	 tweetdata[tweetid]={'time':tweetdate, 'text':rawtweet}

'''
f=open(filename)
line= f.readline().split(',')
tweetid=line[0]
tweetdate=line[1] 
rawtweet=''.join(line[2:]).decode('utf-8')
tweetdata[tweetid]={'time':tweetdate, 'text':rawtweet}
'''

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

