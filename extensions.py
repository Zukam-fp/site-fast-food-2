from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_login import LoginManager


class Base(DeclarativeBase):
    pass


# Création des instances d'extensions
db = SQLAlchemy(model_class=Base)
login_manager = LoginManager()

# Les configurations seront effectuées lors de l'initialisation de l'application
