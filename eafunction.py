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
	for line in lexicon[1:]:
		if stemmer and stemmer.stem(word)==stemmer.stem(line[0]):
			val.append(line)
		elif not stemmer and word==line[0]:
			val.append(line)
	return val

if __name__=="__main__":
	# for testing
	filename="basic_emotion_plutchik_only.p"
	#filename=''

	parser=argparse.ArgumentParser()
	parser.add_argument('filename',action='store', help="Complete path of pickled (preprocessed tweets) file")
	parser.add_argument('-s','--stemmer', choices=['snowball','porter'], , default='snowball', help=" Select stemmer to be used. Choices: snowball or porter")
	parser.add_argument('-v','--verbose', action='store_true', help=" Will print values at intermediate steps ")

	args=parser.parse_args()

	if not filename:
		filename=args.filename
	to_print=args.verbose
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


		# basicemotion['tweetID']={'vad':[v,a,d], 'plutchik'=[anger,anticipation,disgust,fear,joy,sadness,surprise,trust]}
# modeltype ='vad' or 'plutchik', modelcount= 3 or 8,
def eafunction (tweetdata, basicemotion, modeltype, modelcount, lexicon, to_print ):
	if to_print:
		count=0
		totalcount=float(len(basicemotion))
	for tweetid in basicemotion:
		if to_print:
			print "\nTweetcount: "+str(count)+" of "+str(totalcount)+ " -- "+str(count/totalcount)+"%"
			count+=1
		# pval=[0.0]*8
		values=[0.0]*modelcount
		valuescount=0
		for word in tweetdata[tweetid]['words']:
			res=match(word, lexicon, '')
			# exact match
			if len(res)==1:
				values=[x+float(y) for x,y in zip(values,res[0][1:])]
				valuescount+=1
				if to_print:
					print "Exact match for word: "+word
			# no exact match -> check using lemmatized word
			elif not res:
				res=match(lem.lemmatize(word),lexicon,'')
				if len(res)==1:
					values=[x+float(y) for x,y in zip(values,res[0][1:])]
					valuescount+=1
					if to_print:
						print "Lemmatized match for word: " +word
				# no exact match -> check using stemmer
				else :
					res=match(word, lexicon, sb)
					if len(res)==1:
						values=[x+float(y) for x,y in zip(values,res[0][1:])]
						valuescount+=1
						if to_print:
							print "Stemmed match for word: "+word
					# multiple matches
					elif len(res)>1:
						# check if all have same values values
						# MAKESHIFT: just average out
						resmultiple=[0.0]*modelcount
						for option in res:
							resmultiple=[x+float(y) for x,y in zip(resmultiple,option[1:])]
						resmultiple=[x/len(res) for x in resmultiple]
						values=[x+y for x,y in zip(values,resmultiple)]
						valuescount+=1
						if to_print:
							print word,res,resmultiple
					# else : no matches
					# check with anew? Or wordnet?
		if valuescount:
			values=[x/valuescount for x in values]
			basicemotion[tweetid][modeltype]=values






'''
nrcfile="lexicon/nrc/newnrc.csv"
with open (nrcfile) as f:
	nrclexicon=list(csv.reader(f))

anewfile="lexicon/anew/newanew2010.csv"
with open (anewfile) as f:
	anewlexicon=list(csv.reader(f))
'''
