import re
import argparse

# for testing
filename="data/@BarackObama_tweets.csv"

parser=argparse.ArgumentParser()
parser.add_argument('filename',action='store', help="Complete path of .csv file")
args=parser.parse_args() 
	
if not filename:
	filename=args.filename

#dictionary storing all values 	
tweets={}
with open(filename) as f:
	 line= f.readline().split(',')
	 tweetid=line[0]
	 tweetdate=line[1] 
	 tweetdata=''.join(line[2:]).decode('utf-8')
	 tweets[tweetid]={'time':tweetdate, 'text':tweetdata}