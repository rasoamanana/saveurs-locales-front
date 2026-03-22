document.addEventListener('DOMContentLoaded', () => {

    // =====================
    //  CANVAS BACKGROUND
    // =====================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isDark = () => document.body.classList.contains('dark-mode');

    class Particle {
        constructor() { this.reset(true); }
        reset(init = false) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 10;
            this.size = Math.random() * 2 + 0.5;
            this.speed = Math.random() * 0.4 + 0.1;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.drift = (Math.random() - 0.5) * 0.3;
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            if (this.y < -10) this.reset();
        }
        draw() {
            const color = isDark() ? `rgba(74,222,128,${this.opacity})` : `rgba(34,197,94,${this.opacity * 0.6})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const animateCanvas = () => {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateCanvas);
    };
    animateCanvas();

    // =====================
    //  PRODUCT DATA
    // =====================
    const productsData = [
        {
            id: 1, title: "Tomates Anciennes",
            description: "Cultivées en plein champ, ces tomates offrent un goût authentique.",
            price: "4.50€ / kg", image: "image/tomates.jpeg",
            badge: "Bio", badgeClass: "product-card__badge--bio",
            tags: ["bio", "legumes"]
        },
        {
            id: 2, title: "Pommes Gala",
            description: "Croquantes et juteuses, idéales pour une pause saine.",
            price: "2.80€ / kg", image: "image/pomme.jpeg",
            badge: "-20%", badgeClass: "product-card__badge--promo",
            tags: ["promo", "fruits"]
        },
        {
            id: 3, title: "Carottes Sable",
            description: "Douces et savoureuses, issues de terres sablonneuses.",
            price: "1.90€ / kg", image: "image/carottesss.jpeg",
            badge: "Bio", badgeClass: "product-card__badge--bio",
            tags: ["bio", "legumes"]
        },
        {
            id: 4, title: "Salade Verte",
            description: "Feuilles tendres et croquantes, fraîcheur garantie.",
            price: "1.20€ / pièce", image: "image/saladevvv.jpeg",
            badge: null, badgeClass: null,
            tags: ["legumes"]
        },
        {
            id: 5, title: "Miel de Fleurs",
            description: "Un miel polyfloral doux, récolté par nos apiculteurs.",
            price: "12.50€ / pot", image: "image/miel-de-fleur.jpeg",
            badge: "Bio", badgeClass: "product-card__badge--bio",
            tags: ["bio", "epicerie"]
        },
        {
            id: 6, title: "Pain de Campagne",
            description: "Fabriqué avec du levain naturel et une farine locale.",
            price: "3.20€ / pièce", image: "image/pain.webp",
            badge: "Promo", badgeClass: "product-card__badge--promo",
            tags: ["promo", "epicerie"]
        },
        {
            id: 7, title: "Huile d'Olive",
            description: "Vierge extra, première pression à froid.",
            price: "15.00€ / L", image: "image/huiles.jpeg",
            badge: null, badgeClass: null,
            tags: ["epicerie"]
        },
        {
            id: 8, title: "Fraises Gariguette",
            description: "Les premières fraises de la saison, parfumées et sucrées.",
            price: "6.50€ / barquette", image: "image/fraise.jpeg",
            badge: "Bio", badgeClass: "product-card__badge--bio",
            tags: ["bio", "fruits"]
        },
        {
            id: 9, title: "Jus de Pomme Artisanal",
            description: "Pressé à froid depuis nos vergers normands, sans sucre ajouté.",
            price: "4.90€ / 75cl",
            image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80",
            badge: "Bio", badgeClass: "product-card__badge--bio",
            tags: ["bio", "boissons"]
        },
        {
            id: 10, title: "Limonade Artisanale",
            description: "Citronnée, pétillante et rafraîchissante, sans conservateurs.",
            price: "3.20€ / 50cl",
            image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=600&q=80",
            badge: "-20%", badgeClass: "product-card__badge--promo",
            tags: ["promo", "boissons"]
        },
        {
            id: 12, title: "Smoothie Tropical",
            description: "Mangue, ananas et passion mixés à froid, 100% fruits.",
            price: "4.20€ / 25cl",
            image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
            badge: null, badgeClass: null,
            tags: ["boissons", "fruits"]
        },
        {
            id: 13, title: "Eau Pétillante Minérale",
            description: "Source naturelle des Alpes, légèrement minéralisée et pétillante.",
            price: "1.80€ / L",
            image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80",
            badge: null, badgeClass: null,
            tags: ["boissons"]
        }
    ];

    // =====================
    //  UTILS
    // =====================
    const normalizeText = str => {
        if (!str) return '';
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    };

    // =====================
    //  DOM REFS
    // =====================
    const searchInput = document.querySelector('.search-bar input');
    const productContainer = document.getElementById('product-container');
    const noResultsMsg = document.getElementById('no-results-message');
    const resetBtn = document.getElementById('reset-search-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cursor = document.querySelector('.custom-cursor');
    const trail = document.querySelector('.cursor-trail');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const header = document.querySelector('.site-header');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;

    let activeFilter = 'all';

    // =====================
    //  INTERSECTION OBSERVER
    // =====================
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.category-card, .section-header, .footer-col').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // =====================
    //  RENDER PRODUCTS
    // =====================
    const displayProducts = (products) => {
        productContainer.innerHTML = '';

        if (products.length === 0) {
            noResultsMsg.style.display = 'block';
            return;
        }
        noResultsMsg.style.display = 'none';

        products.forEach((product, index) => {
            const article = document.createElement('article');
            article.classList.add('product-card', 'reveal');
            article.style.transitionDelay = `${index * 60}ms`;

            const badge = product.badge
                ? `<span class="product-card__badge ${product.badgeClass}">${product.badge}</span>`
                : '';

            article.innerHTML = `
                <div class="product-card__image-wrapper">
                    ${badge}
                    <img src="${product.image}" alt="${product.title}" class="product-card__image" loading="lazy">
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.title}</h3>
                    <p class="product-card__description">${product.description}</p>
                    <div class="product-card__footer">
                        <p class="product-card__price">${product.price}</p>
                        <button class="product-card__btn" aria-label="Ajouter ${product.title}">
                            <i class="fas fa-plus"></i> Ajouter
                        </button>
                    </div>
                </div>
            `;

            productContainer.appendChild(article);
            observer.observe(article);

            const btn = article.querySelector('.product-card__btn');
            btn.addEventListener('mouseenter', () => { if (isDesktop()) { cursor.classList.add('grow'); trail.classList.add('grow'); } });
            btn.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); trail.classList.remove('grow'); });

            btn.addEventListener('click', () => {
                btn.innerHTML = '<i class="fas fa-check"></i> Ajouté!';
                btn.style.background = '#16a34a';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-plus"></i> Ajouter';
                    btn.style.background = '';
                }, 1500);
            });
        });
    };

    // =====================
    //  FILTER LOGIC
    // =====================
    const applyFilters = () => {
        const searchTerm = normalizeText(searchInput.value);
        const filtered = productsData.filter(p => {
            const matchSearch = normalizeText(`${p.title} ${p.description} ${p.badge || ''}`).includes(searchTerm);
            const matchFilter = activeFilter === 'all' || p.tags.includes(activeFilter);
            return matchSearch && matchFilter;
        });
        displayProducts(filtered);
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    searchInput.addEventListener('input', applyFilters);
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        activeFilter = 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        filterBtns[0].classList.add('active');
        applyFilters();
    });

    // =====================
    //  CURSOR (desktop only)
    // =====================
    const isDesktop = () => window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;
    let cursorX = 0, cursorY = 0, trailX = 0, trailY = 0;

    window.addEventListener('mousemove', e => {
        if (!isDesktop()) return;
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        if (!body.classList.contains('cursor-active')) body.classList.add('cursor-active');
    });

    const animateCursor = () => {
        if (isDesktop()) {
            trailX += (cursorX - trailX) * 0.12;
            trailY += (cursorY - trailY) * 0.12;
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';
        }
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .category-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => { if (isDesktop()) { cursor.classList.add('grow'); trail.classList.add('grow'); } });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); trail.classList.remove('grow'); });
    });

    // =====================
    //  SCROLL
    // =====================
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollIndicator.style.width = ((document.documentElement.scrollTop / h) * 100) + '%';
    });

    // =====================
    //  DARK MODE
    // =====================
    const updateThemeIcon = () => {
        const dark = body.classList.contains('dark-mode');
        themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    };

    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
    }
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateThemeIcon();
    });

    // =====================
    //  MOBILE MENU
    // =====================
    const closeMenu = () => { const t = document.getElementById('menu-toggle'); if (t) t.checked = false; };
    document.getElementById('close-menu')?.addEventListener('click', closeMenu);
    document.querySelector('.menu-overlay')?.addEventListener('click', closeMenu);
    document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeMenu(); });

    // =====================
    //  NAV LINKS → filter + scroll
    // =====================
    const activateFilter = (filterValue) => {
        activeFilter = filterValue;
        filterBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.filter === filterValue);
        });
        applyFilters();
    };

    document.querySelectorAll('.nav-link[data-nav-filter]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const f = link.dataset.navFilter;
            activateFilter(f);
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Category cards → filter + scroll to products
    document.querySelectorAll('.category-card[data-filter]').forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            const f = card.dataset.filter;
            // Map category filter values to product tag names
            const map = { fruits: 'fruits', legumes: 'legumes', viandes: 'epicerie', cremerie: 'epicerie', boissons: 'boissons' };
            activateFilter(map[f] || f);
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // =====================
    //  INIT
    // =====================
    displayProducts(productsData);

    // Scroll to products from hero CTA
    document.querySelectorAll('a[href="#products"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
    document.querySelectorAll('a[href="#categories"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});