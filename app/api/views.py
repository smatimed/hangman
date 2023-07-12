from rest_framework.response import Response
from rest_framework.decorators import api_view
import random

from .serializers import wordChosenSerializer

from app.models import wordsList

# import time

class Word(object):
    def __init__(self, valWord, valDefinition, valHint):
        self.word = valWord
        self.definition = valDefinition
        self.hint = valHint


@api_view(['GET'])
def chooseWordRandomly(request, theLang, theDifficulty, wordsListToAvoid):
    """Choisir un mot de façon aléatoire, selon la langue et la difficulté choisies.
    Evite de choisir les mots dans la liste 'wordsListToAvoid'.
    """
    lang_words = wordsList.objects.values_list('id','word','definition','hint').filter(lang=theLang,difficulty=theDifficulty).all()
    
    seuilMax = 100
    # seuilMax : détermine le maximum de fois après quoi la fréquence de choix du mot est remise à zéro
    listNbTimesChosen = wordsList.objects.values_list('nbTimesChosen',flat=True).filter(lang=theLang,difficulty=theDifficulty).all()
    # old 10/07/2023: listPoids = [seuilMax-x for x in listNbTimesChosen]
    listPoids = [seuilMax*(seuilMax-x)-seuilMax+1 for x in listNbTimesChosen]  # permet d'avoir des poids éloignés

    # --- Eviter de choisir les mots dans la liste 'wordsListToAvoid'
    # Pour cela on donne un poids nul pour les mots de la liste
    # print('*** wordsListToAvoid', wordsListToAvoid)
    if wordsListToAvoid != '':   # format: *mot*mot*...*mot*
        for i,mot in enumerate(lang_words):
            # print('*** ',mot[1], type(mot[1]))
            if wordsListToAvoid.find(','+mot[1]+',') > -1:
                # print('*** existe dans liste:',mot[1])
                listPoids[i] = 0

    # Faire de telle sorte que les mots choisis (aléatoirement) soient ceux qui n'ont pas été fréquemment choisis
    # old: randomRecord = lang_words[randrange(len(lang_words))]   // simple random
    randomLine = random.choices(list(range(len(lang_words))), weights=listPoids, k=1)
    theLineChosen = lang_words[randomLine[0]]
    theRecordChosen = wordsList.objects.get(id=theLineChosen[0])

    theRecordChosen.nbTimesChosen +=  1
    if theRecordChosen.nbTimesChosen >= seuilMax:
        theRecordChosen.nbTimesChosen = 0
    theRecordChosen.save()

    theWord = Word(valWord=theRecordChosen.word, valDefinition=theRecordChosen.definition, valHint=theRecordChosen.hint)

    # time.sleep(10): to test a delay in server response

    serializer = wordChosenSerializer(theWord, many=False)
    return Response(serializer.data)



# *old 12/07/2023 : J'ai rajouté la liste historique (d'aujourd'hui) des mots à éviter
# @api_view(['GET'])
# def chooseWordRandomly(request, theLang, theDifficulty):
#     """Choisir un mot de façon aléatoire, selon la langue et la difficulté choisies."""
#     lang_words = wordsList.objects.values_list('id','word','definition','hint').filter(lang=theLang,difficulty=theDifficulty).all()
    
#     seuilMax = 100
#     # seuilMax : détermine le maximum de fois après quoi la fréquence de choix du mot est remise à zéro
#     listNbTimesChosen = wordsList.objects.values_list('nbTimesChosen',flat=True).filter(lang=theLang,difficulty=theDifficulty).all()
#     # old 10/07/2023: listPoids = [seuilMax-x for x in listNbTimesChosen]
#     listPoids = [seuilMax*(seuilMax-x)-seuilMax+1 for x in listNbTimesChosen]  # permet d'avoir des poids éloignés

#     # Faire de telle sorte que les mots choisis (aléatoirement) soient ceux qui n'ont pas été fréquemment choisis
#     # old: randomRecord = lang_words[randrange(len(lang_words))]   // simple random
#     randomLine = random.choices(list(range(len(lang_words))), weights=listPoids, k=1)
#     theLineChosen = lang_words[randomLine[0]]
#     theRecordChosen = wordsList.objects.get(id=theLineChosen[0])

#     theRecordChosen.nbTimesChosen +=  1
#     if theRecordChosen.nbTimesChosen >= seuilMax:
#         theRecordChosen.nbTimesChosen = 0
#     theRecordChosen.save()

#     theWord = Word(valWord=theRecordChosen.word, valDefinition=theRecordChosen.definition, valHint=theRecordChosen.hint)

#     # time.sleep(10): to test a delay in server response

#     serializer = wordChosenSerializer(theWord, many=False)
#     return Response(serializer.data)
