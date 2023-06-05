from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('hangman', views.game_hangman, name='hangman'),
    path('api/', include('app.api.urls')),
]
