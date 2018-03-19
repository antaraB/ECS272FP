'''
(1) change json_tfidf to add : strength
'''

import re
import argparse
import csv
import json
import pickle


# for testing
# filename='data/json/@BarackObama_tfidf.json'
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
plutchik=['anger', 'anticipation', 'disgust', 'fear', 'joy', 'sadness', 'surprise', 'trust']

for i in xrange(clusterlen):
	clusters[i]['clusterid']=i
	maxval=max(clusters[i]['moodcount'])
	minval=min(clusters[i]['moodcount'])
	avg=(maxval+minval)/2
	avg+=1
	count =len([x for x in clusters[i]['moodcount']  if x>avg ])
	if count==0:
		avg-=1

	if to_print:
		print "Max: {}\nMin: {}\nAvg: {}".format(maxval,minval,avg)
	mood_score=[x if x>avg else 0 for x in clusters[i]['moodcount']]
	if to_print:
		print mood_score
	mood_score=[x*100/float(sum(mood_score)) for x in mood_score]
	clusters[i]['mood_score']=[]
	for j in xrange(8):
		clusters[i]['mood_score'].append({'emotion':plutchik[j], 'score':mood_score[j]})
	if to_print:
		print clusters[i]['mood_score']
	
with open ('data/json/'+twitterid+'_bubble.json','w') as f:
	json.dump(clusters, f)