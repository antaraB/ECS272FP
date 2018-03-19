'''
(1) For each tweet cluster, get all words from tweets
(2) Perform tf-idf on document
(3) Add to json file
'''

import re
import argparse
import pickle
import json
from nltk.tokenize import word_tokenize
from math import log

def countofdocs(term, collectionofdocs):
	count=0
	for document in collectionofdocs:
		if term in document:
			count+=1
	return count

# for testing
# filename='data/json/@BarackObama.json'
filename=''

parser=argparse.ArgumentParser()
parser.add_argument('filename',action='store', help="Complete path of json file")
parser.add_argument('-v','--verbose', action='store_true', help=" Will print values at intermediate steps ")

args=parser.parse_args()
if not filename:
	filename=args.filename
to_print=args.verbose

clusters=json.load(open(filename))
clusterlen= len(clusters)
twitterid=re.findall('\@[^\.]+',filename)[0]
tweetfile='data/pickle/'+twitterid+'_tweets_dict.p'
tweetdict=pickle.load(open(tweetfile))
collectionofdocs=[]

# calculate term frequency for each cluster and store it as score
for i in xrange(clusterlen):
	document=[]
	# collect all words from tweet-cluster
	for tweetid in clusters[i]['tweets']:
		wordtokens=word_tokenize(tweetdict[tweetid]['text'])
		# remove non alphabetical + http
		wordtokens[:]=[word.lower() for word in wordtokens if word.isalpha() and word!='http' and word!='https']
		# appending one tweet
		document.append(wordtokens)
	
	# flattening out words in one tweet segment aka one document
	document=[word for tweet in document for word in tweet]
	allwords=list(set(document))
	clusters[i]['tfidf']=[]

	# add term-frequency values for each word to cluster
	for word in allwords:
		termfreq= document.count(word)/float(len(document))
		clusters[i]['tfidf'].append({'word':word, 'score':termfreq})
	
	# adding to total collection
	collectionofdocs.append(document)
	if to_print:
		print "Term frequency calculated for cluster {} of {} : {} %".format(i+1, clusterlen, (i+1)*100/float(clusterlen))

# multiply each termfrequency with idf to get final score
for i in xrange(clusterlen):
	# for each document/tweet cluster
	for j in xrange(len(clusters[i]['tfidf'])):
		word=clusters[i]['tfidf'][j]['word']
		termfreq=clusters[i]['tfidf'][j]['score']
		invdocfreq=log(len(collectionofdocs)/float(countofdocs(word, collectionofdocs)))
		clusters[i]['tfidf'][j]['score']=termfreq*invdocfreq
	if to_print:
		print "TF-IDF calculated for cluster {} of {} : {} %".format(i+1, clusterlen, (i+1)*100/float(clusterlen))


with open ('data/json/'+twitterid+'_tfidf.json','w') as f:
	json.dump(clusters, f)
