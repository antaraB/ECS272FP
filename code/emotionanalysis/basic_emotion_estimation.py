'''
(1) Remove entries if either vad or plutchik is missing 
Executes 4.2.2 of paper:
(2) Creates dict: basicemotion[tweetid][[c1,v1,a1,d1],[c2,v2,a2,d2],[...],...,[c8,v8,a8,d8]]
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

def createBasicEmotionMatrix(affexp, basicemotion, modeltype, modelcount, lexicon, to_print):
	if to_print:
		count=0
		totalcount=float(len(affexp))
	for tweetid in affexp:
		if to_print:
			print "\nTweetcount:{} of {} -- {}%".format(count,totalcount,(count/totalcount))
			count+=1
		matrix=[[0]*4]*8
		num_words=float(len(affexp[tweetid]))
		for word in affexp[tweetid]:
			for i in xrange(8):
				if affexp[tweetid][word]['plutchik'][i]:
					matrix[i][0]+=1
					matrix[i][1:]=[x+y for x,y in zip(matrix[i][1:],affexp[tweetid][word]['vad'])]
		for i in xrange(8):
			matrix[i]=[x/num_words for x in matrix[i]]
		if to_print:
			print "word: {} Matrix: {}".format(word,matrix)
		basicemotion[tweetid]=matrix	
				
	return basicemotion

if __name__=="__main__":
	# for testing
	filename="data/pickle/@BarackObama_tweets_dict_affexp.p"
	filename=''

	parser=argparse.ArgumentParser()
	parser.add_argument('filename',action='store', help="Complete path of pickled (preprocessed tweets) file")
	parser.add_argument('-s','--stemmer', choices=['snowball','porter'], default='snowball', help=" Select stemmer to be used. Choices: snowball or porter")
	args=parser.parse_args()

	if not filename:
		filename=args.filename


	'''
	add support for cmd line stemmer
	'''

	# dictionary storing all values
	affexp=pickle.load(open(filename))

	nrcfile="lexicon/nrc/newnrc.csv"
	with open (nrcfile) as f:
		nrclexicon=list(csv.reader(f))

	anewfile="lexicon/anew/newanew2010.csv"
	with open (anewfile) as f:
		anewlexicon=list(csv.reader(f))

	ps = PorterStemmer()
	sb = SnowballStemmer("english")
	lem = WordNetLemmatizer()


	# basicemotion['tweetID']=[[c1,v1,a1,d1],[c2,v2,a2,d2],[...],...,[c8,v8,a8,d8]]
	basicemotion={}
	# plutchik
	basicemotion=affexpdetection(affexp, basicemotion, 'plutchik', 8, nrclexicon, 1)
	# vad
	# affexp=affexpdetection(affexp, basicemotion, 'vad', 3, anewlexicon, 1)

	filename=filename[:len(filename)-10]
	pickle.dump(basicemotion, open(filename+"_basicemotion.p", 'wb'))
		# affexp['tweetID']['word']={vad':[v,a,d], 'plutchik'=[anger,anticipation,disgust,fear,joy,sadness,surprise,trust]}
