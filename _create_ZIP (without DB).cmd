@echo off

set /P addToHangman=Additif to 'Hangman.zip': 

xcopy static static_production /S /Y

D:\Tools\Winrar\WINRAR.exe a Hangman%addToHangman%.zip -r @_create_Zip_without_DB.txt

timeout 10
