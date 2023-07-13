from django.shortcuts import render

from django.conf import settings

def dashboard(request):
    return render(request, "dashboard.html", {'lInDevelopingMode': settings.DEBUG})


def game_hangman(request, langue):
    return render(request, "HangmanGame.html", {'langue':langue})
