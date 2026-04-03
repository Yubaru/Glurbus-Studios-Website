// ─── Mark JS as active ──────────────────────────────────────────────────────
document.documentElement.classList.add('js-ready');

// ─── Hamburger Menu ──────────────────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

if (hamburgerBtn && navLinks) {
    // Inject the dim overlay into the body
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const openMenu = () => {
        hamburgerBtn.classList.add('open');
        navLinks.classList.add('mobile-open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        hamburgerBtn.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    };

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close when tapping the dim overlay
    overlay.addEventListener('click', closeMenu);

    // Close when tapping any nav link
    document.querySelectorAll('.nav-close-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}


// ─── Navbar Scroll Effect ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLogoImgs = document.querySelectorAll('#navbar .logo-img');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navLogoImgs.forEach(img => {
                if (!img.src.includes('logo_onlywords')) {
                    // Build a safe absolute path swap
                    img.src = img.src.replace(/logo[^/]*\.png([^/]*)$/, 'logo_onlywords.png$1');
                }
            });
        } else {
            navbar.classList.remove('scrolled');
            navLogoImgs.forEach(img => {
                if (img.src.includes('logo_onlywords')) {
                    img.src = img.src.replace('logo_onlywords.png', 'logo.png');
                }
            });
        }
    });
}

// ─── Secret Logo Easter Egg ──────────────────────────────────────────────────
const homeLogo = document.getElementById('home-logo');
if (homeLogo) {
    let clickCount = 0;
    let resetTimer = null;

    homeLogo.addEventListener('click', (e) => {
        e.preventDefault();
        clickCount++;

        homeLogo.style.filter = 'brightness(2) drop-shadow(0 0 15px #FBBF24)';
        setTimeout(() => { homeLogo.style.filter = ''; }, 150);

        if (clickCount >= 5) {
            clickCount = 0;
            clearTimeout(resetTimer);
            window.location.href = 'secret.html';
            return;
        }

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { clickCount = 0; }, 1500);
    });
}

// ─── Intersection Observer for Fade-In Animations ───────────────────────────
if ('IntersectionObserver' in window) {
    // One-shot observer: animates once and stops watching
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    // Repeatable observer: for game showcase cards (re-animates on scroll back)
    const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.2 });

    document.querySelectorAll('.fade-in').forEach(el => {
        if (el.closest('.game-showcase-section')) {
            showcaseObserver.observe(el);
        } else {
            observer.observe(el);
        }
    });
} else {
    // Fallback: no IntersectionObserver support — just show everything
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
}

// ─── Dynamic Background + Timeline (Games Page Only) ────────────────────────
const dynamicBg = document.getElementById('dynamicBg');
const timelineProgress = document.getElementById('timelineProgress');
const showcaseSections = document.querySelectorAll('.game-showcase-section');

if (dynamicBg && showcaseSections.length > 0) {
    // Show first game's background immediately on load
    const firstBg = showcaseSections[0].getAttribute('data-bg');
    if (firstBg) {
        dynamicBg.style.backgroundImage = `url('${firstBg}')`;
        dynamicBg.style.opacity = 1;
    }

    // Activate first timeline dot
    const firstDot = document.getElementById('dot-0');
    if (firstDot) firstDot.classList.add('active');

    // Scroll progress bar
    window.addEventListener('scroll', () => {
        if (!timelineProgress) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        timelineProgress.style.height = pct + '%';
    });

    // Background + dot switching
    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bgImage = entry.target.getAttribute('data-bg');
                    const idx = entry.target.getAttribute('data-index');

                    if (bgImage) {
                        dynamicBg.style.backgroundImage = `url('${bgImage}')`;
                        dynamicBg.style.opacity = 1;
                    }

                    document.querySelectorAll('.node-dot').forEach(d => d.classList.remove('active'));
                    const activeDot = document.getElementById(`dot-${idx}`);
                    if (activeDot) activeDot.classList.add('active');
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.5 });

        showcaseSections.forEach(section => bgObserver.observe(section));
    }
}
