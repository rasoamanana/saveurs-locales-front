// Attend que le contenu du DOM soit entièrement chargé avant d'exécuter le script.
// C'est une bonne pratique pour s'assurer que tous les éléments HTML sont disponibles.
document.addEventListener('DOMContentLoaded', () => {

    // --- SÉLECTION DES ÉLÉMÉNTS DU DOM ---
    // On récupère les éléments avec lesquels on va interagir.
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const productContainer = document.getElementById('product-container');
    const noResultsMessage = document.getElementById('no-results-message');
    const resetSearchBtn = document.getElementById('reset-search-btn');

    // --- DONNÉES PRODUITS (JSON) ---
    const productsData = [
        {
            id: 1,
            title: "Tomates Anciennes",
            description: "Cultivées en plein champ, ces tomates offrent un goût authentique.",
            price: "4.50€ / kg",
            image: "image/tomates.jpeg",
            badge: "Bio",
            badgeClass: "product-card__badge--bio"
        },
        {
            id: 2,
            title: "Pommes Gala",
            description: "Croquantes et juteuses, idéales pour une pause saine.",
            price: "2.80€ / kg",
            image: "image/pomme.jpeg",
            badge: "-20%",
            badgeClass: "product-card__badge--promo"
        },
        {
            id: 3,
            title: "Carottes Sable",
            description: "Douces et savoureuses, directement issues de terres sablonneuses.",
            price: "1.90€ / kg",
            image: "image/carottesss.jpeg",
            badge: "Bio",
            badgeClass: "product-card__badge--bio"
        },
        {
            id: 4,
            title: "Salade Verte",
            description: "Feuilles tendres et croquantes, fraîcheur garantie.",
            price: "1.20€ / pièce",
            image: "image/saladevvv.jpeg",
            badge: null,
            badgeClass: null
        },
        {
            id: 5,
            title: "Miel de Fleurs",
            description: "Un miel polyfloral doux, récolté par nos apiculteurs partenaires.",
            price: "12.50€ / pot",
            image: "image/miel-de-fleur.jpeg",
            badge: "Bio",
            badgeClass: "product-card__badge--bio"
        },
        {
            id: 6,
            title: "Pain de Campagne",
            description: "Fabriqué avec du levain naturel et une farine locale.",
            price: "3.20€ / pièce",
            image: "image/pain.webp",
            badge: "Promo",
            badgeClass: "product-card__badge--promo"
        },
        {
            id: 7,
            title: "Huile d'Olive",
            description: "Huile d'olive vierge extra, première pression à froid.",
            price: "15.00€ / L",
            image: "image/huiles.jpeg",
            badge: null,
            badgeClass: null
        },
        {
            id: 8,
            title: "Fraises Gariguette",
            description: "Les premières fraises de la saison, parfumées et sucrées.",
            price: "6.50€ / barquette",
            image: "image/fraise.jpeg",
            badge: "Bio",
            badgeClass: "product-card__badge--bio"
        }
    ];

    /**
     * Fonction pour normaliser une chaîne de caractères pour la recherche.
     * - Met le texte en minuscules.
     * - Supprime les accents (ex: "épice" devient "epice").
     * - Supprime les espaces superflus au début et à la fin.
     * @param {string} str - La chaîne à normaliser.
     * @returns {string} La chaîne normalisée, prête pour la comparaison.
     */
    const normalizeText = (str) => {
        // Si la chaîne est vide ou nulle, on retourne une chaîne vide pour éviter les erreurs.
        if (!str) return '';
        // La méthode normalize('NFD') sépare les caractères de leurs accents.
        // Le replace avec une expression régulière supprime ensuite ces accents.
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    };

    // --- LOGIQUE D'ANIMATION AU SCROLL (INTERSECTION OBSERVER) ---

    // 1. Créer l'observateur qui ajoutera la classe de visibilité
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // On arrête de l'observer après l'animation
            }
        });
    }, {
        threshold: 0.1
    });

    // --- CUSTOM CURSOR LOGIC ---
    const cursor = document.querySelector('.custom-cursor');
    
    window.addEventListener('mousemove', e => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        if (!document.body.classList.contains('custom-cursor-active')) {
            document.body.classList.add('custom-cursor-active');
        }
    });

    // --- FONCTION D'AFFICHAGE DES PRODUITS ---
    const displayProducts = (products) => {
        productContainer.innerHTML = ''; // On vide le conteneur

        if (products.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        } else {
            noResultsMessage.style.display = 'none';
        }

        products.forEach((product, index) => {
            const article = document.createElement('article');
            article.classList.add('product-card', 'reveal'); // Ajout direct de la classe reveal
            article.style.transitionDelay = `${index * 75}ms`; // Effet décalé

            let badgeHTML = '';
            if (product.badge) {
                badgeHTML = `<span class="product-card__badge ${product.badgeClass}">${product.badge}</span>`;
            }

            article.innerHTML = `
                <div class="product-card__image-wrapper">
                    ${badgeHTML}
                    <img src="${product.image}" alt="${product.title}" class="product-card__image">
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.title}</h3>
                    <p class="product-card__description">${product.description}</p>
                    <p class="product-card__price">${product.price}</p>
                    <button class="product-card__btn" aria-label="Ajouter ${product.title} au panier"><i class="fas fa-shopping-basket" aria-hidden="true"></i> Ajouter</button>
                </div>
            `;
            productContainer.appendChild(article);

            // Observer le nouvel élément pour l'animation
            revealObserver.observe(article);

            // Ajouter les écouteurs pour le curseur personnalisé
            const btn = article.querySelector('.product-card__btn');
            btn.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            btn.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    };

    // --- FILTRAGE DES PRODUITS (JSON) ---
    const filterProducts = () => {
        const searchTerm = normalizeText(searchInput.value);
        const filtered = productsData.filter(product => {
            const searchString = normalizeText(`${product.title} ${product.description} ${product.badge || ''}`);
            return searchString.includes(searchTerm);
        });
        displayProducts(filtered);
    };

    // --- AJOUT DES ÉCOUTEURS D'ÉVÉNEMENTS ---
    searchInput.addEventListener('input', filterProducts);
    resetSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterProducts();
    });

    // --- INITIALISATION DES ÉLÉMENTS STATIQUES ---
    // Observer les éléments statiques (titres, footer, catégories)
    const elementsToReveal = document.querySelectorAll('.category-card, .categories h2, .products h2, .footer-col');
    elementsToReveal.forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });

    // --- HEADER DYNAMIQUE & SCROLL INDICATOR ---
    const header = document.querySelector('.site-header');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        // 1. Gestion de la classe .scrolled
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 2. Barre de progression
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollIndicator.style.width = scrolled + "%";
    });

    // Curseur sur les éléments statiques
    const interactiveElements = document.querySelectorAll('a, button, .category-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('grow');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
        });
    });

    // --- GESTION DU DARK MODE ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    const updateIcon = () => {
        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };

    // 1. Vérifier la préférence sauvegardée ou système au chargement
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Si aucune sauvegarde, on respecte la préférence système
        body.classList.add('dark-mode');
    }
    updateIcon();

    // 2. Fonction de basculement au clic
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        updateIcon();
        
        // Sauvegarder le choix de l'utilisateur
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // --- AFFICHAGE INITIAL ---
    displayProducts(productsData);

    // --- GESTION DU MENU MOBILE (FERMETURE) ---
    const closeMenuBtn = document.getElementById('close-menu');
    const menuCheckbox = document.getElementById('menu-toggle');
    const menuLinks = document.querySelectorAll('.main-nav a');
    const menuOverlay = document.querySelector('.menu-overlay');

    const closeMenu = () => {
        if (menuCheckbox) menuCheckbox.checked = false;
    };

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- GESTION DU REDIMENSIONNEMENT ---
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    });
});