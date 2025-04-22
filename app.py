import os
import logging
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

# Import des extensions préalablement déclarées
from extensions import db, login_manager
# Maintenant, on peut importer les modèles
import models


# Configuration du logging
logging.basicConfig(level=logging.DEBUG)


def create_app():
    """Fonction de création de l'application"""
    # Création de l'application
    app = Flask(__name__)
    app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # Nécessaire pour que url_for génère des URLs avec https

    # Configuration de la base de données
    # Assurons-nous que la variable d'environnement est correctement récupérée
    database_url = os.environ.get("DATABASE_URL")
    if database_url is None:
        # Fallback vers SQLite si la variable n'est pas définie
        database_url = "sqlite:///fastfood.db"
        print("Attention: DATABASE_URL n'est pas définie, utilisation de SQLite")
    else:
        print(f"Utilisation de la base de données PostgreSQL")

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialisation des extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'login'
    login_manager.login_message = 'Veuillez vous connecter pour accéder à cette page.'

    # User loader pour Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        return models.User.query.get(int(user_id))

    # Création des tables si elles n'existent pas
    with app.app_context():
        db.create_all()

    # Import des routes ici pour éviter les importations circulaires
    from routes import register_routes
    register_routes(app)

    return app


# Création de l'application
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
