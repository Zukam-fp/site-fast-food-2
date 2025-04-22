import os
from datetime import datetime
from functools import wraps
from flask import render_template, flash, redirect, url_for, request, jsonify, session, abort
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from extensions import db
from models import User, MenuItem, Reservation, Testimonial, PromoEvent
from forms import ReservationForm, ContactForm, LoginForm, TestimonialForm, MenuItemForm, PromoEventForm

def register_routes(app):
    """Enregistrement des routes de l'application"""

    # Décorateur pour vérifier si l'utilisateur est admin
    def admin_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated or not current_user.is_admin:
                flash("Vous n'avez pas les droits nécessaires pour accéder à cette page.", "danger")
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return decorated_function

    # Routes principales
    @app.route('/')
    def index():
        featured_items = MenuItem.query.filter_by(featured=True).limit(4).all()
        testimonials = Testimonial.query.filter_by(approved=True).order_by(Testimonial.date.desc()).limit(6).all()
        promo_event = PromoEvent.query.filter_by(is_active=True).order_by(PromoEvent.end_date.asc()).first()
        form = TestimonialForm()

        return render_template('index.html',
                            featured_items=featured_items,
                            testimonials=testimonials,
                            promo_event=promo_event,
                            form=form)

    @app.route('/menu')
    def menu():
        category = request.args.get('category', 'all')

        if category != 'all':
            items = MenuItem.query.filter_by(category=category).all()
        else:
            items = MenuItem.query.all()

        # Mettre à jour les chemins d'images pour utiliser les SVG
        for item in items:
            if item.category == "burger":
                if "Street Smash" in item.name:
                    item.image_path = "/static/images/menu/street_smash.svg"
                elif "Double Trouble" in item.name:
                    item.image_path = "/static/images/menu/double_trouble.svg"
                elif "Veggie Crush" in item.name:
                    item.image_path = "/static/images/menu/veggie_crush.svg"
                elif "Spicy Chicken" in item.name:
                    item.image_path = "/static/images/menu/spicy_chicken.svg"
                else:
                    item.image_path = "/static/images/menu/street_smash.svg"
            elif item.category == "side":
                if "Frites" in item.name:
                    item.image_path = "/static/images/menu/frites.svg"
                else:
                    item.image_path = "/static/images/menu/onion_rings.svg"
            elif item.category == "dessert":
                if "Cheesecake" in item.name:
                    item.image_path = "/static/images/menu/cheesecake.svg"
                elif "Milkshake" in item.name:
                    item.image_path = "/static/images/menu/milkshake.svg"
                else:
                    item.image_path = "/static/images/menu/cheesecake.svg"
            elif item.category == "boisson":
                item.image_path = "/static/images/menu/soda.svg"

        return render_template('menu.html', items=items, active_category=category)

    @app.route('/about')
    def about():
        return render_template('about.html')

    @app.route('/contact', methods=['GET', 'POST'])
    def contact():
        form = ContactForm()
        if form.validate_on_submit():
            # Ici, on simulerait l'envoi d'un email avec les données du formulaire
            flash(f'Merci {form.name.data} ! Votre message a été envoyé avec succès.', 'success')
            return redirect(url_for('contact'))
        return render_template('contact.html', form=form)

    @app.route('/reservation', methods=['GET', 'POST'])
    def reservation():
        form = ReservationForm()
        if form.validate_on_submit():
            reservation = Reservation(
                name=form.name.data,
                email=form.email.data,
                phone=form.phone.data,
                date=form.date.data,
                time=form.time.data,
                guests=form.guests.data,
                message=form.message.data,
                status='pending'
            )
            db.session.add(reservation)
            db.session.commit()
            flash('Votre demande de réservation a été enregistrée ! Nous vous contacterons rapidement pour confirmation.', 'success')
            return redirect(url_for('index'))
        return render_template('reservation.html', form=form)

    @app.route('/add_testimonial', methods=['GET', 'POST'])
    def add_testimonial():
        form = TestimonialForm()
        if form.validate_on_submit():
            testimonial = Testimonial(
                name=form.name.data,
                rating=form.rating.data,
                comment=form.comment.data,
                approved=False
            )
            db.session.add(testimonial)
            db.session.commit()
            flash('Merci pour votre avis ! Il sera publié après modération.', 'success')
            return redirect(url_for('index'))
        return render_template('components/testimonial_form.html', form=form)

    # Routes d'authentification et d'administration
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if current_user.is_authenticated:
            return redirect(url_for('index'))

        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(username=form.username.data).first()
            if user is None or not user.check_password(form.password.data):
                flash('Nom d\'utilisateur ou mot de passe incorrect', 'danger')
                return redirect(url_for('login'))

            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            if not next_page or next_page.startswith('/'):
                next_page = url_for('index')
            return redirect(next_page)

        return render_template('admin/login.html', form=form)

    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('index'))

    @app.route('/admin')
    @login_required
    @admin_required
    def admin_dashboard():
        reservations = Reservation.query.order_by(Reservation.date.desc()).limit(10).all()
        pending_testimonials = Testimonial.query.filter_by(approved=False).all()
        menu_items = MenuItem.query.all()
        promos = PromoEvent.query.all()

        return render_template('admin/dashboard.html',
                            reservations=reservations,
                            pending_testimonials=pending_testimonials,
                            menu_items=menu_items,
                            promos=promos)

    @app.route('/admin/menu/add', methods=['GET', 'POST'])
    @login_required
    @admin_required
    def add_menu_item():
        form = MenuItemForm()
        if form.validate_on_submit():
            menu_item = MenuItem(
                name=form.name.data,
                description=form.description.data,
                price=form.price.data,
                image_path=form.image_path.data,
                category=form.category.data,
                is_vegetarian=form.is_vegetarian.data,
                is_spicy=form.is_spicy.data,
                featured=form.featured.data
            )
            db.session.add(menu_item)
            db.session.commit()
            flash('Nouvel élément de menu ajouté avec succès!', 'success')
            return redirect(url_for('admin_dashboard'))

        return render_template('admin/upload.html', form=form, title="Ajouter un plat au menu")

    @app.route('/admin/menu/edit/<int:item_id>', methods=['GET', 'POST'])
    @login_required
    @admin_required
    def edit_menu_item(item_id):
        menu_item = MenuItem.query.get_or_404(item_id)
        form = MenuItemForm(obj=menu_item)

        if form.validate_on_submit():
            menu_item.name = form.name.data
            menu_item.description = form.description.data
            menu_item.price = form.price.data
            menu_item.image_path = form.image_path.data
            menu_item.category = form.category.data
            menu_item.is_vegetarian = form.is_vegetarian.data
            menu_item.is_spicy = form.is_spicy.data
            menu_item.featured = form.featured.data

            db.session.commit()
            flash('Élément de menu mis à jour avec succès!', 'success')
            return redirect(url_for('admin_dashboard'))

        return render_template('admin/upload.html', form=form, title="Modifier un plat du menu")

    @app.route('/admin/testimonial/<int:testimonial_id>/approve', methods=['POST'])
    @login_required
    @admin_required
    def approve_testimonial(testimonial_id):
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        testimonial.approved = True
        db.session.commit()
        flash('Avis client approuvé et publié sur le site.', 'success')
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/testimonial/<int:testimonial_id>/delete', methods=['POST'])
    @login_required
    @admin_required
    def delete_testimonial(testimonial_id):
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        db.session.delete(testimonial)
        db.session.commit()
        flash('Avis client supprimé.', 'success')
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/promo/add', methods=['GET', 'POST'])
    @login_required
    @admin_required
    def add_promo():
        form = PromoEventForm()
        if form.validate_on_submit():
            promo = PromoEvent(
                title=form.title.data,
                description=form.description.data,
                end_date=form.end_date.data,
                is_active=form.is_active.data
            )
            db.session.add(promo)
            db.session.commit()
            flash('Nouvelle promotion ajoutée avec succès!', 'success')
            return redirect(url_for('admin_dashboard'))

        return render_template('admin/upload.html', form=form, title="Ajouter une promotion")

    # Gestion des réservations
    @app.route('/admin/reservation/<int:reservation_id>/confirm', methods=['POST'])
    @login_required
    @admin_required
    def confirm_reservation(reservation_id):
        reservation = Reservation.query.get_or_404(reservation_id)
        reservation.status = 'confirmed'
        db.session.commit()
        flash('Réservation confirmée.', 'success')
        return redirect(url_for('admin_dashboard'))

    @app.route('/admin/reservation/<int:reservation_id>/cancel', methods=['POST'])
    @login_required
    @admin_required
    def cancel_reservation(reservation_id):
        reservation = Reservation.query.get_or_404(reservation_id)
        reservation.status = 'cancelled'
        db.session.commit()
        flash('Réservation annulée.', 'success')
        return redirect(url_for('admin_dashboard'))

    # Route pour le sitemap XML
    @app.route('/sitemap.xml')
    def sitemap():
        return render_template('sitemap.xml')

    # Gestion des erreurs
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        form = TestimonialForm()
        now = datetime.now()
        return render_template('500.html', form=form, now=now), 500

    # Initialisation des données de base (à exécuter une seule fois)
    @app.route('/init_data', methods=['GET'])
    def init_data():
        # Vérifier si les données sont déjà initialisées
        if User.query.count() > 0:
            return "Les données sont déjà initialisées."

        # Créer un utilisateur administrateur
        admin = User(username="admin", email="admin@streetfood.fr", is_admin=True)
        admin.set_password("admin123")  # À changer en production!
        db.session.add(admin)

        # Ajouter quelques articles de menu
        menu_items = [
            # Burgers
            MenuItem(name="Street Smash", description="Le classique smash burger: Steak de bœuf écrasé sur la plancha, cheddar fondu, oignons caramélisés, sauce maison, pickles", price=9.90, category="burger", image_path="/static/images/menu/street_smash.svg", featured=True),
            MenuItem(name="Double Trouble", description="Double dose de viande, double cheddar, bacon croustillant, sauce BBQ fumée", price=13.90, category="burger", image_path="/static/images/menu/double_trouble.svg", is_spicy=True, featured=True),
            MenuItem(name="Veggie Crush", description="Galette de légumes, fromage de chèvre, roquette, confit d'oignons, sauce curry", price=10.90, category="burger", image_path="/static/images/menu/veggie_crush.svg", is_vegetarian=True),
            MenuItem(name="Spicy Chicken", description="Poulet pané croustillant, sauce piquante, coleslaw, pickles de jalapeños", price=11.90, category="burger", image_path="/static/images/menu/spicy_chicken.svg", is_spicy=True),
            MenuItem(name="Big Cheese", description="Triple fromage: cheddar, bleu d'Auvergne et raclette, compotée d'oignons, sauce tartare", price=12.90, category="burger", image_path="/static/images/menu/street_smash.svg"),

            # Sides
            MenuItem(name="Frites Maison", description="Frites fraîches cuites deux fois, sel aux herbes", price=3.90, category="side", image_path="/static/images/menu/frites.svg"),
            MenuItem(name="Onion Rings", description="Anneaux d'oignons panés et frits, sauce ranch", price=4.90, category="side", image_path="/static/images/menu/onion_rings.svg"),
            MenuItem(name="Mac & Cheese", description="Gratin de macaroni aux trois fromages, chapelure croustillante", price=5.90, category="side", image_path="/static/images/menu/frites.svg", featured=True),
            MenuItem(name="Coleslaw", description="Salade croquante de chou et carottes, sauce crémeuse légère", price=3.50, category="side", image_path="/static/images/menu/onion_rings.svg", is_vegetarian=True),

            # Desserts
            MenuItem(name="Cookie Géant", description="Cookie moelleux aux trois chocolats, servi tiède", price=4.90, category="dessert", image_path="/static/images/menu/cheesecake.svg", is_vegetarian=True),
            MenuItem(name="Cheesecake", description="Cheesecake new-yorkais, coulis de fruits rouges", price=5.90, category="dessert", image_path="/static/images/menu/cheesecake.svg", is_vegetarian=True, featured=True),
            MenuItem(name="Milkshake", description="Milkshake crémeux, choix: vanille, chocolat, fraise, oreo", price=4.90, category="dessert", image_path="/static/images/menu/milkshake.svg", is_vegetarian=True),

            # Boissons
            MenuItem(name="Soda Artisanal", description="Soda artisanal au cola, citron ou gingembre", price=3.90, category="boisson", image_path="/static/images/menu/soda.svg", is_vegetarian=True),
            MenuItem(name="Bière Locale", description="Bière artisanale IPA ou blonde (33cl)", price=5.90, category="boisson", image_path="/static/images/menu/soda.svg", is_vegetarian=True),
            MenuItem(name="Eau Plate/Gazeuse", description="Eau minérale (50cl)", price=2.50, category="boisson", image_path="/static/images/menu/milkshake.svg", is_vegetarian=True)
        ]

        for item in menu_items:
            db.session.add(item)

        # Ajouter quelques témoignages
        testimonials = [
            Testimonial(name="Sophie L.", rating=5, comment="Les meilleurs smash burgers de la ville ! Viande parfaitement caramélisée, pain brioche ultra-moelleux. Une tuerie !", approved=True),
            Testimonial(name="Maxime D.", rating=4, comment="J'adore l'ambiance street et décontractée. Le Double Trouble est mon péché mignon, même si c'est une bombe calorique !", approved=True),
            Testimonial(name="Chloé M.", rating=5, comment="Végétarienne et ENFIN un burger veggie qui a du goût ! Ça change des galettes de soja sans saveur. Mention spéciale pour les frites maison.", approved=True)
        ]

        for testimonial in testimonials:
            db.session.add(testimonial)

        # Ajouter une promotion
        promo = PromoEvent(
            title="SMASH WEEK!",
            description="Du lundi au jeudi, votre menu double smash à -20%!",
            end_date=datetime(2023, 12, 31),
            is_active=True
        )
        db.session.add(promo)

        db.session.commit()
        return "Données d'exemple initialisées avec succès!"
