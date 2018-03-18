'''
(1) Remove entries if either vad or plutchik is missing 
Executes 4.2.2 of paper:
(2) Creates dict: basicemotion[tweetid][[c1,v1,a1,d1],[c2,v2,a2,d2],[...],...,[c8,v8,a8,d8]]
'''

from datetime import datetime
import re
import argparse
import pickle
import csv
import json

def initcluster ():
	cluster={}
	cluster_emotion= [-1]*8
	cluster['startdate']=''
	cluster['enddate']=''
	cluster['moodcount']=[0]*8
	cluster['detail_v']=[0]*8
	cluster['detail_a']=[0]*8
	cluster['detail_d']=[0]*8
	cluster['tweets']=[]
	cluster['vad_score']=[0]*3
	return cluster_emotion, cluster

def addtocluster (cluster, matrix, tweetid, tweetdate):

	if not cluster['startdate'] or datetime.strptime(tweetdate,dateformat)<datetime.strptime(cluster['startdate'],dateformat):
		cluster['startdate']=tweetdate
	if not cluster['enddate'] or datetime.strptime(tweetdate,dateformat)>datetime.strptime(cluster['enddate'],dateformat):
		cluster['enddate']=tweetdate
	for i in xrange(8):
		if matrix[i][0]>0:
			cluster['moodcount'][i]+=1
		cluster['detail_v'][i]+=matrix[i][1]
		cluster['detail_a'][i]+=matrix[i][2]
		cluster['detail_d'][i]+=matrix[i][3]
		cluster['vad_score'] = [x+y for x,y in zip(cluster['vad_score'],matrix[i][1:])]
	
	if tweetid not in cluster['tweets']:
		cluster['tweets'].append(tweetid)
	return cluster

def prepforappend (cluster):
	count = len(cluster['tweets'])
	if not count:
		return {}
	for i in xrange(8):
		cluster['detail_v'][i]/=count
		cluster['detail_a'][i]/=count
		cluster['detail_d'][i]/=count
	cluster['vad_score'] = [x/count for x in cluster['vad_score']]
	return cluster

def underthreshold (cluster, row, vt,at,dt ):
	count = len(cluster['tweets'])
	# if count == 0:
	# 	count=1
	if abs((cluster['detail_v'][i]/count)-row[1]) <= vt and abs((cluster['detail_a'][i]/count)-row[2]) <= at and abs((cluster['detail_d'][i]/count)-row[3]) <= dt:
		return 1
	return 0


# for testing
# csvfilename='data/@katyperry_tweets.csv'
csvfilename=''
picklefilename=''

parser=argparse.ArgumentParser()
parser.add_argument('-c', '--csvfilename',action='store', help="Complete path of tweets csv file")
parser.add_argument('-p','--picklefile',action='store', help="Complete path of pickled (preprocessed tweets) file")
parser.add_argument('-s','--stemmer', choices=['snowball','porter'], default='snowball', help=" Select stemmer to be used. Choices: snowball or porter")
parser.add_argument('-v','--verbose', action='store_true', help=" Will print values at intermediate steps ")
parser.add_argument('-vt','--valence', default=6.0, help=" Value for valence threshold. Default is 1.5 ")
parser.add_argument('-at','--arousal', default=6.7, help=" Value for valence threshold. Default is 2.7 ")
parser.add_argument('-dt','--dominance', default=6.3, help=" Value for valence threshold. Default is 2 ")

args=parser.parse_args()

# if not csvfilename:
csvfilename=args.csvfilename
picklefilename=args.picklefile
to_print=args.verbose
vt=args.valence
at=args.arousal
dt=args.dominance

dateformat='%Y-%m-%d %H:%M:%S'
# Parse file contents to data[]
if not csvfilename and not picklefilename:
	print "Error: Please specify filename"
	exit()

elif csvfilename: 
	with open(csvfilename) as f:
		csvfile=list(csv.reader(f))
	csvfile=csvfile[1:]
	data=sorted(csvfile, key=lambda row: datetime.strptime(row[1],dateformat))
	twitterid=re.findall('\@[^_]+',csvfilename)[0]

elif picklefilename:
	tweetdict=pickle.load(open(picklefilename))
	data=[]
	for tweetid in tweetdict:
		if not tweetid =='id':
			data.append([tweetid, tweetdict[tweetid]['time']])
	data=sorted(data, key=lambda row: datetime.strptime(row[1],dateformat))
	twitterid=re.findall('\@[^_]+',picklefilename)[0]

emotionfilename='data/pickle/'+twitterid+'_basicemotion.p'
basicemotion=pickle.load(open(emotionfilename))

# initialize cluster
clusters=[]	

cluster_emotion,cluster = initcluster()
count=0
clusterexists=False
for row in data:
	tweetid=row[0]
	tweetdate=row[1]
	if tweetid in basicemotion:
		matrix=basicemotion[tweetid]
		if sum(map(sum,matrix))==0:
			if to_print:
				print "{} has been skipped for zero vals".format(tweetid)
			continue
	else :
		continue
	# cluster doesn't exist
	if not clusterexists:
		# add first tweet to cluster 
		cluster=addtocluster(cluster, matrix, tweetid, tweetdate)
		for i in xrange(8):
			cluster_emotion[i]=matrix[i][0]
		clusterexists=True
	else :
		# check 
		addtofinal=False
		for i in xrange(len(matrix)):
			# plutchik matches
			if matrix[i][0]==cluster_emotion[i]:
				addtofinal=True
			# vad < threshold
			elif underthreshold(cluster, matrix[i], vt, at, dt):
				addtofinal=True
			# break off cluster
			else:
				addtofinal=False
				break

		# if tweet fits in cluster, add it
		if addtofinal:
			cluster=addtocluster(cluster, matrix, tweetid, tweetdate)
		# if it doesn't, create new cluster
		else :
			cluster=prepforappend(cluster)
			if cluster:
				clusters.append(cluster)
				if to_print:
					print "{} tweets appended to cluster".format(len(cluster['tweets']))
			cluster_emotion,cluster = initcluster()
			clusterexists=False
			count+=1
				
if to_print:
	print "{} total clusters created".format(count)
with open ('sample.json','w') as f:
	json.dump(clusters, f)