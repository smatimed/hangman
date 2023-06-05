from django.shortcuts import render


def dashboard(request):
    return render(request, "dashboard.html")


def game_hangman(request):
    return render(request, "HangmanGame.html")
