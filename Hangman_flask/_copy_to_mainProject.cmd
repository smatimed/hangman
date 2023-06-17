@echo off
echo.
echo Copier le project "Hangman_flask" dans le projet "Hangman" pour qu'il soit copie dans GitHub
echo.
pause

echo.

rem folders
if not exist D:\pythonProject\Hangman\Hangman_flask\*.* MD D:\pythonProject\Hangman\Hangman_flask
if not exist D:\pythonProject\Hangman\Hangman_flask\templates\*.* MD D:\pythonProject\Hangman\Hangman_flask\templates
if not exist D:\pythonProject\Hangman\Hangman_flask\static\*.* MD D:\pythonProject\Hangman\Hangman_flask\static

echo --- RACINE
copy *.* D:\pythonProject\Hangman\Hangman_flask

echo --- templates
copy templates\*.* D:\pythonProject\Hangman\Hangman_flask\templates

echo --- static
copy static\*.* D:\pythonProject\Hangman\Hangman_flask\static

pause
