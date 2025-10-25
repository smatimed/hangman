# Étape 1 : base Python
FROM python:3.8-slim

# Étape 2 : définir le dossier de travail
WORKDIR /app

# Étape 3 : copier uniquement les fichiers nécessaires pour installer les dépendances
COPY requirements.txt /app/

# Étape 4 : installer les dépendances système + Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Étape 5 : copier le reste du projet
COPY . /app/

# Étape 6 : exposer le port Django
EXPOSE 8000

# Étape 7 : commande de démarrage
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
