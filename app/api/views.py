from rest_framework.response import Response
from rest_framework.decorators import api_view
import random

from .serializers import wordChosenSerializer, tempsUtiliseSerializer, tempsMajSerializer, tempsAjouterSerializer

from app.models import wordsList

from configparser import ConfigParser
from os.path import exists
from datetime import datetime
# from django.conf import settings


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
    lang_words = wordsList.objects.values_list('id', 'word', 'definition', 'hint').filter(
        lang=theLang, difficulty=theDifficulty).all()

    seuilMax = 100
    # seuilMax : détermine le maximum de fois après quoi la fréquence de choix du mot est remise à zéro
    listNbTimesChosen = wordsList.objects.values_list(
        'nbTimesChosen', flat=True).filter(lang=theLang, difficulty=theDifficulty).all()
    # old 10/07/2023: listPoids = [seuilMax-x for x in listNbTimesChosen]
    # permet d'avoir des poids éloignés
    listPoids = [seuilMax*(seuilMax-x)-seuilMax+1 for x in listNbTimesChosen]

    # --- Eviter de choisir les mots dans la liste 'wordsListToAvoid'
    # Pour cela on donne un poids nul pour les mots de la liste
    # print('*** wordsListToAvoid', wordsListToAvoid)
    if wordsListToAvoid != '':   # format: *mot*mot*...*mot*
        for i, mot in enumerate(lang_words):
            # print('*** ',mot[1], type(mot[1]))
            if wordsListToAvoid.find(','+mot[1]+',') > -1:
                # print('*** existe dans liste:',mot[1])
                listPoids[i] = 0

    # Faire de telle sorte que les mots choisis (aléatoirement) soient ceux qui n'ont pas été fréquemment choisis
    # old: randomRecord = lang_words[randrange(len(lang_words))]   // simple random
    randomLine = random.choices(
        list(range(len(lang_words))), weights=listPoids, k=1)
    theLineChosen = lang_words[randomLine[0]]
    theRecordChosen = wordsList.objects.get(id=theLineChosen[0])

    theRecordChosen.nbTimesChosen += 1
    if theRecordChosen.nbTimesChosen >= seuilMax:
        theRecordChosen.nbTimesChosen = 0
    theRecordChosen.save()

    theWord = Word(valWord=theRecordChosen.word,
                   valDefinition=theRecordChosen.definition, valHint=theRecordChosen.hint)

    # time.sleep(10): to test a delay in server response

    serializer = wordChosenSerializer(theWord, many=False)
    return Response(serializer.data)


# ^ ------------------------------------------------------------------------ Mot de passe (Anes)
class TempsUtilise(object):
    def __init__(self, valTemps):
        self.temps = valTemps


class TempsMaj(object):
    def __init__(self, valUtilisateur, valTemps):
        self.utilisateur = valUtilisateur
        self.temps = valTemps


class TempsAjouter(object):
    def __init__(self, valUtilisateur, valTempsAdditionnel):
        self.utilisateur = valUtilisateur
        self.tempsAdditionnel = valTempsAdditionnel

# ^ ---------------------------- ini file (debut)


def creerIniFile(utilisateur):
    config = ConfigParser()
    config.read('temps.ini')
    # config.read(settings.BASE_DIR+'\\temps.ini')

    if not config.has_section(utilisateur):
        config.add_section(utilisateur)
    config.set(utilisateur, 'date', '01/01/2000')
    config.set(utilisateur, 'temps utilise', '0')
    config.set(utilisateur, 'temps additionnel', '0')

    with open('temps.ini', 'w') as configfile:
        config.write(configfile)


def lireTempsUtiliseIniFile(utilisateur):
    config = ConfigParser()
    config.read('temps.ini')
    # config.read(settings.BASE_DIR+'\\temps.ini')

    if config.has_section(utilisateur):

        if config.has_option(utilisateur, 'date'):
            laDate = config.get(utilisateur, 'date')
        else:
            laDate = '01/01/2000'

        if config.has_option(utilisateur, 'temps utilise'):
            leTempsUtilise = config.getint(utilisateur, 'temps utilise')
        else:
            leTempsUtilise = '0'

        if config.has_option(utilisateur, 'temps additionnel'):
            leTempsAdditionnel = config.getint(
                utilisateur, 'temps additionnel')
        else:
            leTempsAdditionnel = '0'

    aujourdhui = datetime.now().strftime(r'%d/%m/%Y')
    if laDate == aujourdhui:
        return (int(leTempsUtilise) - int(leTempsAdditionnel))
    else:
        return (0)


def majTempsIniFile(utilisateur, temps):
    config = ConfigParser()
    config.read('temps.ini')
    # config.read(settings.BASE_DIR+'\\temps.ini')

    if config.has_section(utilisateur):

        if config.has_option(utilisateur, 'date'):
            laDate = config.get(utilisateur, 'date')
        else:
            laDate = '01/01/2000'

        if config.has_option(utilisateur, 'temps utilise'):
            leTempsUtilise = config.getint(utilisateur, 'temps utilise')
        else:
            leTempsUtilise = '0'

    aujourdhui = datetime.now().strftime(r'%d/%m/%Y')

    # ! IMPORTANT: le client doit envoyer le temps écoulé depuis la dernière maj réussie
    # !            ie: chaque fois que la maj réussit, il remet à zéro le compteur
    if laDate == aujourdhui:
        # même jour, donc on cumule le temps
        config.set(utilisateur, 'temps utilise',
                   str(temps+int(leTempsUtilise)))
    else:
        # ce n'est pas le même jour, donc on met le nouveau temps seulement
        config.set(utilisateur, 'temps utilise', str(temps))
        config.set(utilisateur, 'temps additionnel', '0')

    config.set(utilisateur, 'date', aujourdhui)

    with open('temps.ini', 'w') as configfile:
        config.write(configfile)


def ajouterTempsIniFile(utilisateur, tempsAdditionnel):
    config = ConfigParser()
    config.read('temps.ini')

    if config.has_section(utilisateur):

        if config.has_option(utilisateur, 'date'):
            laDate = config.get(utilisateur, 'date')
        else:
            laDate = '01/01/2000'

        if config.has_option(utilisateur, 'temps additionnel'):
            leTempsAdditionnel = config.getint(
                utilisateur, 'temps additionnel')
        else:
            leTempsAdditionnel = '0'

    aujourdhui = datetime.now().strftime(r'%d/%m/%Y')

    if laDate == aujourdhui:
        # même jour, donc on cumule le temps
        config.set(utilisateur, 'temps additionnel',
                   str(tempsAdditionnel+int(leTempsAdditionnel)))
    else:
        # ce n'est pas le même jour, donc on met le nouveau temps seulement
        config.set(utilisateur, 'temps additionnel', str(tempsAdditionnel))

    config.set(utilisateur, 'date', aujourdhui)

    with open('temps.ini', 'w') as configfile:
        config.write(configfile)

# ^ ---------------------------- ini file (fin)


@api_view(['GET'])
def tempsUtilise(request, utilisateur):

    # lire le temps du ini
    # if not exists(settings.BASE_DIR+'\\temps.ini'):
    if not exists('temps.ini'):
        creerIniFile(utilisateur)

    tempsUtilise = lireTempsUtiliseIniFile(utilisateur)

    leTempsUtilise = TempsUtilise(valTemps=tempsUtilise)
    serializer = tempsUtiliseSerializer(leTempsUtilise, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def tempsMaj(request):
    # def tempsMaj(request, utilisateur, temps):
    donnees = request.data
    # print('*** request:\n', request.data)
    # serializer = tempsMajSerializer({"utilisateur": donnees["utilisateur"], "temps": donnees["temps"]}, many=False)
    serializer = tempsMajSerializer(request.data, many=False)
    # if serializer.is_valid():
    majTempsIniFile(donnees["utilisateur"], donnees["temps"])
    # else:
    # print('*** INVALID Serializer (tempsMaj) ***')
    return Response(serializer.data)


@api_view(['POST'])
def tempsAjouter(request):
    donnees = request.data
    serializer = tempsAjouterSerializer(request.data, many=False)
    ajouterTempsIniFile(donnees["utilisateur"], donnees["tempsAdditionnel"])
    return Response(serializer.data)

# ^ --- utilisation:
# http://127.0.0.1:8001/api/temps/anes

# http://127.0.0.1:8001/api/majtemps
# {"utilisateur": "anes", "temps": 11}

# http://127.0.0.1:8001/api/ajoutertemps
# {"utilisateur": "anes", "tempsAdditionnel": 50}


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
