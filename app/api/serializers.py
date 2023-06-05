# from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer, CharField


class wordChosenSerializer(Serializer):
    word = CharField()
    definition = CharField()
    hint = CharField()
