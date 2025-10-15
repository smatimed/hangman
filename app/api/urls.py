from django.urls import path
from . import views

urlpatterns = [
    path('word/<str:theLang>/<str:theDifficulty>/<str:wordsListToAvoid>',
         views.chooseWordRandomly, name='api-chooseWordRandomly'),

    # --- Temps "Mot de passe" (Anes)
    path('temps/<str:utilisateur>', views.tempsUtilise, name='api-tempsUtilise'),
    path('majtemps', views.tempsMaj, name='api-tempsMaj'),
    #     path('majtemps/<str:utilisateur>/<int:temps>', views.tempsMaj, name='api-tempsMaj'),
]

# old: path('word/<str:theLang>/<str:theDifficulty>/', views.chooseWordRandomly, name='api-chooseWordRandomly'),
