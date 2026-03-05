// Attend que le contenu du DOM soit entièrement chargé avant d'exécuter le script.
// C'est une bonne pratique pour s'assurer que tous les éléments HTML sont disponibles.
document.addEventListener('DOMContentLoaded', () => {

    // --- SÉLECTION DES ÉLÉMÉNTS DU DOM ---
    // On récupère les éléments avec lesquels on va interagir.
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const productCards = document.querySelectorAll('.product-card');
    const noResultsMessage = document.getElementById('no-results-message');
    const resetSearchBtn = document.getElementById('reset-search-btn');

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

    /**
     * Fonction principale pour filtrer les produits en fonction de la saisie utilisateur.
     */
    const filterProducts = () => {
        const searchTerm = normalizeText(searchInput.value);
        let visibleProductsCount = 0;

        productCards.forEach(card => {
            const title = card.querySelector('.product-card__title')?.textContent;
            const description = card.querySelector('.product-card__description')?.textContent;
            const badge = card.querySelector('.product-card__badge')?.textContent;
            const searchData = `${title} ${description} ${badge}`;
            const normalizedSearchData = normalizeText(searchData);
            const isVisible = normalizedSearchData.includes(searchTerm);

            // CORRECTION : On utilise 'flex' pour réafficher la carte, car c'est son style par défaut dans le CSS.
            card.style.display = isVisible ? 'flex' : 'none';

            if (isVisible) visibleProductsCount++;
        });

        // Affiche le message si aucun produit n'est visible.
        noResultsMessage.style.display = visibleProductsCount === 0 ? 'block' : 'none';
    };

    // --- AJOUT DES ÉCOUTEURS D'ÉVÉNEMENTS ---
    searchInput.addEventListener('input', filterProducts);
    resetSearchBtn.addEventListener('click', () => {
        searchInput.value = ''; // Vide le champ de recherche.
        filterProducts(); // Relance le filtre pour tout réafficher.
    });
});