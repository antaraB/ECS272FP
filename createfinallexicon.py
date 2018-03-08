import re
import argparse
import nltk
from nltk.tokenize import word_tokenize

# for testing
nrcfile="lexicon/nrc/NRC-Emotion-Lexicon-Wordlevel-v0.92.txt"
anewfile="lexicon/anew/ANEW2010All.txt"

nrc=[]	
with open(nrcfile) as f:
	emotions=[]
	for i in xrange(10):
		line=f.readline().strip().split('\t')
		if len(line) is 3:
			if i is not 5 and i is not 6:
				emotions.append(line[2])
	nrc.append([line[0], emotions])
	print "a"

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