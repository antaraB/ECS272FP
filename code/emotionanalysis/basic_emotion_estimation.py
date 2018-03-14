'''
(1) Remove entries if either vad or plutchik is missing 
Executes 4.2.2 of paper:
(2) Creates dict: basicemotion[tweetid][[c1,v1,a1,d1],[c2,v2,a2,d2],[...],...,[c8,v8,a8,d8]]
'''
import argparse
import pickle
import csv
import re

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
				if tweetid not in newdict:
					newdict[tweetid]={} 
				newdict[tweetid][word]=affexp[tweetid][word]
		if tweetid in newdict:
			print "len(original)={}, len(new)={}".format(len(affexp[tweetid]),len(newdict[tweetid]))
	return newdict
	
def createBasicEmotionMatrix(affexp, basicemotion, to_print):
	if to_print:
		count=1
		totalcount=float(len(affexp))
	for tweetid in affexp:
		if to_print:
			print "\ncreateBasicEmotionMatrix(): Tweetcount:{} of {} -- {}% -- {}".format(count,totalcount,(count*100/totalcount),tweetid)
			count+=1
		matrix=[[0]*4 for n in range(8)]
		num_words=float(len(affexp[tweetid]))
		print "total words: {}".format(num_words)
		for word in affexp[tweetid]:
			for i in xrange(8):
				if affexp[tweetid][word]['plutchik'][i]:
					matrix[i][0]+=1
					matrix[i][1:]=[x+float(y) for x,y in zip(matrix[i][1:],affexp[tweetid][word]['vad'])]
		for i in xrange(8):
			matrix[i]=[x/num_words for x in matrix[i]]
		if to_print:
			print "word: {} Matrix: {}".format(word.encode('utf-8'),matrix)
		basicemotion[tweetid]=matrix	
	return basicemotion

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

	# dictionary storing all values
	affexp=pickle.load(open(filename))

	# remove words if vad or plutchik values are missing
	affexp=cleanEmotionWords(affexp,to_print)

	# basicemotion['tweetID']=[[c1,v1,a1,d1],[c2,v2,a2,d2],[...],...,[c8,v8,a8,d8]]
	basicemotion={}
	basicemotion=createBasicEmotionMatrix(affexp, basicemotion, to_print)
	
	filename=re.split('_',filename)[0]
	pickle.dump(basicemotion, open(filename+"_basicemotion.p", 'wb'))
		
