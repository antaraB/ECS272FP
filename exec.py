for tweetid in basicemotion:
	if to_print:
		print "\nTweetcount: "+str(count)+" of "+str(totalcount)+ " -- "+str(count/float(totalcount))+"%"
		count+=1
	# pval=[0.0]*8
	vad=[0]*3
	vcount=0
	for word in tweetdata[tweetid]['words']:
		res=match(word, anewlexicon, '')
		# exact match
		if len(res)==1:
			vad=[x+float(y) for x,y in zip(vad,res[0][1:])]
			vcount+=1
			if to_print:
				print "Exact match for word: "+word
		# no exact match -> check using lemmatized word
		elif not res:
			res=match(lem.lemmatize(word),anewlexicon,'')
			if len(res)==1:
				vad=[x+float(y) for x,y in zip(vad,res[0][1:])]
				vcount+=1
				if to_print:
					print "Lemmatized match for word: " +word
			# no exact match -> check using stemmer
			else :
				res=match(word, anewlexicon, sb)
				if len(res)==1:
					vad=[x+float(y) for x,y in zip(vad,res[0][1:])]
					vcount+=1
					if to_print:
						print "Stemmed match for word: "+word
				# multiple matches
				elif len(res)>1:
					# check if all have same vad values
					# MAKESHIFT: just average out
					resmultiple=[0.0]*3
					for option in res:
						resmultiple=[x+float(y) for x,y in zip(resmultiple,option[1:])]
					resmultiple=[x/len(res) for x in resmultiple]
					vad=[x+y for x,y in zip(vad,resmultiple)]
					vcount+=1
					if to_print:
						print word,res,resmultiple
				# else : no matches
				# check with anew? Or wordnet?
	if vcount:
		vad=[x/vcount for x in vad]
		basicemotion[tweetid]['vad']=vad
