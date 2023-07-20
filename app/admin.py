from django.contrib import admin

from .models import wordsList

# Register your models here.

class wordsListAdmin(admin.ModelAdmin):
    '''Admin View for wordsList '''
    list_display = ('lang', 'word', 'definition', 'hint', 'difficulty', 'nbTimesChosen')
    list_filter = ('lang','difficulty')
    # list_editable = ('nom', 'prenom', 'd_naiss')
    # inlines = [
    #     Inline,
    # ]
    # raw_id_fields = ('',)
    # readonly_fields = ('',)
    # search_fields = ('',)
    # date_hierarchy = ''
    # ordering = ('no_assure',)

admin.site.register(wordsList, wordsListAdmin)
