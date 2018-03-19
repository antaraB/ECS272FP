'''
Form clusters from tweets 
'''

from datetime import datetime
import re
import argparse
import pickle
import csv
import json

dateformat='%Y-%m-%d %H:%M:%S'

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
parser.add_argument('-vt','--valence', default=1.5, help=" Value for valence threshold. Default is 1.5 ")
parser.add_argument('-at','--arousal', default=2.0, help=" Value for valence threshold. Default is 2.7 ")
parser.add_argument('-dt','--dominance', default=2.3, help=" Value for valence threshold. Default is 2 ")
parser.add_argument('-y','--year', default=2017, help=" Filter for this year (default 2017)")
parser.add_argument('-m','--month', default=-1, help=" Filter FROM this month")

args=parser.parse_args()
# if not csvfilename:
csvfilename=args.csvfilename
picklefilename=args.picklefile
to_print=args.verbose
vt=float(args.valence)
at=float(args.arousal)
dt=float(args.dominance)
filteryear=int(args.year)
filtermonth=int(args.month)

if to_print:
	print "Valence threshold is {}\nArousal threshold is {}\nDominance threshold is {}".format(vt,at,dt)

# Parse file contents to data[]
if not csvfilename and not picklefilename:
	print "Error: Please specify filename"
	exit()

elif csvfilename: 
	if to_print:
		print "CSV file chosen: {}".format(csvfilename)
	with open(csvfilename) as f:
		csvfile=list(csv.reader(f))
	data=csvfile[1:]
	# data=sorted(data, key=lambda row: datetime.strptime(row[1],dateformat))
	twitterid=re.findall('\@[^_]+',csvfilename)[0]

elif picklefilename:
	if to_print:
		print "Pickled file chosen: {}".format(picklefilename)
	tweetdict=pickle.load(open(picklefilename))
	data=[]
	for tweetid in tweetdict:
		if not tweetid =='id':
			data.append([tweetid, tweetdict[tweetid]['time']])
	twitterid=re.findall('\@[^_]+',picklefilename)[0]

count=0
year=0
data=sorted(data, key=lambda row: datetime.strptime(row[1],dateformat))

for row in data:
	if datetime.strptime(row[1],dateformat).year>year:
		print "{} tweets in year {}".format(count,year)
		year=datetime.strptime(row[1],dateformat).year
		count=0
	else:
		count+=1

finaldata=[row for row in data if datetime.strptime(row[1],dateformat).year==filteryear]
data=sorted(finaldata, key=lambda row: datetime.strptime(row[1],dateformat))

emotionfilename='data/pickle/'+twitterid+'_basicemotion.p'
basicemotion=pickle.load(open(emotionfilename))

# initialize cluster
clusters=[]	

cluster_emotion,cluster = initcluster()

count=0
clusterexists=False
if not filtermonth==-1:
	filterformonth=True
else :
	filterformonth=False
for row in data:
	tweetid=row[0]
	tweetdate=row[1]
	
	if not datetime.strptime(tweetdate,dateformat).year==filteryear:
		if to_print:
			print "{} is skipped".format(tweetdate)
		continue
	elif filterformonth and datetime.strptime(tweetdate,dateformat).month<filtermonth:
		if to_print:
			print "{} is skipped".format(tweetdate)
		continue
	
	if tweetid in basicemotion:
		# if to_print:
		# 	print "{} in basicemotion".format(tweetid)
		matrix=basicemotion[tweetid]
		if sum(map(sum,matrix))==0:
			if to_print:
				print "{} has been skipped due to zero vals".format(tweetid)
			continue
	else :
		# if to_print:
		# 	print "{} not in basicemotion".format(tweetid)
		continue
	# cluster doesn't exist
	if not clusterexists:
		if to_print:
			print "Cluster doesn't exist, starting new with {}".format(tweetid)
		# add first tweet to cluster 
		cluster=addtocluster(cluster, matrix, tweetid, tweetdate)
		for i in xrange(8):
			cluster_emotion[i]=matrix[i][0]
		clusterexists=True
	else :
		# check 
		# if to_print:
		# 	print "Cluster exists {}".format(cluster)
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
			if to_print:
				print "{} added to cluster ".format(tweetdate)
		# if cluster length is too small, add on to it
		elif len(cluster['tweets'])<10 :
			cluster=addtocluster(cluster, matrix, tweetid, tweetdate)
			if to_print:
				print "{} added to cluster ".format(tweetdate)
			continue
		# if it doesn't, create new cluster
		else :
			cluster=prepforappend(cluster)
			if cluster:
				clusters.append(cluster)
				if to_print:
					print "{} tweets appended to cluster".format(len(cluster['tweets']))
			cluster_emotion,cluster = initcluster()
			count+=1
			cluster=addtocluster(cluster, matrix, tweetid, tweetdate)
			if to_print:
				print "{} added to cluster ".format(tweetdate)
			clusterexists=True

if cluster:
	clusters.append(cluster)
	if to_print:
		print "{} tweets appended to cluster".format(len(cluster['tweets']))
				
if to_print:
	print "{} total clusters created".format(count)

with open ('data/json/'+twitterid+'.json','w') as f:
	json.dump(clusters, f)
