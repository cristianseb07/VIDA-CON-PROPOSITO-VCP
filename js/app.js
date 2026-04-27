/**
 * Oasis de Fe - JS Engine
 * Maneja la hidratación de datos desde JSON
 */

document.addEventListener('DOMContentLoaded', () => {
    const app = new ChurchWeb();
    app.init();
});

class ChurchWeb {
    constructor() {
        this.config = null;
        this.noticias = [];
        this.eventos = [];
        this.multimedia = null;
    }

    async init() {
        try {
            await this.loadData();
            this.renderConfig();
            this.renderEvents();
            this.renderNews();
            this.renderMultimedia();
            this.setupTheme();
            this.setupMenu();
            this.setupForms();
            this.setupYouTube();
            this.setupAnimations();
            console.log('🚀 Web Hidratada correctamente (Modo Manual/Config)');
        } catch (error) {
            console.error('❌ Error al inicializar la web:', error);
            this.showErrorMessage();
        }
    }

    setupTheme() {
        const toggle = document.getElementById('theme-toggle');
        const body = document.body;
        const icon = toggle.querySelector('i');

        // Preferencia guardada
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme, icon);

        toggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme, icon);
        });
    }

    updateThemeIcon(theme, icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    async loadData() {
        // Ahora cargamos directamente desde las variables globales de los archivos .js
        // Esto permite que funcione abriendo el archivo directamente con doble clic (file://)
        this.config = CONFIG_DATA;
        this.noticias = NOTICIAS_DATA;
        this.eventos = EVENTOS_DATA;
        this.multimedia = MULTIMEDIA_DATA;
    }

    renderConfig() {
        const { nombre_iglesia, nombre_navbar, nombre_bienvenida, logo, mensaje_bienvenida, mision, vision, direccion, contacto, redes_sociales } = this.config;

        // General
        document.title = `${nombre_iglesia} - Comunidad Cristiana`;
        document.getElementById('church-name').textContent = nombre_navbar || nombre_iglesia;
        document.getElementById('footer-church-name').textContent = nombre_iglesia;
        document.getElementById('copyright-name').textContent = nombre_iglesia;

        // Logo in header (Si hay logo en config lo usamos, si no mantenemos el icono default)
        if (logo && logo !== "") {
            const logoContainer = document.querySelector('.logo-container');
            logoContainer.innerHTML = `<img src="${logo}" alt="${nombre_iglesia}" class="main-logo"> <span id="church-name" style="font-family: 'Outfit', sans-serif;">${nombre_navbar || nombre_iglesia}</span>`;
        }

        // Hero
        const welcomeHero = document.getElementById('home');
        if (this.config.fondo_hero) {
            welcomeHero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${this.config.fondo_hero}')`;
            welcomeHero.style.backgroundSize = 'cover';
            welcomeHero.style.backgroundPosition = 'center';
            welcomeHero.classList.add('hero-custom-bg');
        }

        document.getElementById('welcome-title').textContent = `Bienvenidos a ${nombre_bienvenida || nombre_iglesia}`;
        document.getElementById('welcome-message').textContent = mensaje_bienvenida;

        // Nosotros
        document.getElementById('mision-text').textContent = mision;
        document.getElementById('vision-text').textContent = vision;

        // Footer & Contacto
        document.getElementById('footer-address').innerHTML = `<i class="fas fa-location-dot"></i> ${direccion}`;
        document.getElementById('footer-email').innerHTML = `<i class="fas fa-envelope"></i> ${contacto.email}`;

        const phonesContainer = document.getElementById('footer-phones');
        phonesContainer.innerHTML = ''; 
        contacto.telefonos.forEach(tel => {
            const p = document.createElement('p');
            p.innerHTML = `<i class="fas fa-phone"></i> ${tel}`;
            phonesContainer.appendChild(p);
        });

        // Redes Sociales
        const socialContainer = document.getElementById('social-links');
        socialContainer.innerHTML = '';
        const networks = [
            { id: 'instagram', icon: 'fab fa-instagram' },
            { id: 'tiktok', icon: 'fab fa-tiktok' },
            { id: 'facebook', icon: 'fab fa-facebook' },
            { id: 'youtube_channel_url', icon: 'fab fa-youtube', key: 'youtube_channel_url' }
        ];

        networks.forEach(net => {
            const url = redes_sociales[net.key || net.id];
            if (url) {
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.innerHTML = `<i class="${net.icon}"></i>`;
                socialContainer.appendChild(a);
            }
        });

        // WhatsApp Floating Button
        const waBtn = document.getElementById('whatsapp-btn');
        waBtn.href = `https://wa.me/${contacto.whatsapp_numero}?text=${encodeURIComponent(contacto.whatsapp_mensaje_predefinido)}`;

        // Links de "Ver más"
        document.getElementById('btn-instagram-more').href = redes_sociales.instagram;
        document.getElementById('btn-youtube-more').href = redes_sociales.youtube_channel_url;
    }

    async renderMultimedia() {
        if (!this.multimedia) return;

        // --- YOUTUBE REEL (CON FLASHES AL PASAR EL MOUSE) ---
        const ytGrid = document.getElementById('youtube-feed-grid');
        if (ytGrid && this.multimedia.youtube) {
            ytGrid.innerHTML = '';
            this.multimedia.youtube.forEach(vid => {
                const card = document.createElement('div');
                card.className = 'card reel-item youtube-card';
                card.innerHTML = `
                    <div class="video-preview-hover" onclick="window.open('${vid.link}', '_blank')" style="cursor:pointer">
                        <img src="${vid.thumbnail}" class="card-img" alt="${vid.titulo}" data-id="${vid.video_id}">
                        <div class="card-content">
                            <h4 style="font-size: 0.9rem; line-height: 1.2; margin-bottom: 5px;">${vid.titulo}</h4>
                            <p style="font-size: 0.75rem; color: var(--text-soft);">${new Date(vid.fecha).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
                ytGrid.appendChild(card);

                // Efecto Flashes
                const img = card.querySelector('img');
                let interval;
                let frame = 1;

                card.addEventListener('mouseenter', () => {
                    interval = setInterval(() => {
                        img.src = `https://img.youtube.com/vi/${vid.video_id}/${frame}.jpg`;
                        frame = frame >= 3 ? 1 : frame + 1;
                    }, 500);
                });

                card.addEventListener('mouseleave', () => {
                    clearInterval(interval);
                    img.src = vid.thumbnail;
                });
            });
        }

        // --- INSTAGRAM IMAGES (O FALLBACK AUTOMÁTICO) ---
        const igImgGrid = document.getElementById('instagram-images-reel');
        const widgetUrl = this.config.redes_sociales.instagram_widget_url;

        if (igImgGrid && widgetUrl && widgetUrl !== "") {
            // Si hay un widget configurado, lo usamos
            igImgGrid.parentElement.innerHTML = `
                <h3 class="section-subtitle"><i class="fab fa-instagram"></i> Lo nuevo en Instagram</h3>
                <div class="instagram-widget-container" style="width:100%; min-height: 400px; overflow: hidden; border-radius: 12px;">
                    <iframe src="${widgetUrl}" scrolling="no" allowtransparency="true" class="lightwidget-widget" style="width:100%; border:0; overflow:hidden;"></iframe>
                </div>
            `;
        } else if (igImgGrid) {
            // Si no hay widget, mostramos las imágenes de multimedia.js o simulamos con YouTube
            const displayData = (this.multimedia.instagram_images && this.multimedia.instagram_images.length > 0) 
                ? this.multimedia.instagram_images 
                : (this.multimedia.youtube || []).map(v => ({ imagen: v.thumbnail, link: v.link, caption: v.titulo }));

            igImgGrid.innerHTML = '';
            if (displayData.length > 0) {
                displayData.forEach(post => {
                    const card = document.createElement('div');
                    card.className = 'card instagram-card reel-item';
                    card.innerHTML = `
                        <div class="instagram-preview" onclick="window.open('${post.link}', '_blank')" style="cursor:pointer; position: relative; overflow: hidden; aspect-ratio: 1/1;">
                            <img src="${post.imagen}" class="card-img" alt="Post" onerror="this.src='https://img.youtube.com/vi/${post.video_id || 'default'}/0.jpg'" style="object-fit: cover; height: 100%; width: 100%; transition: transform 0.3s ease;">
                            <div class="instagram-overlay">
                                <i class="fab fa-instagram"></i>
                            </div>
                        </div>
                    `;
                    igImgGrid.appendChild(card);
                });
            } else {
                igImgGrid.innerHTML = '<p style="padding: 1rem; color: var(--text-soft)">Agrega imágenes en multimedia.js para verlas aquí.</p>';
            }
        }

        // --- INSTAGRAM VIDEOS (PLAY ON HOVER) ---
        const igVidGrid = document.getElementById('instagram-videos-reel');
        if (igVidGrid && this.multimedia.instagram_videos) {
            igVidGrid.innerHTML = '';
            this.multimedia.instagram_videos.forEach(post => {
                const card = document.createElement('div');
                card.className = 'card instagram-card reel-item';
                card.innerHTML = `
                    <div class="instagram-video-container" onclick="window.open('${post.link}', '_blank')" style="cursor:pointer; position: relative; overflow: hidden; aspect-ratio: 9/16; background: #000;">
                        <video class="hover-video" muted loop playsinline poster="${post.preview_img}" style="width:100%; height:100%; object-fit:cover; display:block;">
                            <source src="${post.video_url}" type="video/mp4">
                        </video>
                        <div class="video-play-hint" style="position: absolute; top:50%; left:50%; transform: translate(-50%, -50%); color:rgba(255,255,255,0.8); font-size: 2rem;">
                            <i class="fas fa-play-circle"></i>
                        </div>
                    </div>
                `;
                igVidGrid.appendChild(card);

                const video = card.querySelector('video');
                const hint = card.querySelector('.video-play-hint');

                card.addEventListener('mouseenter', () => {
                    video.play();
                    hint.style.display = 'none';
                });

                card.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                    hint.style.display = 'block';
                });
            });
        }

        // Estilos extra para hover de Instagram
        if (!document.getElementById('multimedia-styles')) {
            const style = document.createElement('style');
            style.id = 'multimedia-styles';
            style.innerHTML = `
                .instagram-preview:hover img { transform: scale(1.1); }
                .instagram-overlay {
                    position: absolute; top:0; left:0; width:100%; height:100%; 
                    background: rgba(0,0,0,0.4); display:flex; align-items:center; 
                    justify-content:center; opacity:0; transition: opacity 0.3s ease;
                }
                .instagram-preview:hover .instagram-overlay { opacity: 1; }
                .instagram-overlay i { color: white; font-size: 1.5rem; }
                .instagram-video-container:hover .hover-video { transform: scale(1.02); }
            `;
            document.head.appendChild(style);
        }
    }

    renderEvents() {
        const grid = document.getElementById('eventos-grid');
        grid.innerHTML = '';

        // Ordenar por fecha (más cercanos primero)
        const sortedEvents = this.eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        sortedEvents.forEach(evento => {
            const dateObj = new Date(evento.fecha);
            const dateStr = dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-info"><i class="far fa-calendar-alt"></i> ${dateStr} | ${evento.hora}</div>
                    <h3 class="card-title">${evento.titulo}</h3>
                    <p class="card-info"><i class="fas fa-location-arrow"></i> ${evento.ubicacion}</p>
                    <p>${evento.descripcion}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    renderNews() {
        const grid = document.getElementById('noticias-grid');
        grid.innerHTML = '';

        this.noticias.forEach(noticia => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${noticia.imagen}" alt="${noticia.titulo}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1000'">
                <div class="card-content">
                    <div class="card-info">${new Date(noticia.fecha).toLocaleDateString()}</div>
                    <h3 class="card-title">${noticia.titulo}</h3>
                    <p>${noticia.descripcion}</p>
                    <button class="btn btn-primary" style="margin-top: 1rem; padding: 8px 20px; font-size: 0.9rem;">Leer más</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    setupMenu() {
        const toggle = document.getElementById('menu-toggle');
        const nav = document.querySelector('nav ul');

        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.querySelector('i').classList.toggle('fa-bars');
            toggle.querySelector('i').classList.toggle('fa-times');
        });

        // Cerrar menú al hacer click en un link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                toggle.querySelector('i').classList.add('fa-bars');
                toggle.querySelector('i').classList.remove('fa-times');
            });
        });
    }

    setupForms() {
        const prayerForm = document.getElementById('prayer-form');
        prayerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('prayer-name').value || 'Anónimo';
            const message = document.getElementById('prayer-message').value;
            const waNumber = this.config.contacto.whatsapp_numero;

            const text = `🙏 *Pedido de Oración*\n\n*Nombre:* ${name}\n*Mensaje:* ${message}`;
            const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }

    setupYouTube() {
        const container = document.getElementById('video-container');
        const videoId = this.config.youtube_embed_id;

        // La forma más compatible de incrustar YouTube en archivos locales (file://)
        // es usar la URL de embed más simple posible, sin parámetros de API o JS.
        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
        
        container.innerHTML = `
            <iframe 
                id="main-yt-player"
                src="${embedUrl}" 
                title="Mensaje de hoy" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }



    setupAnimations() {
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card, .section-title, .form-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    showErrorMessage() {
        document.body.innerHTML = `
            <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:20px;">
                <h1 style="color:var(--primary)">Huston, tenemos un problema</h1>
                <p>No pudimos cargar la configuración de la web. Por favor, asegúrate de que los archivos JSON existan y tengan el formato correcto.</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top:20px">Reintentar</button>
            </div>
        `;
    }
}
