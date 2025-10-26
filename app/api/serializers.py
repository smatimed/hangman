# from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer, CharField, IntegerField


class wordChosenSerializer(Serializer):
    word = CharField()
    definition = CharField()
    hint = CharField()

# --- Mot de passe (Anes)


class tempsUtiliseSerializer(Serializer):
    temps = IntegerField()


class tempsMajSerializer(Serializer):
    utilisateur = CharField()
    temps = IntegerField()


class tempsAjouterSerializer(Serializer):
    utilisateur = CharField()
    tempsAdditionnel = IntegerField()
