@echo off

set /P addToHangman=Additif to 'Hangman.zip': 

xcopy static static_production /S /Y

D:\Tools\Winrar\WINRAR.exe a Hangman%addToHangman%.zip -r @_create_Zip_without_DB.txt -xstatic\bootstrap513-dist -xstatic\bootstrap-icons-1.9.1 -xstatic_production\bootstrap513-dist -xstatic_production\bootstrap-icons-1.9.1

timeout 10
