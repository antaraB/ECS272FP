'''
(1) Creates dictionary with raw tweet, id, date
(2) Preprocessing on tweets (stemming/lemmatizing)
'''
import re
import argparse
#import nltk
#from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, SnowballStemmer, WordNetLemmatizer
import pickle
import csv
#from preprocess import preprocessTweets, createDictFromFile

def match (word, lexicon, stemmer):
	val=[]
	for line in lexicon:
		if stemmer and stemmer.stem(word)==stemmer.stem(line[0]):
			val.append(line)
		elif not stemmer and word==line[0]:
			val.append(line)
	return val

if __name__=="__main__":
	# for testing
	filename="data/@BarackObama_tweets_dict.p"
	#filename=''

	parser=argparse.ArgumentParser()
	parser.add_argument('filename',action='store', help="Complete path of pickled (preprocessed tweets) file")
	parser.add_argument('-s','--stemmer', choices=['snowball','porter'], , default='snowball', help=" Select stemmer to be used. Choices: snowball or porter")
	args=parser.parse_args() 
		
	if not filename:
		filename=args.filename
	'''
	add support for cmd line stemmer
	'''

	# dictionary storing all values 
	tweetdata=pickle.load(open(filename))

	nrcfile="lexicon/nrc/newnrc.csv"
	with open (nrcfile) as f:
		nrclexicon=list(csv.reader(f))
	
	anewfile="lexicon/anew/newanew2010.csv"
	with open (anewfile) as f:
		anewlexicon=list(csv.reader(f))

	ps = PorterStemmer()
	sb = SnowballStemmer("english")
	lem = WordNetLemmatizer()
	

basicemotion={}
	# basicemotion['tweetID']={'vad':[v,a,d], 'plutchik'=[anger,anticipation,disgust,fear,joy,sadness,surprise,trust]}
for tweetid in tweetdata:
	basicemotion[tweetid]={}
	pval=[0.0]*8
	# vad=[0]*3
	for word in tweetdata[tweetid]['words']:
		res=match(word, nrclexicon, '')
		# exact match
		if len(res)==1:
			pval=[x+int(y) for x,y in zip(pval,res[0][1:])]
			print "exact "+word
		# no exact match -> check using lemmatized word
		elif not res:
			res=match(lem.lemmatize(word),nrclexicon,'')
			if len(res)==1:
				pval=[x+int(y) for x,y in zip(pval,res[0][1:])]
				print "lemmatize " +word
			# no exact match -> check using stemmer 
			else :
				res=match(word, nrclexicon, sb)
				if len(res)==1:
					pval=[x+int(y) for x,y in zip(pval,res[0][1:])]
					print "stop "+word
				# multiple matches
				elif len(res)>1:
					# check if all have same plutchik categories
					# MAKESHIFT: just average out
					resmultiple=[0]*8 #int, so will only surface if present in both
					for option in res:
						resmultiple=[x+int(y) for x,y in zip(resmultiple,option[1:])]
					resmultiple=[x/len(res) for x in resmultiple]
					pval=[x+y for x,y in zip(pval,resmultiple)]
					print word,res,pval
				# else : no matches	
				# check with anew? Or wordnet?
	pcount=sum(pval)
	if pcount:
		pval=[x/pcount for x in pval]
		basicemotion[tweetid]['plutchik']=pval




			
	
'''
nrcfile="lexicon/nrc/newnrc.csv"
with open (nrcfile) as f:
	nrclexicon=list(csv.reader(f))

anewfile="lexicon/anew/newanew2010.csv"
with open (anewfile) as f:
	anewlexicon=list(csv.reader(f))
'''