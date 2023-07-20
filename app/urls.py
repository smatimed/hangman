from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('hangman/<str:langue>/', views.game_hangman, name='hangman'),
    path('api/', include('app.api.urls')),
    # path('hangman/create-word/<str:langue>', views.create_word, name='hangman-create-word'),
    path('hangman/cw/<str:langue>/<str:difficulte>/<str:dernierMot>/', views.create_word, name='hangman-create-word'),
]
