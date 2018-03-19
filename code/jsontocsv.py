'''
(1) csv: clusterid, date,tweetcount, detail_v
'''

import re
import argparse
import csv
import json

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
addtocsv=[]
# calculate term frequency for each cluster and store it as score
for i in xrange(clusterlen):
	row=[]
	row.append(i)
	row.append(clusters[i]['startdate'])
	row.append(len(clusters[i]['tweets']))
	for val in clusters[i]['detail_v']:
		row.append(val)
	# row =[item for sublist in row for item in sublist]
	addtocsv.append(row)
with open ('data/csv/'+twitterid+'.csv','w') as f:
	writer=csv.writer(f, delimiter=',')
	writer.writerow(['clusterid', 'startdate','tweetcount', 'anger', 'anticipation', 'disgust', 'fear', 'joy', 'sadness', 'surprise', 'trust'])
	for row in addtocsv:
		writer.writerow(row)
