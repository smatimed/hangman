@echo off

copy db.sqlite3 db_old.sqlite3

call .venv\scripts\activate
python RAZ_nbTimesChosen.py
