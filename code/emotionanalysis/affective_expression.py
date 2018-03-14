'''
(1) Executes 4.2.1 of paper
(2) Creates dict: affexp[tweetid]=[{word: 'textofword', vad=[], plutchik=[]},]

## issues:
Doesn't take into account user's choice of stemmer
No WordNet matching
'''

import re
import argparse
from nltk.stem import PorterStemmer, SnowballStemmer, WordNetLemmatizer
import pickle
import csv

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
		count=1
		totalcount=float(len(tweetdata))
	for tweetid in tweetdata:
		if to_print:
			print "\n{}: Tweetcount: {} of {} -- {}%".format(modeltype,count,totalcount,(count*100/totalcount))
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
	parser.add_argument('-s','--stemmer', choices=['snowball','porter'], default='snowball', help=" Select stemmer to be used. Choices: snowball or porter")
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


	# affexp['tweetID']['word']={vad':[v, a, d], 'plutchik'=[anger, anticipation, disgust, fear, joy, sadness, surprise, trust]}
	affexp={}
	# plutchik
	affexp=affexpdetection(tweetdata, affexp, 'plutchik', 8, nrclexicon, to_print)
	# vad
	affexp=affexpdetection(tweetdata, affexp, 'vad', 3, anewlexicon, to_print)

	#renaming the file + storing a pickled version
	filename=re.split('_',filename)[0]
	pickle.dump(affexp, open(filename+"_affexp.p", 'wb'))
