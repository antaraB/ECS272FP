'''
(1) Executes 4.2.1 of paper
(2) Creates dict: affexp[tweetid]=[{word: 'textofword', vad=[], plutchik=[]},]
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

def affexpdetection(tweetdata, affexp, modeltype, modelcount, lexicon, to_print):
	if to_print:
		count=0
		totalcount=float(len(tweetdata))
	for tweetid in tweetdata:
		if to_print:
			print "\nTweetcount:{} of {} -- {}%".format(count,totalcount,(count/totalcount))
			count+=1
		if tweetid not in affexp:
			affexp[tweetid]={}
		values=[0]*modelcount
		for word in tweetdata[tweetid]['words']:
			res=match(word, lexicon, '')
			# exact match
			if len(res)==1:
				values=res[0][1:]
				if to_print:
					print "Exact match for: {}".format(word)
			# no exact match -> check using lemmatized word
			elif not res:
				res=match(lem.lemmatize(word),lexicon,'')
				if len(res)==1:
					values=res[0][1:]
					if to_print:
						print "Lemmatized match for: {}" .format(word)
				# no exact match -> check using stemmer
				else :
					res=match(word, lexicon, sb)
					if len(res)==1:
						values=res[0][1:]
						if to_print:
							print "Stemmed match for: {}".format(word)
					# multiple matches
					elif len(res)>1:
						# check if all have same values values
						# MAKESHIFT: just average out
						resmultiple=[0]*modelcount
						for option in res:
							resmultiple=[x+float(y) for x,y in zip(resmultiple,option[1:])]
						resmultiple=[x/len(res) for x in resmultiple]
						values=resmultiple
						if to_print:
							print "Multiple values for {}:{}: FINAL:{}".format(word,res,resmultiple)
					# else : no matches
					# check with anew? Or wordnet?
				if modeltype=='plutchik':
					values=[int(x) for x in values]
				if word not in affexp[tweetid]:
					affexp[tweetid][word]={}
				affexp[tweetid][word][modeltype]=values
	return affexp

if __name__=="__main__":
	# for testing
	# filename="data/pickle/@BarackObama_tweets_dict.p"
	filename=''

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


	affexp={}
	# plutchik
	affexp=affexpdetection(tweetdata, affexp, 'plutchik', 8, nrclexicon, 1)
	# vad
	affexp=affexpdetection(tweetdata, affexp, 'vad', 3, anewlexicon, 1)

		# affexp['tweetID']['word']={vad':[v,a,d], 'plutchik'=[anger,anticipation,disgust,fear,joy,sadness,surprise,trust]}
'''	for tweetid in tweetdata:
		affexp[tweetid]={}
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
			affexp[tweetid]['plutchik']=pval'''

# affexp['tweetID']['word']={vad':[v, a, d], 'plutchik'=[anger, anticipation, disgust, fear, joy, sadness, surprise, trust]}



'''
nrcfile="lexicon/nrc/newnrc.csv"
with open (nrcfile) as f:
	nrclexicon=list(csv.reader(f))

anewfile="lexicon/anew/newanew2010.csv"
with open (anewfile) as f:
	anewlexicon=list(csv.reader(f))
'''
