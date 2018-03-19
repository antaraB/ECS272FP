'''
(1) change json_tfidf to add : strength
'''

import re
import argparse
import csv
import json
import pickle


# for testing
filename='data/json/@BarackObama_tfidf.json'
# filename=''

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


for i in xrange(clusterlen):
	maxval=max(clusters[i]['moodcount'])
	minval=min(clusters[i]['moodcount'])
	avg=(maxval+minval)/2
	count =len([x for x in clusters[i]['moodcount']  if x>avg ])
	if count>4:
		avg+=1

	if to_print:
		print "Max: {}\nMin: {}\nAvg: {}".format(maxval,minval,avg)
	clusters[i]['mood_score']=[x if x>avg else 0 for x in clusters[i]['moodcount']]
	if to_print:
		print clusters[i]['mood_score']
	clusters[i]['mood_score']=[x*100/float(sum(clusters[i]['moodcount'])) for x in clusters[i]['mood_score']]
	if to_print:
		print clusters[i]['mood_score']
	
with open ('data/json/'+twitterid+'_bubble.json','w') as f:
	json.dump(clusters, f)