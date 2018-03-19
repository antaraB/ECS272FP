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

	
if __name__=="__main__":

	# for testing
	filename="data/pickle/@BarackObama_tweets_dict.p"
	# filename=''

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
	tweetdict=pickle.load(open(filename))

	twitterid=re.findall('\@[^\_]+',filename)[0]

	# filename='data/json/'+twitterid+'_tfidf.json'
	# clusters=json.load(open(filename))
	# clusterlen= len(clusters)
	final=[]
	for tweetid in tweetdict:
		cluster={'tweetid':tweetid, 'rawtext': tweetdict[tweetid]['text'], 'time':tweetdict[tweetid]['time']}
		final.append(cluster)
	
	with open ('data/json/'+twitterid+'_raw.json','w') as f:
		json.dump(final, f)
		
