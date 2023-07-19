from django.forms import ModelForm

from .models import wordsList


class wordsListForm(ModelForm):
    """Form definition for wordsList."""

    def clean_word(self):
        return self.cleaned_data.get('word').upper()

    # def clean_hint(self):
    #     if self.cleaned_data.get('difficulty') == 'H':
    #         return None
    #     else:
    #         return self.cleaned_data.get('hint')

    class Meta:
        """Meta definition for wordsListform."""

        model = wordsList
        fields = ('lang','word','definition','hint','difficulty')
