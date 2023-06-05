from django.shortcuts import render


def dashboard(request):
    return render(request, "dashboard.html")


def game_hangman(request, langue):
    return render(request, "HangmanGame.html", {'langue':langue})
