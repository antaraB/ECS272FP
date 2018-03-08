'''
(1) Creates dictionary with raw tweet, id, date
(2) Preprocessing on tweets (stemming+cleaning)
'''
import re
import csv
import argparse
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
import pickle


'''
(1) Creates dictionary with key: tweetid
(2) tweetid { time: tweet_time, text: unicode tweet data}
'''

def createDictFromFile (filename):
	tweetdata={}
	with open(filename) as f:
		tweetlist=list(csv.reader(f))
		for line in tweetlist:
			tweetid=line[0]
			tweetdate=line[1] 
			rawtweet=''.join(line[2:]).decode('utf-8')
			tweetdata[tweetid]={'time':tweetdate, 'text':rawtweet}
	return tweetdata

'''
(1) Remove all not-words
(2) Remove stopwords and convert all to lowercase
(3) Stem/lemmatize?
(4) "Extract keywords" ????
'''
def preprocessTweets (tweetdict):
	stops=stopwords.words('english')
	for tweetid in tweetdict:
		wordtokens=word_tokenize(tweetdict[tweetid]['text'])
		#remove non alphabetical + http
		wordtokens[:]=[word for word in wordtokens if word.isalpha() and word!='http']
		#remove stopwords
		wordtokens[:]=[word.lower() for word in wordtokens if word.lower() not in stops]
		#stemmer = PorterStemmer()
		#wordtokens[:]=[stemmer.stem(word) for word in wordtokens]
		tweetdict[tweetid]['words']=wordtokens
	return tweetdict
		
if __name__=="__main__":

	# for testing
	#filename="data/@BarackObama_tweets.csv"
	filename=''
	parser=argparse.ArgumentParser()
	parser.add_argument('filename', action='store', help="Complete path of .csv file")
	args=parser.parse_args() 
		
	if not filename:
		filename=args.filename

	# dictionary storing all values 
	tweetdict = createDictFromFile(filename)	
	# preprocess tweets
	tweetdict = preprocessTweets(tweetdict)
	# remove filetype
	filename=re.split('\.',filename)[0]
	# store as pickle file
	pickle.dump(tweetdict, open(filename+"_dict.p", 'wb'))
	