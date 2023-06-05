from django.db import models


class wordsList (models.Model):
    langChoices = [('A','Arabic'),('E','English'),('F','French'),('G','German')]
    difficultyChoices = [('E','Easy'),('N','Normal'),('H','Hard')]
    # ---------------------------------
    lang = models.CharField(max_length=1, choices=langChoices)
    word = models.CharField(max_length=20)
    definition = models.CharField(max_length=50)
    hint = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=1, choices=difficultyChoices, default='N')
    nbTimesChosen = models.SmallIntegerField(default=0)

    def __str__(self):
        return self.word+' ('+self.lang+', '+self.difficulty+')'
    
    class Meta:
        ordering = ['lang','word']
        constraints = [
            models.UniqueConstraint(fields=['lang','word'], name='unique_word')
        ]
