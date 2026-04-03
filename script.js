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

// ─── Expanding Theater Videos ────────────────────────────────────────────────
const expandableVideos = document.querySelectorAll('.js-expandable-video');
if (expandableVideos.length > 0) {
    // Create global backdrop
    const theaterBackdrop = document.createElement('div');
    theaterBackdrop.className = 'theater-backdrop';
    theaterBackdrop.innerHTML = `<button class="close-theater" aria-label="Close video">&times;</button>`;
    document.body.appendChild(theaterBackdrop);
    const closeBtn = theaterBackdrop.querySelector('.close-theater');

    let activeVideoContainer = null;
    let placeholderMap = new Map(); // to keep original exact position empty

    const closeTheater = () => {
        if (!activeVideoContainer) return;

        const videoEl = activeVideoContainer.querySelector('video');
        if (videoEl) {
            videoEl.pause();
            videoEl.removeAttribute('controls');
        }

        // Force a persistent transition on the element itself during the shrink
        activeVideoContainer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

        // Remove expanded class so it falls back to the exact inline fixed position (the original rect)
        activeVideoContainer.classList.remove('expanded-theater');
        
        // Wait for transition to finish before finally stripping inline styles and returning to DOM flow
        setTimeout(() => {
            activeVideoContainer.style.width = '';
            activeVideoContainer.style.height = '';
            activeVideoContainer.style.top = '';
            activeVideoContainer.style.left = '';
            activeVideoContainer.style.transform = '';
            activeVideoContainer.style.margin = '';
            activeVideoContainer.style.transition = '';
            activeVideoContainer.style.position = '';
            activeVideoContainer.style.zIndex = '';

            const placeholder = placeholderMap.get(activeVideoContainer);
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.insertBefore(activeVideoContainer, placeholder);
                placeholder.remove();
            }
            activeVideoContainer = null;
        }, 500); // matches CSS transition duration

        theaterBackdrop.classList.remove('active');
        document.body.style.overflow = ''; // restore scrolling
    };

    expandableVideos.forEach(container => {
        container.addEventListener('click', () => {
            // If already expanded, clicking it again does nothing (users should use X or backdrop to close)
            if (container.classList.contains('expanded-theater')) return;

            activeVideoContainer = container;

            // Get exact bounding rect before modifying anything
            const rect = container.getBoundingClientRect();
            
            // Create an invisible placeholder so the grid doesn't collapse
            const placeholder = document.createElement('div');
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.visibility = 'hidden';
            container.parentNode.insertBefore(placeholder, container);
            placeholderMap.set(container, placeholder);

            // Move container directly to body to avoid clipping issues
            document.body.appendChild(container);

            // Force its initial position to absolute/fixed at exactly where it was
            container.style.position = 'fixed';
            container.style.top = rect.top + 'px';
            container.style.left = rect.left + 'px';
            container.style.width = rect.width + 'px';
            container.style.height = rect.height + 'px';
            container.style.margin = '0';
            container.style.zIndex = '10000';

            // Trigger reflow
            container.offsetHeight; 

            // Add the expanded class which lets CSS animate it to center
            container.classList.add('expanded-theater');
            
            // Show backdrop
            theaterBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent scrolling

            // Wait for transition to finish, then enable controls and play
            setTimeout(() => {
                const videoEl = container.querySelector('video');
                if (videoEl) {
                    videoEl.setAttribute('controls', 'true');
                    videoEl.play();
                }
            }, 500);
        });
    });

    closeBtn.addEventListener('click', closeTheater);
    theaterBackdrop.addEventListener('click', (e) => {
        // Prevent closing if they clicked the button (handled above) or if click bubbled from video
        if (e.target === theaterBackdrop) {
            closeTheater();
        }
    });
}

// ─── Glurbus Cinematic Page Transitions ────────────────────────────────────
(function () {
    const LOGO_SRC = 'assets/logo_glurbus.png';
    const TRANSITION_MS = 700;

    function createOverlay(type) {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay ' + type;
        overlay.innerHTML = '<img src="' + LOGO_SRC + '" alt="" class="transition-logo">';
        return overlay;
    }

    // 1. Reveal: find the hardcoded overlay already in the HTML
    const revealOverlay = document.getElementById('pageReveal');
    if (revealOverlay) {
        // Force the browser to calculate the current position before we tell it to move.
        // This ensures the transition actually animates from 0 to -100% instead of snapping.
        revealOverlay.offsetHeight; 
        
        requestAnimationFrame(() => {
            revealOverlay.classList.add('active');
            setTimeout(() => revealOverlay.remove(), TRANSITION_MS + 200);
        });
    }

    // 2. Intercept internal navigation links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // Skip: no href, external, mailto, hash-only, new-tab
        if (!href || href.startsWith('http') || href.startsWith('mailto') || target === '_blank') return;
        if (href.startsWith('#')) return;

        // Skip: same-page link with hash
        const hrefBase = href.split('#')[0];
        const currentPage = window.location.pathname.split('/').pop();
        if ((hrefBase === currentPage || hrefBase === '') && href.includes('#')) return;

        e.preventDefault();

        // Create the swipe-in mask
        const coverOverlay = createOverlay('swipe-in');
        document.body.appendChild(coverOverlay);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                coverOverlay.classList.add('active');
            });
        });

        // Navigate after the mask fully covers the screen
        setTimeout(() => {
            window.location.href = href;
        }, TRANSITION_MS + 150);
    });

    // 3. Back-button / BFCache fix
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.querySelectorAll('.page-transition-overlay').forEach(el => el.remove());
        }
    });
})();

