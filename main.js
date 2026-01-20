document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on every page load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Initialise Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothHover: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);


    // 1. MANEJO DEL SCROLL Y MENÚ MÓVIL
    const header = document.getElementById('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    const isCatalogue = window.location.href.includes('catalogo.html');

    const handleScroll = () => {
        if (header) {
            if (window.scrollY > 50 || isCatalogue) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
    }

    // Cerrar menú al hacer click en un enlace
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').classList.replace('ph-x', 'ph-list');
                }
            });
        });
    }

    // 2. REVEAL ANIMATIONS ON SCROLL
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 3. ASISTENTE DE CHAT LUX
    const chatTrigger = document.getElementById('chat-trigger');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatOptions = document.querySelectorAll('.chat-opt');
    const chatHint = document.getElementById('chat-hint');

    if (chatTrigger && chatWindow && closeChat) {
        chatTrigger.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
            if (chatHint) chatHint.classList.remove('active');
        });

        closeChat.addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });

        // Show hint after 5 seconds if chat hasn't been opened
        setTimeout(() => {
            if (chatHint && chatWindow.style.display !== 'flex') {
                chatHint.classList.add('active');
            }
        }, 5000);
    }

    const botResponses = {
        precios: "Nuestros precios varían según el tejido. Los ponchos están desde los $45.000, los chalecos desde $35.000 y los accesorios como gorros y bufandas desde los $12.000. ¡Pura calidad po'!",
        productos: "Tenemos de todo un poco: ponchos con diseños tradicionales, chalecos bien abrigados, gorros, bufandas y hasta pieceras. Todo 100% lana natural de oveja.",
        horarios: "¡Te esperamos! Atendemos de Lunes a Sábado de 10:00 a 19:00 hrs, y los Domingos de 11:00 a 15:00 hrs.",
        ubicacion: "Estamos en pleno centro de La Ligua, en la Calle Comercio 123. Es fácil llegar, ¡no te pierdas!"
    };

    if (chatOptions.length > 0 && chatBody) {
        chatOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                const type = opt.getAttribute('data-ans');
                const question = opt.textContent;

                // Añadir mensaje de usuario
                addMessage(question, 'user');

                // Simular "escribiendo"
                setTimeout(() => {
                    addMessage(botResponses[type], 'bot');
                }, 800);
            });
        });
    }

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 4. LANDING FORM SUBMISSION
    const landingForm = document.getElementById('landing-form');
    if (landingForm) {
        landingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = landingForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            // Estado de carga
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                // Estado de éxito
                btn.textContent = '¡Mensaje Enviado!';
                btn.style.background = '#25D366';
                btn.style.borderColor = '#25D366';
                btn.style.color = 'white';
                btn.style.opacity = '1';

                landingForm.reset();

                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }

    // 6. QUICK VIEW MODAL LOGIC
    const modal = document.getElementById('quick-view-modal');
    const modalClose = document.getElementById('modal-close');
    const productCards = document.querySelectorAll('[data-name]');

    if (modal && modalClose) {
        const modalImgSide = modal.querySelector('.modal-img-side');
        const modalImg = document.getElementById('modal-img');

        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();

                const name = card.dataset.name;
                const desc = card.dataset.desc;
                const mat = card.dataset.mat;
                const dim = card.dataset.dim;
                const price = card.dataset.price;
                const imgElement = card.querySelector('img');
                const imgSrc = imgElement ? imgElement.src : '';
                const tagElement = card.querySelector('.tag-lux');
                const tag = tagElement ? tagElement.textContent : 'Colección';

                document.getElementById('modal-title').textContent = name;
                document.getElementById('modal-desc').textContent = desc;
                document.getElementById('modal-material').textContent = mat;
                document.getElementById('modal-dim').textContent = dim;
                document.getElementById('modal-price').textContent = price;
                modalImg.src = imgSrc;
                document.getElementById('modal-tag').textContent = tag;

                const waBase = "https://wa.me/56912345678";
                const message = encodeURIComponent(`Hola! Me interesa obtener más información sobre el producto: ${name} de la ${tag}.`);
                document.getElementById('modal-wa').href = `${waBase}?text=${message}`;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Dynamic Zoom Origin Logic
        if (modalImgSide && modalImg) {
            modalImgSide.addEventListener('mousemove', (e) => {
                const rect = modalImgSide.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                modalImg.style.transformOrigin = `${x}% ${y}%`;
            });

            modalImgSide.addEventListener('mouseleave', () => {
                modalImg.style.transformOrigin = 'center';
            });
        }

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (modalImg) modalImg.style.transformOrigin = 'center';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modalClose.click();
            }
        });
    }

    // 7. SMOOTH PAGE TRANSITIONS
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])');

    if (transitionOverlay) {
        window.addEventListener('pageshow', () => {
            transitionOverlay.classList.remove('active');
        });

        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.target.closest('[data-name]')) {
                    return;
                }

                const href = link.getAttribute('href');
                const isExternal = href.startsWith('http') && !href.includes(window.location.host);

                if (href && !href.includes('#') && !isExternal) {
                    e.preventDefault();
                    transitionOverlay.classList.add('active');

                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                }
            });
        });
    }
});

// 4. PRELOADER
window.addEventListener('load', () => {
    // Ensure we are at the top when the page is fully loaded
    window.scrollTo(0, 0);
    const preloader = document.querySelector('.preloader');

    if (preloader) {
        const preloaderShown = sessionStorage.getItem('preloaderShown');

        if (preloaderShown) {
            // If already shown in this session, hide immediately
            preloader.style.display = 'none';
            document.body.classList.add('is-loaded');
        } else {
            // First time in session, show with animation
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.classList.add('is-loaded');
                sessionStorage.setItem('preloaderShown', 'true');
            }, 800);
        }
    }
});

// 5. SCROLL SPY (Navigation Highlight)
const sections = document.querySelectorAll('section[id]');
const navLinksSpy = document.querySelectorAll('.nav-links a');

// Highlight Catalogue if we are on that page
const isCataloguePage = window.location.href.includes('catalogo.html');
if (isCataloguePage) {
    navLinksSpy.forEach(link => {
        if (link.getAttribute('href').includes('catalogo.html')) {
            link.classList.add('active');
        }
    });
}

const spyOptions = {
    threshold: 0.3, // Se activa cuando el 30% de la sección es visible
    rootMargin: "-100px 0px -50% 0px" // Ajuste para el header fijo
};

const observerSpy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinksSpy.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(id)) {
                    link.classList.add('active');
                }
                // Special case for Catalogue Preview on Home
                if (id === 'catalogo-home' && link.getAttribute('href').includes('catalogo.html')) {
                    link.classList.add('active');
                }
            });
        }
    });
}, spyOptions);

sections.forEach(section => {
    observerSpy.observe(section);
});
