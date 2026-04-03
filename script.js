// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const navLogoImgs = document.querySelectorAll('#navbar .logo-img');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navLogoImgs.forEach(img => {
            img.src = img.src.includes('logo_onlywords') ? img.src : img.src.replace(/logo.*\.png/, 'logo_onlywords.png');
        });
    } else {
        navbar.classList.remove('scrolled');
        navLogoImgs.forEach(img => {
            img.src = img.src.replace('logo_onlywords.png', 'logo.png');
        });
    }
});

// ===== SECRET LOGO EASTER EGG =====
const homeLogo = document.getElementById('home-logo');
if (homeLogo) {
    let clickCount = 0;
    let resetTimer = null;

    homeLogo.addEventListener('click', (e) => {
        e.preventDefault(); // stop normal navigation while counting
        clickCount++;

        // Flash the logo on each click
        homeLogo.style.filter = 'brightness(2) drop-shadow(0 0 15px #FBBF24)';
        setTimeout(() => homeLogo.style.filter = '', 150);

        if (clickCount >= 5) {
            // Unlock! Navigate to secret page
            clickCount = 0;
            clearTimeout(resetTimer);
            window.location.href = 'secret.html';
            return;
        }

        // Reset counter if no click within 1.5 seconds
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            clickCount = 0;
        }, 1500);
    });
}

// Intersection Observer for scroll animations (one-shot for most elements)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target); // fire once
        }
    });
}, observerOptions);

// Repeatable observer for showcase content (re-animates on scroll back)
const showcaseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Remove so animation replays when scrolled back into view
            entry.target.classList.remove('visible');
        }
    });
}, { root: null, rootMargin: '0px', threshold: 0.2 });

document.querySelectorAll('.fade-in').forEach(element => {
    // Use repeatable observer for showcase content, one-shot for everything else
    if (element.closest('.game-showcase-section')) {
        showcaseObserver.observe(element);
    } else {
        observer.observe(element);
    }
});

// Dynamic Background + Timeline for Games Page
const dynamicBg = document.getElementById('dynamicBg');
const timelineProgress = document.getElementById('timelineProgress');
const showcaseSections = document.querySelectorAll('.game-showcase-section');

if (dynamicBg && showcaseSections.length > 0) {
    // Instantly show first game background on load
    const firstBg = showcaseSections[0].getAttribute('data-bg');
    dynamicBg.style.backgroundImage = `url('${firstBg}')`;
    dynamicBg.style.opacity = 1;

    // Activate first dot on load
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

    // Background + dot switching observer
    const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bgImage = entry.target.getAttribute('data-bg');
                const idx = entry.target.getAttribute('data-index');

                if (bgImage) {
                    dynamicBg.style.backgroundImage = `url('${bgImage}')`;
                    dynamicBg.style.opacity = 1;
                }

                // Deactivate all dots, activate the current one
                document.querySelectorAll('.node-dot').forEach(d => d.classList.remove('active'));
                const activeDot = document.getElementById(`dot-${idx}`);
                if (activeDot) activeDot.classList.add('active');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.5 });

    showcaseSections.forEach(section => bgObserver.observe(section));
}
