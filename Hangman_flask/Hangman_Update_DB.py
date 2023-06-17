import sqlite3
from flask import Flask, render_template, request, url_for, flash, redirect


def get_db_connection():
    conn = sqlite3.connect('d:\pythonproject\hangman\db.sqlite3')
    conn.row_factory = sqlite3.Row
    return conn


def doesWordExist(theWord, language):
    """Checks if a word exists or not."""
    theWord = theWord.upper()
    language = language.upper()
    conn = get_db_connection()
    words = conn.execute(f"select * from app_wordslist where lang='{language}' and word='{theWord}'").fetchall()
    conn.close()
    return (len(words) != 0)

def getWord(id):
    conn = get_db_connection()
    word = conn.execute(f"select * from app_wordslist where id = {id}").fetchone()
    conn.close()
    if word is None:
        abort(404)
    # print('*** word',word['nbTimesChosen'])
    return word


app = Flask(__name__)
# to generate a key, use, for example: 
# import secrets
# secrets.token_urlsafe(66)
app.config['SECRET_KEY'] = 'rZX59fJjs5YKboh8u_jXD7lE3rY-gv-IV2PrJ1MNbAiu-_CoQPF6XyCbIAClRovUlp0h3--23GqGaE0Uj9TZ5AN_'


@app.route('/')
def index():
    conn = get_db_connection()
    words = conn.execute('select * from app_wordslist order by lang,difficulty,word').fetchall()
    conn.close()
    return render_template('index.html',words=words,filerEnabled='0')

@app.route('/filter/<lang>/<difficulty>')
def indexFiltered(lang,difficulty):
    # print('***',lang,difficulty)
    # lang='F'
    # difficulty='N'
    # print('***',lang,difficulty)
    conn = get_db_connection()
    if lang != 'U':
        if difficulty != 'U':
            words = conn.execute(f"select * from app_wordslist where lang='{lang}' and difficulty='{difficulty}' order by lang,difficulty,word").fetchall()
        else:
            words = conn.execute(f"select * from app_wordslist where lang='{lang}' order by lang,difficulty,word").fetchall()
    else:
        if difficulty != 'U':
            words = conn.execute(f"select * from app_wordslist where difficulty='{difficulty}' order by lang,difficulty,word").fetchall()
        else:
            words = conn.execute(f"select * from app_wordslist order by lang,difficulty,word").fetchall()
    conn.close()
    return render_template('index.html',words=words,filerEnabled='1',lang=lang,difficulty=difficulty)


@app.route('/create', methods=('GET','POST'))
def create():
    lang = 'E'
    word = ''
    definition = ''
    hint = ''
    difficulty = 'E'
    if request.method == 'POST':
        lang = request.form['lang']
        word = request.form['word'].replace("'","''").upper()
        definition = request.form['definition'].replace("'","''")
        hint = request.form['hint'].replace("'","''")
        difficulty = request.form['difficulty']
        # nbTimesChosen

        if not lang or not word or not definition or not difficulty:
            flash('Complete tha data')
        else:
            if difficulty != 'H' and not hint:
                flash('Complete tha data')
            else:
                if not doesWordExist(word,lang):
                    conn = get_db_connection()
                    conn.execute(f"insert into app_wordslist (lang, word, definition, hint, difficulty, nbTimesChosen) values ('{lang}','{word}','{definition}','{hint}','{difficulty}',0)")
                    conn.commit()
                    conn.close()
                    # print('*** request.form:',request.form)
                    # if request.form['action'] == 'continue-adding':
                    #     return redirect(request.url)
                    # else:
                    #     return redirect(url_for('index'))

                    if request.form['action'] == 'stop-adding':
                        return redirect(url_for('index'))
                    else:
                        # Empty some fields that change
                        word = ''
                        definition = ''
                        hint = ''
                else:
                    flash('Word already exists')
    return render_template('create.html',lang=lang,difficulty=difficulty,word=word,definition=definition,hint=hint)


@app.route('/edit/<int:id>/', methods=('GET','POST'))
def edit(id):
    word = getWord(id)

    if request.method == 'POST':
        lang = request.form['lang']
        word = request.form['word'].replace("'","''").upper()
        definition = request.form['definition'].replace("'","''")
        hint = request.form['hint'].replace("'","''")
        difficulty = request.form['difficulty']
        nbTimesChosen = int(request.form['nbTimesChosen'])

        # print('***',word,nbTimesChosen)

        if not lang or not word or not definition or not difficulty:
            flash('Complete tha data')
        else:
            if difficulty != 'H' and not hint:
                flash('Complete tha data')
            else:
                conn = get_db_connection()
                conn.execute(f"update app_wordslist set lang='{lang}', word='{word}', definition='{definition}', hint='{hint}', difficulty='{difficulty}', nbtimeschosen={nbTimesChosen} where id = {id}")
                conn.commit()
                conn.close()
                # print('***',request.referrer)
                return redirect(url_for('index'))
    return render_template('edit.html', word=word)
