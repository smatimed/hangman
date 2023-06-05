from rest_framework.response import Response
from rest_framework.decorators import api_view
import random

from .serializers import wordChosenSerializer

from app.models import wordsList


class Word(object):
    def __init__(self, valWord, valDefinition, valHint):
        self.word = valWord
        self.definition = valDefinition
        self.hint = valHint


@api_view(['GET'])
def chooseWordRandomly(request, theLang, theDifficulty):
    """Choisir un mot de façon aléatoire, selon la langue et la difficulté choisies."""
    lang_words = wordsList.objects.values_list('id','word','definition','hint').filter(lang=theLang,difficulty=theDifficulty).all()
    
    seuilMax = 10
    listNbTimesChosen = wordsList.objects.values_list('nbTimesChosen',flat=True).filter(lang=theLang,difficulty=theDifficulty).all()
    listPoids = [seuilMax-x for x in listNbTimesChosen]

    # old: randomRecord = lang_words[randrange(len(lang_words))]   // simple random
    randomLine = random.choices(list(range(len(lang_words))), weights=listPoids, k=1)
    theLineChosen = lang_words[randomLine[0]]
    theRecordChosen = wordsList.objects.get(id=theLineChosen[0])

    theRecordChosen.nbTimesChosen +=  1
    if theRecordChosen.nbTimesChosen >= seuilMax:
        theRecordChosen.nbTimesChosen = 0
    theRecordChosen.save()

    theWord = Word(valWord=theRecordChosen.word, valDefinition=theRecordChosen.definition, valHint=theRecordChosen.hint)

    serializer = wordChosenSerializer(theWord, many=False)
    return Response(serializer.data)