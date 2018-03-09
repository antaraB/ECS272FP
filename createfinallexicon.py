'''
To create tsv formats for Plutchik's model [word, anger, anticipation, disgust, fear, joy, sadness, surprise, trust]
And ANEW model [word, valence, arousal, dominance]
'''

# Original file locations
nrcfile="lexicon/nrc/NRC-Emotion-Lexicon-Wordlevel-v0.92.txt"
anewfile="lexicon/anew/ANEW2010All.txt"

#create for nrc
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

## untested begin
for line in nrc:
	if sum([int(str) for str in line[1:]]) == 0:
		nrc.remove(line)
## untested end

with open("lexicon/nrc/newnrc.csv",'w') as f:
	f.write("word,anger,anticipation,disgust,fear,joy,sadness,surprise,trust")
	for line in nrc:
		f.write("\n"+str(line[0])+","+','.join(line[1]))

'''
for line in nrclexicon[1:]:
	if sum([int(str) for str in line[1:]]) == 0:
		nrclexicon.remove(line)

with open("lexicon/nrc/newnrc.csv",'w') as f:
	writer=csv.writer(f)
	for line in nrclexicon:
		writer.writerow(line)
'''

#create for anew

anew=[]

with open(anewfile) as f:
	for line in f:
		vad=[]
		line=line.strip().split('\t')
		if len(line) is 8:
			anew.append([line[0],line[2],line[4],line[6]])

with open("lexicon/anew/newanew2010.csv",'w') as f:
	f.write("word,valence,arousal,dominance\n")
	for line in anew:
		f.write("\n"+','.join(line))
