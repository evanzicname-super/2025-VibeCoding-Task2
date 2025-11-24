document.addEventListener('DOMContentLoaded', () => {

    // --- SELECTORS ---
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-link');
    const ctaButtons = document.querySelectorAll('.cta-btn');
    let sections = document.querySelectorAll('section');

    // --- FUNCTIONS ---
    function toggleMenu() {
        navLinksContainer.classList.toggle('nav-active');
    }

    function updateActiveNav(targetId) {
        navLinks.forEach(link => {
            const linkTarget = link.dataset.target || (link.getAttribute('href') ? link.getAttribute('href').replace(/^#/, '') : null);
            if (linkTarget === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function switchPage(targetId) {
        if (!targetId) return;

        // refresh sections NodeList (in case DOM changed)
        sections = document.querySelectorAll('section');

        const targetSection = document.getElementById(targetId);
        if (!targetSection) {
            console.warn(`[navigation] 找不到 id="${targetId}" 的 section`);
            return; // don't hide other sections if target doesn't exist
        }

        // Hide all sections, then show target
        sections.forEach(sec => sec.classList.remove('active-section'));
        targetSection.classList.add('active-section');

        // scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // update nav active look
        updateActiveNav(targetId);

        // close mobile menu
        if (navLinksContainer.classList.contains('nav-active')) navLinksContainer.classList.remove('nav-active');

        // update url hash without default scrolling behavior
        if (history && history.replaceState) history.replaceState(null, '', `#${targetId}`);
    }

    // --- EVENT LISTENERS ---
    if (hamburger) hamburger.addEventListener('click', toggleMenu);

    // Use event delegation for nav links to avoid missing listeners
    if (navLinksContainer) {
        navLinksContainer.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (!anchor) return;
            // ignore clicks not in this nav container
            if (!navLinksContainer.contains(anchor)) return;

            const href = anchor.getAttribute('href');
            const dataTarget = anchor.dataset.target || null;

            // If it's an internal hash link like #project, prevent default and switch
            if ((href && href.startsWith('#')) || dataTarget) {
                e.preventDefault();
                const target = dataTarget || (href ? href.replace(/^#/, '') : null);
                if (target) switchPage(target);
                return;
            }

            // If it's an external or full-page link, allow default navigation
        });
    }

    // CTA buttons (may be outside nav)
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target') || btn.dataset.target;
            if (target) {
                e.preventDefault && e.preventDefault();
                switchPage(target);
            }
        });
    });

    // Initialize page from hash (if present) or default to hero
    const initial = window.location.hash ? window.location.hash.replace('#', '') : 'hero';
    // ensure initial exists, otherwise fallback to hero
    if (document.getElementById(initial)) {
        switchPage(initial);
    } else {
        switchPage('hero');
    }

});