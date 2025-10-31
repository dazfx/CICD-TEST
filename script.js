// Мобильное меню
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Изменение навигации при прокрутке
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Обработка формы с имитацией отправки и сообщениями
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function validateEmail(email) {
    return /.+@.+\..+/.test(email);
}

function validatePhone(phone) {
    return /[0-9()+\-\s]{6,}/.test(phone);
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // очистить прошлые ошибки
    [name, phone, email, message].forEach(i => i.classList.remove('invalid'));

    const isValid = name.value.trim() && validatePhone(phone.value) && validateEmail(email.value) && message.value.trim();

    if (!isValid) {
        if (!name.value.trim()) name.classList.add('invalid');
        if (!validatePhone(phone.value)) phone.classList.add('invalid');
        if (!validateEmail(email.value)) email.classList.add('invalid');
        if (!message.value.trim()) message.classList.add('invalid');

        formStatus.textContent = 'Пожалуйста, заполните корректно все поля формы.';
        formStatus.className = 'form-status show error';
        contactForm.classList.remove('shake');
        // триггерим анимацию shake
        void contactForm.offsetWidth;
        contactForm.classList.add('shake');
        return;
    }

    // Имитация отправки
    formStatus.textContent = 'Отправляем...';
    formStatus.className = 'form-status show info';
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;

    setTimeout(() => {
        // 90% успеха
        const success = Math.random() > 0.1;
        if (success) {
            formStatus.textContent = 'Спасибо! Заявка успешно отправлена. Мы свяжемся с вами.';
            formStatus.className = 'form-status show success';
            contactForm.reset();
        } else {
            formStatus.textContent = 'Что-то пошло не так. Попробуйте ещё раз позднее.';
            formStatus.className = 'form-status show error';
        }
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
    }, 1200);
});

// Анимация при прокрутке (Intersection Observer)
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за элементами с анимацией (через классы) — включаем больше селекторов
const revealSelectors = [ '.section-header', '.service-card', '.about-text', '.about-photo', '.case-card', '.testimonial-card', '.team-card', '.contact-form-wrapper', '.contact-item' ];
document.querySelectorAll(revealSelectors.join(',')).forEach((el, idx) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min((idx % 6) * 60, 240)}ms`;
    observer.observe(el);
});

// Кнопка "Консультация" в навбаре
const contactBtn = document.querySelector('.contact-btn');
contactBtn.addEventListener('click', () => {
    const contactsSection = document.querySelector('#contacts');
    if (contactsSection) {
        const offsetTop = contactsSection.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
});

// 3D фон на canvas с параллаксом
(function init3DBackground() {
    const canvas = document.getElementById('bg3d');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const particlesCount = 80;
    const particles = [];
    const depthMin = 0.3, depthMax = 1.0;
    let mouseX = 0, mouseY = 0;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createParticle() {
        return { x: rand(0, width), y: rand(0, height), z: rand(depthMin, depthMax), vx: rand(-0.2, 0.2), vy: rand(-0.2, 0.2), size: rand(1.2, 3.2) };
    }

    for (let i = 0; i < particlesCount; i++) particles.push(createParticle());

    function resize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);

    let ticking = false;
    window.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const rect = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            ticking = false;
        });
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
            // параллакс с учётом глубины
            const px = p.x + mouseX * 20 * (1 - p.z);
            const py = p.y + mouseY * 20 * (1 - p.z);
            const radius = p.size * (1.8 - p.z);

            const grd = ctx.createRadialGradient(px, py, 0, px, py, radius * 3);
            grd.addColorStop(0, 'rgba(255,255,255,0.9)');
            grd.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();

            // движение с учётом глубины
            p.x += p.vx * p.z;
            p.y += p.vy * p.z;

            if (p.x < -50) p.x = width + 50;
            if (p.x > width + 50) p.x = -50;
            if (p.y < -50) p.y = height + 50;
            if (p.y > height + 50) p.y = -50;
        }

        requestAnimationFrame(draw);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
        draw();
    }

    window.addEventListener('blur', () => cancelAnimationFrame(draw));
})();

// Эффект наклона карточек и изображения (усилен и расширен)
(function initTilt() {
    const tiltable = document.querySelectorAll('.service-card, .image-placeholder, .case-card, .team-card');
    tiltable.forEach(el => {
        el.classList.add('tiltable');
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width; // 0..1
            const y = (e.clientY - rect.top) / rect.height; // 0..1
            const rotateY = (x - 0.5) * 14; // больше глубины
            const rotateX = (0.5 - y) * 14;
            el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        });
    });
})();

// Параллакс слоёв hero (decor blobs/grid)
(function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const layers = hero.querySelectorAll('.hero-decor .blob, .hero-decor .grid');
    if (!layers.length) return;
    let ticking = false;
    hero.addEventListener('mousemove', (e) => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
            const rect = hero.getBoundingClientRect();
            const rx = (e.clientX - rect.left) / rect.width - 0.5;
            const ry = (e.clientY - rect.top) / rect.height - 0.5;
            layers.forEach((el, i) => {
                const depth = 8 + i * 6;
                el.style.transform = `translate3d(${(-rx * depth)}px, ${(-ry * depth)}px, 0)`;
            });
            ticking = false;
        });
    });
})();

// Переключение темы с сохранением
(function initTheme() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);

    toggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        if (next === 'light') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', 'dark');
        }
        localStorage.setItem('theme', next);
    });
})();
