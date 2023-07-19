from django.shortcuts import render, HttpResponseRedirect, redirect

from django.conf import settings

from . import models
from . import forms


def dashboard(request):
    return render(request, "dashboard.html", {'lInDevelopingMode': settings.DEBUG})


def game_hangman(request, langue):
    return render(request, "HangmanGame.html", {'langue':langue})


def create_word(request, langue, difficulte='E', dernierMot='*'):
    # lastDifficulty = 'E'
    # lastWord = ''
    if dernierMot == '*':
        dernierMot = ''
    countEasy = len(models.wordsList.objects.filter(lang=langue,difficulty='E').all())
    countMedium = len(models.wordsList.objects.filter(lang=langue,difficulty='N').all())
    countHard = len(models.wordsList.objects.filter(lang=langue,difficulty='H').all())
    # print('***',request.POST)
    form = forms.wordsListForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            # print('***',form.cleaned_data['word'],form.cleaned_data['hint'],form.cleaned_data['difficulty'])
            enreg = form.save(commit=False)
            if enreg.difficulty == 'H':
                enreg.hint = ''
            enreg.save()

            # return redirect('dashboard')
            if 'enreg_et_autre' in request.POST:
                # On a utilisé le bouton "Enregistrer et ajouter un autre" (au lieu de "Enregistrer")
                lastDifficulty = form.cleaned_data['difficulty']
                lastWord = form.cleaned_data['word']
                # form.cleaned_data['word'] = ''
                # form.cleaned_data['definition'] = ''
                # form.cleaned_data['hint'] = ''
                # return HttpResponseRedirect(request.path_info) # same page
                # print('***',lastDifficulty,lastWord)
                # print('***',f'/hangman/create-word/{langue}/{lastDifficulty}/{lastWord}/')
                return HttpResponseRedirect(f'/hangman/create-word/{langue}/{lastDifficulty}/{lastWord}/')
            else:
                return HttpResponseRedirect(f'/hangman/{langue}/')
    return render(request, 'create_word.html', {'form': form, 'langue': langue, 'lastDifficulty': difficulte, 'lastWord': dernierMot, 'countEasy':countEasy, 'countMedium':countMedium, 'countHard':countHard})
