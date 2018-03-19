'''
(1) Remove entries if either vad or plutchik is missing 
Executes 4.2.2 of paper:
(2) Creates dict: basicemotion[tweetid][[c1,v1,a1,d1],[c2,v2,a2,d2],[...],...,[c8,v8,a8,d8]]
'''
import argparse
import pickle
import csv
import re
# from basic_emotion_estimation import cleanEmotionWords
import json

def cleanEmotionWords (affexp, to_print):
	newdict={}
	if to_print:
		count=1
		totalcount=float(len(affexp))
	for tweetid in affexp:
		if to_print:
			print "\ncleanEmotionWords(): Tweetcount:{} of {} -- {}%: tweetID: {}".format(count,totalcount,(count*100/totalcount), tweetid)
			count+=1
		for word in affexp[tweetid]:
			if len(affexp[tweetid][word])==2:
				if sum(affexp[tweetid][word]['vad'])>0 and sum(affexp[tweetid][word]['plutchik'])>0: 
					if tweetid not in newdict:
						newdict[tweetid]={} 
					newdict[tweetid][word]=affexp[tweetid][word]
		if tweetid in newdict:
			print "len(original)={}, len(new)={}".format(len(affexp[tweetid]),len(newdict[tweetid]))
	return newdict
	
def iswordinwords (word,words):
	for i in xrange(len(words)):
		if word == words[i]['word']:
			return 1
		else :
			print "{} is not {}".format(word, words[i]['word'])
	return 0

if __name__=="__main__":

	# for testing
	# filename="data/pickle/@BarackObama_affexp.p"
	filename=''

	parser=argparse.ArgumentParser()
	parser.add_argument('filename',action='store', help="Complete path of pickled (processed tweets) file")
	parser.add_argument('-v','--verbose', action='store_true', help=" Will print values at intermediate steps ")
	args=parser.parse_args()

	if not filename:
		filename=args.filename
	to_print=args.verbose
	# affexp['tweetID']['word']={vad':[v, a, d], 'plutchik'=[anger, anticipation, disgust, fear, joy, sadness, surprise, trust]}
	
	# clusterid , tweetid, tweettext, word, v, a, d, plutchik[]
	# dictionary storing all values
	affexp=pickle.load(open(filename))

	# remove words if vad or plutchik values are missing
	affexp=cleanEmotionWords(affexp,to_print)

	twitterid=re.findall('\@[^\_]+',filename)[0]

	filename='data/json/'+twitterid+'_tfidf.json'
	clusters=json.load(open(filename))
	clusterlen= len(clusters)

	filename='data/pickle/'+twitterid+'_tweets_dict.p'
	tweetdict=pickle.load(open(filename))
	

	final=[]
	for i in xrange(clusterlen):
		cluster=[]
		# cluster[i]=[]
		for tweetid in clusters[i]['tweets']:
			words=[]
			for word in affexp[tweetid]:
				if not iswordinwords(word,words):
					words.append({'word':word, 'vad':affexp[tweetid][word]['vad'], 'plutchik':affexp[tweetid][word]['plutchik']})
			tweet={'tweetid':tweetid,'words':words, 'tweet': tweetdict[tweetid]['text'], 'tweetdate':tweetdict[tweetid]['time']}
			cluster.append(tweet)
		final.append(cluster)
	with open ('data/json/'+twitterid+'_scatter.json','w') as f:
		json.dump(final, f)
		
