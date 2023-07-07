import os
import sqlite3
import sys

print('RAZ de la colonne "nbTimesChosen" avant déploiement.')

confirm = input('Taper "OK" pour confirmer le lancement: ')

if confirm.upper() != 'OK':
    print('*** Traitement non lancé !')
    input('Appuyer sur ENTREE ...')
    sys.exit(1)

print('Processing ...')

path = ''
db = 'db.sqlite3'

con = sqlite3.connect(os.path.join(path, db))

cur = con.cursor()

# sql_insert_or_update = """
#     insert into List_PS (CodePS, NomPS, Email, LastDateVirement, DateOfLastDateVirement) values ('','','','','');

#     update List_PS set NomPS='', Email='', LastDateVirement='', DateOfLastDateVirement='' where CodePS='';
# """
sql_insert_or_update = """
update app_wordslist set nbTimeschosen=0;
"""

try:
    cur.executescript(sql_insert_or_update)
    con.commit()
except:
    print('*** execption ***')

cur.close()
con.close()

input('Appuyer sur ENTREE ...')
