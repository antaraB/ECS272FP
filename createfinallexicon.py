import re
import argparse
import nltk
from nltk.tokenize import word_tokenize

# for testing
nrcfile="lexicon/nrc/NRC-Emotion-Lexicon-Wordlevel-v0.92.txt"
anewfile="lexicon/anew/ANEW2010All.txt"

#created newnrc
nrc=[]	
with open(nrcfile) as f:
	emotions=[]
	word=''
	for line in f:
		line=line.strip().split('\t')
		if len(line) is 3:
			if not word:
				word=line[0]
			elif word != line[0] or len(emotions) is 8:
				nrc.append([word,emotions])
				word=line[0]
				emotions=[]
			if line[1] not in ['positive', 'negative']:
					emotions.append(line[2])

with open("lexicon/nrc/newnrc.txt",'w') as f:
	f.write("word\tanger\tanticipation\tdisgust\tfear\tjoy\tsadness\tsurprise\ttrust\n")
	for line in nrc:
		f.write("\n"+str(line[0])+"\t"+'\t'.join(line[1]))

#create anew

anew=[]

with open(anewfile) as f:
	for line in f:
		vad=[]
		line=line.strip().split('\t')
		if len(line) is 8:
			anew.append([line[0],line[2],line[4],line[6]])

with open("lexicon/anew/newanew2010.txt",'w') as f:
	f.write("word\tvalence\tarousal\tdominance\n")
	for line in anew:
		f.write("\n"+'\t'.join(line))
