from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, TelField, TextAreaField, DateField, SelectField, IntegerField, PasswordField, BooleanField, SubmitField, FileField, FloatField
from wtforms.validators import DataRequired, Email, Length, NumberRange, ValidationError
from datetime import date

class ReservationForm(FlaskForm):
    name = StringField('Nom', validators=[DataRequired(), Length(min=2, max=100)])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    phone = TelField('Téléphone', validators=[DataRequired(), Length(min=8, max=20)])
    date = DateField('Date', validators=[DataRequired()])
    time = SelectField('Heure', choices=[
        ('11:30', '11:30'), ('12:00', '12:00'), ('12:30', '12:30'),
        ('13:00', '13:00'), ('13:30', '13:30'), ('19:00', '19:00'),
        ('19:30', '19:30'), ('20:00', '20:00'), ('20:30', '20:30'),
        ('21:00', '21:00'), ('21:30', '21:30')
    ], validators=[DataRequired()])
    guests = IntegerField('Nombre de personnes', validators=[DataRequired(), NumberRange(min=1, max=10)])
    message = TextAreaField('Message (optionnel)')
    submit = SubmitField('Réserver maintenant')

    def validate_date(self, field):
        if field.data < date.today():
            raise ValidationError('La date doit être aujourd\'hui ou dans le futur.')

class ContactForm(FlaskForm):
    name = StringField('Nom', validators=[DataRequired(), Length(min=2, max=100)])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    subject = StringField('Sujet', validators=[DataRequired(), Length(min=2, max=100)])
    message = TextAreaField('Message', validators=[DataRequired(), Length(min=10)])
    submit = SubmitField('Envoyer le message')

class LoginForm(FlaskForm):
    username = StringField('Nom d\'utilisateur', validators=[DataRequired()])
    password = PasswordField('Mot de passe', validators=[DataRequired()])
    remember_me = BooleanField('Se souvenir de moi')
    submit = SubmitField('Connexion')

class TestimonialForm(FlaskForm):
    name = StringField('Votre nom', validators=[DataRequired(), Length(min=2, max=100)])
    rating = SelectField('Note', choices=[(1, '1 - Déçu'), (2, '2 - Moyen'), (3, '3 - Bon'), (4, '4 - Très bon'), (5, '5 - Excellent')], coerce=int, validators=[DataRequired()])
    comment = TextAreaField('Commentaire', validators=[DataRequired(), Length(min=10, max=500)])
    submit = SubmitField('Envoyer l\'avis')

class MenuItemForm(FlaskForm):
    name = StringField('Nom du plat', validators=[DataRequired(), Length(min=2, max=100)])
    description = TextAreaField('Description', validators=[DataRequired(), Length(min=10, max=500)])
    price = FloatField('Prix', validators=[DataRequired(), NumberRange(min=0.1)])
    category = SelectField('Catégorie', choices=[
        ('burger', 'Burger'),
        ('side', 'Accompagnement'),
        ('dessert', 'Dessert'),
        ('boisson', 'Boisson')
    ], validators=[DataRequired()])
    is_vegetarian = BooleanField('Végétarien')
    is_spicy = BooleanField('Épicé')
    featured = BooleanField('Mettre en avant')
    image_path = StringField('Chemin de l\'image (relatif à /static/images/)')
    submit = SubmitField('Enregistrer')

class PromoEventForm(FlaskForm):
    title = StringField('Titre', validators=[DataRequired(), Length(min=2, max=100)])
    description = TextAreaField('Description', validators=[DataRequired(), Length(min=10, max=500)])
    end_date = DateField('Date de fin', validators=[DataRequired()])
    is_active = BooleanField('Actif')
    submit = SubmitField('Enregistrer')
