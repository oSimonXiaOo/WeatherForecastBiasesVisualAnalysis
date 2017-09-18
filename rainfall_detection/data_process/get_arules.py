class AssociationRule:
    def __init__(self, dataSet):
        self.sentences = map(set, dataSet)
        self.minSupport = 0.1
        self.minConf = 0.5
        self.numSents = float(len(self.sentences))
        self.supportData = {}
        self.L = []
        self.ruleList = []

    def createC1(self):
        """create candidate itemsets of size 1 C1"""

        C1 = []
        for sentence in self.sentences:
            for word in sentence:
                if not [word] in C1:
                    C1.append([word])
        C1.sort()
        return map(frozenset, C1)

    def scan(self, Ck):
        """generate frequent itemsets Lk from candidate itemsets Ck"""

        wscnt = {}
        retList = []
        # calculate support for every itemset in Ck
        for words in Ck:
            for sentence in self.sentences:
                if words.issubset(sentence):
                    if not wscnt.has_key(words):
                        wscnt[words] = 1
                    else:
                        wscnt[words] += 1

        for key in wscnt:
            support = wscnt[key] / self.numSents
            if support >= self.minSupport:
                retList.append(key)
            self.supportData[key] = support
        self.L.append(retList)

    def aprioriGen(self, Lk, k):
        retList = []
        lenLk = len(Lk)
        for i in range(lenLk):
            for j in range(i + 1, lenLk):
                L1 = list(Lk[i])[:k - 2]
                L2 = list(Lk[j])[:k - 2]
                L1.sort()
                L2.sort()
                if L1 == L2:
                    retList.append(Lk[i] | Lk[j])
        return retList

    def apriori(self):
        """generate a list of frequent itemsets"""

        C1 = self.createC1()
        self.scan(C1)
        k = 2
        while (k <= 3):
            Ck = self.aprioriGen(self.L[k - 2], k)
            self.scan(Ck)
            k += 1

    def generateRules(self):
        """generate a list of rules"""

        for i in range(1, len(self.L)):  # get only sets with two or more items
            for freqSet in self.L[i]:
                H1 = [frozenset([word]) for word in freqSet]
                if (i > 1):
                    self.rulesFromConseq(freqSet, H1)
                else:
                    self.calcConf(freqSet, H1)  # set with two items

    def calcConf(self, freqSet, H):
        """calculate confidence, eliminate some rules by confidence-based pruning"""

        prunedH = []
        for conseq in H:
            conf = self.supportData[freqSet] / self.supportData[freqSet - conseq]
            if conf >= self.minConf:
                print "%s --> %s, conf=%.3f" % (map(str, freqSet - conseq), map(str, conseq), conf)
                self.ruleList.append((freqSet - conseq, conseq, conf))
                prunedH.append(conseq)
        return prunedH

    def rulesFromConseq(self, freqSet, H):
        """generate more association rules from freqSet+H"""

        m = len(H[0])
        if len(freqSet) > m + 1:  # try further merging
            Hmp1 = self.aprioriGen(H, m + 1)  # create new candidate Hm+1
            Hmp1 = self.calcConf(freqSet, Hmp1)
            if len(Hmp1) > 1:
                self.rulesFromConseq(freqSet, Hmp1)
