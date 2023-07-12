from django.urls import path
from . import views

urlpatterns = [
    path('word/<str:theLang>/<str:theDifficulty>/<str:wordsListToAvoid>', views.chooseWordRandomly, name='api-chooseWordRandomly'),
]

    # old: path('word/<str:theLang>/<str:theDifficulty>/', views.chooseWordRandomly, name='api-chooseWordRandomly'),