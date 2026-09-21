/* =========================================================
   GALAXIA DE FLORES AMARILLAS - MOTOR 3D ESTILO VIRAL TIKTOK
   Desarrollado con Three.js
   ========================================================= */

(function () {
    const config = window.BIRTHDAY_CONFIG || {
        recipientName: "Denise Adileni Martínez Flores",
        title: "¡Feliz Cumpleaños, Denise!",
        subtitle: "Para la flor más hermosa",
        message: "",
        signature: "Con todo mi cariño ✨",
        audioSrc: "musica.mp3",
        floatingMessages: [
            "¡Feliz Cumpleaños! 🎂",
            "Denise Adileni💛",
            "Hermosa sonrisa💛",
            "Brillante 💛",
            "Eres un sol ☀️",
            "La persona favorita de sus amigas✨",
            "Siempre Con sueño 💛",
            "Me Agradas ✨",
            "Una flor bella 🌻",
            "Brillas como nadie 🌟",
            "Te admiro💛",
            "Eres única 💖"
        ]
    };

    // --- VARIABLES THREE.JS ---
    let scene, camera, renderer;
    let galaxyStars;
    let heartPoints;
    let bouquetGroup = new THREE.Group();
    let textSpriteGroup = new THREE.Group();
    let singleFlowersGroup = new THREE.Group();
    let coreMesh, vortexMesh;
    let burstParticles;

    // Control de cámara e interacción
    let targetRotationX = 0.28, targetRotationY = 0;
    let currentRotationX = 0.28, currentRotationY = 0;
    let mouseX = 0, mouseY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraDistance = 52;

    // Audio
    let audio = null;
    let isMusicPlaying = false;

    // Texturas
    const textureLoader = new THREE.TextureLoader();

    // --- GENERADOR DE TEXTURAS PROCEDURALES ---
    function createGlowPointTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.25, 'rgba(255, 235, 120, 0.95)');
        grad.addColorStop(0.55, 'rgba(255, 185, 20, 0.35)');
        grad.addColorStop(1, 'rgba(255, 160, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }

    // Textura para el remolino / vórtice central de la galaxia
    function createVortexTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const cx = 256, cy = 256;

        // Fondo transparente con halo suave
        const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250);
        bgGrad.addColorStop(0, 'rgba(255, 255, 240, 0.9)');
        bgGrad.addColorStop(0.2, 'rgba(255, 220, 80, 0.6)');
        bgGrad.addColorStop(0.5, 'rgba(255, 170, 0, 0.25)');
        bgGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 512, 512);

        // Brazos en espiral luminosa
        ctx.save();
        ctx.translate(cx, cy);
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 4; a += 0.08) {
                const r = Math.pow(a / (Math.PI * 4), 1.2) * 220;
                const x = r * Math.cos(a);
                const y = r * Math.sin(a);
                if (a === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'rgba(255, 245, 180, 0.55)';
            ctx.lineWidth = 14;
            ctx.stroke();
        }
        ctx.restore();

        return new THREE.CanvasTexture(canvas);
    }

    // Textura para flores individuales (Girasoles y Rosas)
    function createSingleFlowerTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const cx = 64, cy = 64;

        // Pétalos dorados
        const petals = 12;
        for (let i = 0; i < petals; i++) {
            const angle = (i / petals) * Math.PI * 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(24, 0, 18, 9, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.95)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 245, 140, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        }

        // Centro cálido
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
        grad.addColorStop(0, '#5a2e00');
        grad.addColorStop(0.7, '#a55b00');
        grad.addColorStop(1, '#ffaa00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }

    // Generador de Sprite de Texto Flotante con Resplandor (igual que en el video)
    function createTextSprite(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.font = 'bold 36px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Resplandor del texto
        ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, 256, 64);

        // Segunda pasada para que quede nítido y radiante
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#fffdf0';
        ctx.fillText(text, 256, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(10, 2.5, 1);
        return sprite;
    }

    // --- INICIALIZACIÓN DE THREE.JS ---
    function init() {
        const canvas = document.getElementById('galaxy-canvas');

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x06060c, 0.01);

        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 22, cameraDistance);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const glowPointTex = createGlowPointTexture();
        const vortexTex = createVortexTexture();
        const singleFlowerTex = createSingleFlowerTexture();

        // 1. Construir la Galaxia Espiral Dorada
        buildSpiralGalaxy(glowPointTex);

        // 2. Vórtice Central y Núcleo Radiante
        buildGalaxyVortex(vortexTex, glowPointTex);

        // 3. Gran Corazón de Polvo Estelar Brillante
        buildStardustHeart(glowPointTex);

        // 4. Ramos de Flores y Textos Flotantes
        buildBouquetsAndLabels();

        // 5. Flores Individuales Flotantes
        buildSingleFloatingFlowers(singleFlowerTex);

        // 6. Polvo Estelar Cósmico y Sistema de Explosión
        buildAmbientStardust(glowPointTex);
        buildBurstSystem(glowPointTex);

        scene.add(bouquetGroup);
        scene.add(textSpriteGroup);
        scene.add(singleFlowersGroup);

        setupEventListeners();
        setupAudio();
        populateHTML();
        animate();
    }

    // --- 1. GALAXIA ESPIRAL DORADA ---
    function buildSpiralGalaxy(particleTexture) {
        const particleCount = 26000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const arms = 4;
        const radius = 46;
        const spin = 1.3;

        const colorCore = new THREE.Color(0xfff7cc);
        const colorGold = new THREE.Color(0xffd700);
        const colorAmber = new THREE.Color(0xff9900);
        const colorStarlight = new THREE.Color(0xffffff);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            const r = Math.pow(Math.random(), 2.3) * radius;
            const spinAngle = r * spin;
            const armAngle = ((i % arms) / arms) * Math.PI * 2;

            const spreadX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.26 + 0.4));
            const spreadY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.14 + 0.2));
            const spreadZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.26 + 0.4));

            positions[i3] = Math.cos(armAngle + spinAngle) * r + spreadX;
            positions[i3 + 1] = spreadY;
            positions[i3 + 2] = Math.sin(armAngle + spinAngle) * r + spreadZ;

            const norm = r / radius;
            let pColor;
            if (norm < 0.22) {
                pColor = colorCore.clone().lerp(colorGold, norm / 0.22);
            } else if (norm < 0.7) {
                pColor = colorGold.clone().lerp(colorAmber, (norm - 0.22) / 0.48);
            } else {
                pColor = colorAmber.clone().lerp(colorStarlight, (norm - 0.7) / 0.3);
            }

            colors[i3] = pColor.r;
            colors[i3 + 1] = pColor.g;
            colors[i3 + 2] = pColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.1,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            map: particleTexture,
            transparent: true,
            opacity: 0.95
        });

        galaxyStars = new THREE.Points(geometry, material);
        scene.add(galaxyStars);
    }

    // --- 2. VÓRTICE CENTRAL Y NÚCLEO LUMINOSO ---
    function buildGalaxyVortex(vortexTex, glowTex) {
        // Disco del vórtice giratorio horizontal
        const vortexGeo = new THREE.PlaneGeometry(28, 28);
        const vortexMat = new THREE.MeshBasicMaterial({
            map: vortexTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        vortexMesh = new THREE.Mesh(vortexGeo, vortexMat);
        vortexMesh.rotation.x = Math.PI / 2;
        scene.add(vortexMesh);

        // Núcleo brillante
        const coreMat = new THREE.SpriteMaterial({
            map: glowTex,
            color: 0xfff6aa,
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 1
        });
        coreMesh = new THREE.Sprite(coreMat);
        coreMesh.scale.set(15, 15, 1);
        scene.add(coreMesh);
    }

    // --- 3. GRAN CORAZÓN DE POLVO ESTELAR DORADO (COMO EN EL VIDEO) ---
    function buildStardustHeart(particleTexture) {
        const heartCount = 3800;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(heartCount * 3);
        const colors = new Float32Array(heartCount * 3);

        const heartScale = 0.58;
        const heartOffsetY = 11.5; // Elevado sobre la galaxia

        for (let i = 0; i < heartCount; i++) {
            const i3 = i * 3;
            // Ecuación paramétrica de corazón
            const t = Math.random() * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

            // Espesor y brillo alrededor de la curva
            const jitter = (Math.random() - 0.5) * 2.6;
            const jitterY = (Math.random() - 0.5) * 2.6;
            const jitterZ = (Math.random() - 0.5) * 3.5;

            positions[i3] = (hx * heartScale) + jitter;
            positions[i3 + 1] = (hy * heartScale) + heartOffsetY + jitterY;
            positions[i3 + 2] = jitterZ;

            // Color amarillo oro brillante
            colors[i3] = 1.0;
            colors[i3 + 1] = 0.82 + Math.random() * 0.18;
            colors[i3 + 2] = 0.25;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.4,
            vertexColors: true,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.95
        });

        heartPoints = new THREE.Points(geometry, material);
        scene.add(heartPoints);

        // Texto central dentro del corazón: "Denise Adileni 💛"
        const centerHeartLabel = createTextSprite(config.floatingMessages && config.floatingMessages[1] ? config.floatingMessages[1] : "Denise Adileni 💛");
        centerHeartLabel.position.set(0, heartOffsetY + 0.8, 0.5);
        centerHeartLabel.scale.set(9.2, 2.3, 1);
        textSpriteGroup.add(centerHeartLabel);
    }

    // --- 4. RAMOS DE FLORES AMARILLAS Y FRASES FLOTANTES ---
    function buildBouquetsAndLabels() {
        const bouquetFiles = [
            'assets/bouquet1.png', // Girasoles y rosas con lazo rosa
            'assets/bouquet2.png', // Rosas amarillas con lazo oro
            'assets/bouquet3.png'  // Tulipanes amarillos envueltos
        ];

        const msgs = (config.floatingMessages && config.floatingMessages.length > 0)
            ? config.floatingMessages
            : [
                "¡Feliz Cumpleaños! 🎂", "Denise Adileni💛", "Hermosa sonrisa💛", "Brillante 💛",
                "Eres un sol ☀️", "La persona favorita de sus amigas✨", "Siempre Con sueño 💛",
                "Me Agradas ✨", "Una flor bella 🌻", "Brillas como nadie 🌟", "Te admiro💛", "Eres única 💖"
            ];

        // Definición de posiciones espaciales para los ramos principales
        const bouquetPlacements = [
            // Ramo 1: Girasoles izquierda
            { file: bouquetFiles[0], pos: [-16, 4, 3], scale: 12, label: msgs[4] || "Eres un sol ☀️" },
            // Ramo 2: Rosas amarillas derecha
            { file: bouquetFiles[1], pos: [17, 6, 2], scale: 12.5, label: msgs[2] || "Hermosa sonrisa💛" },
            // Ramo 3: Tulipanes abajo centro
            { file: bouquetFiles[2], pos: [0.5, -6, 9], scale: 9.5, label: msgs[6] || "Siempre Con sueño 💛" },
            // Ramo 4: Girasoles arriba derecha
            { file: bouquetFiles[0], pos: [12, 12, -8], scale: 8.5, label: msgs[7] || "Me Agradas ✨" },
            // Ramo 5: Rosas izquierda arriba
            { file: bouquetFiles[1], pos: [-11, 10, -6], scale: 8.5, label: msgs[10] || "Te admiro💛" },
            // Ramo 6: Tulipanes centro arriba
            { file: bouquetFiles[2], pos: [0, 8, -4], scale: 7.5, label: msgs[8] || "Una flor bella 🌻" },
            // Ramo 7: Girasoles abajo izquierda
            { file: bouquetFiles[0], pos: [-10, -4, 11], scale: 8, label: msgs[5] || "La persona favorita de sus amigas✨" },
            // Ramo 8: Rosas abajo derecha
            { file: bouquetFiles[1], pos: [14, -3, 10], scale: 8.5, label: msgs[0] || "¡Feliz Cumpleaños! 🎂" }
        ];

        bouquetPlacements.forEach((item, index) => {
            textureLoader.load(item.file, (tex) => {
                const mat = new THREE.SpriteMaterial({
                    map: tex,
                    transparent: true,
                    depthWrite: false
                });
                const sprite = new THREE.Sprite(mat);
                sprite.position.set(item.pos[0], item.pos[1], item.pos[2]);
                sprite.scale.set(item.scale, item.scale, 1);

                sprite.userData = {
                    baseY: item.pos[1],
                    baseX: item.pos[0],
                    speed: 0.0018 + index * 0.0003,
                    offset: index * 1.1,
                    scaleBase: item.scale
                };

                bouquetGroup.add(sprite);

                // Agregar etiqueta de texto flotante debajo/al lado del ramo
                if (item.label) {
                    const labelSprite = createTextSprite(item.label);
                    labelSprite.position.set(item.pos[0], item.pos[1] - item.scale * 0.52, item.pos[2] + 0.8);
                    labelSprite.userData = {
                        parentSprite: sprite,
                        yOffset: -item.scale * 0.52
                    };
                    textSpriteGroup.add(labelSprite);
                }
            });
        });

        // Frases flotantes adicionales en el espacio
        const extraPhrases = [
            { text: msgs[3] || "Brillante 💛", pos: [-3.5, 0.5, 14] },
            { text: msgs[9] || "Brillas como nadie 🌟", pos: [-18, 9, -2] },
            { text: msgs[1] || "Denise Adileni💛", pos: [-2, 13, 1] },
            { text: msgs[11] || "Eres única 💖", pos: [10, 15, -4] },
            { text: "Mis mejores deseos 🎁", pos: [18, -7, 6] },
            { text: "Siempre en tu corazón 💛", pos: [-8, -8, 8] }
        ];

        extraPhrases.forEach((p, idx) => {
            const sp = createTextSprite(p.text);
            sp.position.set(p.pos[0], p.pos[1], p.pos[2]);
            sp.userData = {
                baseY: p.pos[1],
                speed: 0.0015 + idx * 0.0004,
                offset: idx * 0.8
            };
            textSpriteGroup.add(sp);
        });
    }

    // --- 5. FLORES INDIVIDUALES FLOTANTES EN LA GALAXIA ---
    function buildSingleFloatingFlowers(flowerTex) {
        const count = 55;
        for (let i = 0; i < count; i++) {
            const mat = new THREE.SpriteMaterial({
                map: flowerTex,
                transparent: true,
                opacity: 0.92,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(mat);

            const r = 6 + Math.random() * 32;
            const angle = Math.random() * Math.PI * 2;
            sprite.position.x = Math.cos(angle) * r;
            sprite.position.y = (Math.random() - 0.5) * 16;
            sprite.position.z = Math.sin(angle) * r;

            const s = 1.8 + Math.random() * 2.2;
            sprite.scale.set(s, s, 1);

            sprite.userData = {
                r: r,
                angle: angle,
                orbitSpeed: 0.0006 + Math.random() * 0.0008,
                baseY: sprite.position.y,
                offset: Math.random() * Math.PI * 2
            };

            singleFlowersGroup.add(sprite);
        }
    }

    // --- 6. POLVO ESTELAR AMBIENTAL Y CELEBRACIÓN ---
    function buildAmbientStardust(glowTex) {
        const count = 3500;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 130;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 130;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            size: 0.9,
            color: 0xffea88,
            map: glowTex,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        scene.add(new THREE.Points(geo, mat));
    }

    function buildBurstSystem(glowTex) {
        const count = 500;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = 0;
            pos[i * 3 + 1] = 11;
            pos[i * 3 + 2] = 0;

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const speed = Math.random() * 1.5 + 0.5;

            vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            vel[i * 3 + 2] = Math.cos(phi) * speed;

            col[i * 3] = 1.0;
            col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            col[i * 3 + 2] = 0.2;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 2.2,
            vertexColors: true,
            map: glowTex,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0,
            depthWrite: false
        });

        burstParticles = new THREE.Points(geo, mat);
        burstParticles.userData = { vel: vel, life: 0, active: false };
        scene.add(burstParticles);
    }

    function triggerBurst() {
        if (!burstParticles) return;
        const pos = burstParticles.geometry.attributes.position.array;
        const vel = burstParticles.userData.vel;
        for (let i = 0; i < pos.length; i += 3) {
            pos[i] = 0;
            pos[i + 1] = 11.5;
            pos[i + 2] = 0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const speed = Math.random() * 1.6 + 0.5;
            vel[i] = Math.sin(phi) * Math.cos(theta) * speed;
            vel[i + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            vel[i + 2] = Math.cos(phi) * speed;
        }
        burstParticles.geometry.attributes.position.needsUpdate = true;
        burstParticles.material.opacity = 1;
        burstParticles.userData.life = 1.0;
        burstParticles.userData.active = true;
    }

    // --- CONFIGURACIÓN DE AUDIO (MUSICA DEL VIDEO DE TIKTOK) ---
    function setupAudio() {
        audio = new Audio(config.audioSrc || 'musica.mp3');
        audio.loop = true;
        audio.volume = 0.8;
    }

    function playAudio() {
        if (audio) {
            audio.play().then(() => {
                isMusicPlaying = true;
                updateMusicBtn();
            }).catch(e => {
                console.log("Audio esperando interacción del usuario", e);
            });
        }
    }

    function toggleAudio() {
        if (!audio) return;
        if (isMusicPlaying) {
            audio.pause();
            isMusicPlaying = false;
        } else {
            audio.play();
            isMusicPlaying = true;
        }
        updateMusicBtn();
    }

    function updateMusicBtn() {
        const btn = document.getElementById('music-toggle-btn');
        if (!btn) return;
        if (isMusicPlaying) {
            btn.classList.add('playing');
            btn.innerHTML = '🎵';
            btn.title = 'Silenciar Música';
        } else {
            btn.classList.remove('playing');
            btn.innerHTML = '🔇';
            btn.title = 'Reproducir Música';
        }
    }

    // --- EVENTOS DE INTERACCIÓN ---
    function setupEventListeners() {
        window.addEventListener('resize', onWindowResize);

        // Control con ratón
        window.addEventListener('mousedown', (e) => {
            if (e.target.closest('.ui-container') || e.target.closest('.modal-backdrop') || e.target.closest('.intro-screen')) return;
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0006;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0006;

            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;
                targetRotationY += deltaX * 0.005;
                targetRotationX += deltaY * 0.005;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        // Pantalla táctil
        let touchStartDist = 0;
        window.addEventListener('touchstart', (e) => {
            if (e.target.closest('.ui-container') || e.target.closest('.modal-backdrop') || e.target.closest('.intro-screen')) return;
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2) {
                touchStartDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - previousMousePosition.x;
                const deltaY = e.touches[0].clientY - previousMousePosition.y;
                targetRotationY += deltaX * 0.006;
                targetRotationX += deltaY * 0.006;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2) {
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const delta = touchStartDist - dist;
                cameraDistance = Math.min(85, Math.max(22, cameraDistance + delta * 0.05));
                touchStartDist = dist;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => { isDragging = false; });

        // Zoom rueda
        window.addEventListener('wheel', (e) => {
            cameraDistance = Math.min(85, Math.max(22, cameraDistance + e.deltaY * 0.035));
        }, { passive: true });

        // Botón Iniciar Experiencia
        const startBtn = document.getElementById('start-experience-btn');
        const introScreen = document.getElementById('intro-screen');
        if (startBtn && introScreen) {
            startBtn.addEventListener('click', () => {
                introScreen.classList.add('hidden');
                playAudio();
                triggerBurst();
            });
        }

        // Botones Modal
        const openCardBtn = document.getElementById('open-card-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalBackdrop = document.getElementById('modal-backdrop');

        if (openCardBtn) {
            openCardBtn.addEventListener('click', () => {
                modalBackdrop.classList.add('active');
                triggerBurst();
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modalBackdrop.classList.remove('active');
            });
        }

        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
            });
        }

        // Botón Música
        const musicBtn = document.getElementById('music-toggle-btn');
        if (musicBtn) musicBtn.addEventListener('click', toggleAudio);

        // Botón Pantalla Completa
        const fsBtn = document.getElementById('fullscreen-btn');
        if (fsBtn) {
            fsBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { });
                else if (document.exitFullscreen) document.exitFullscreen();
            });
        }

        // Botón Lluvia de estrellas
        const burstBtn = document.getElementById('burst-btn');
        if (burstBtn) burstBtn.addEventListener('click', triggerBurst);
    }

    function onWindowResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // --- ANIMACIÓN Y RENDER (60 FPS) ---
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        // Rotación de galaxia espiral
        if (galaxyStars) {
            galaxyStars.rotation.y += 0.001;
        }

        // Rotación del vórtice central
        if (vortexMesh) {
            vortexMesh.rotation.z -= 0.003;
        }

        // Pulsación del núcleo
        if (coreMesh) {
            const p = 15 + Math.sin(time * 3) * 2;
            coreMesh.scale.set(p, p, 1);
        }

        // Pulsación del Gran Corazón de Polvo Estelar
        if (heartPoints) {
            const heartPulse = 1 + Math.sin(time * 2.2) * 0.04;
            heartPoints.scale.set(heartPulse, heartPulse, heartPulse);
        }

        // Animación de ramos de flores (suave flotación vertical tipo gravedad cero)
        bouquetGroup.children.forEach((b) => {
            const d = b.userData;
            b.position.y = d.baseY + Math.sin(time * 1.8 + d.offset) * 0.8;
            b.position.x = d.baseX + Math.cos(time * 1.2 + d.offset) * 0.4;
        });

        // Animación de etiquetas de texto vinculadas a ramos
        textSpriteGroup.children.forEach((txt) => {
            if (txt.userData.parentSprite) {
                const parent = txt.userData.parentSprite;
                txt.position.x = parent.position.x;
                txt.position.y = parent.position.y + txt.userData.yOffset;
            } else if (txt.userData.baseY !== undefined) {
                txt.position.y = txt.userData.baseY + Math.sin(time * 1.6 + txt.userData.offset) * 0.5;
            }
        });

        // Flores individuales en órbita
        singleFlowersGroup.children.forEach((f) => {
            const d = f.userData;
            d.angle += d.orbitSpeed;
            f.position.x = Math.cos(d.angle) * d.r;
            f.position.z = Math.sin(d.angle) * d.r;
            f.position.y = d.baseY + Math.sin(time * 2.2 + d.offset) * 0.6;
        });

        // Partículas de explosión
        if (burstParticles && burstParticles.userData.active) {
            const pos = burstParticles.geometry.attributes.position.array;
            const vel = burstParticles.userData.vel;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i] += vel[i];
                pos[i + 1] += vel[i + 1];
                pos[i + 2] += vel[i + 2];
                vel[i] *= 0.985;
                vel[i + 1] *= 0.985;
                vel[i + 2] *= 0.985;
            }
            burstParticles.geometry.attributes.position.needsUpdate = true;
            burstParticles.userData.life -= 0.012;
            burstParticles.material.opacity = Math.max(0, burstParticles.userData.life);
            if (burstParticles.userData.life <= 0) burstParticles.userData.active = false;
        }

        // Cámara suave (Lerp)
        currentRotationX += (targetRotationX + mouseY - currentRotationX) * 0.05;
        currentRotationY += (targetRotationY + mouseX - currentRotationY) * 0.05;
        currentRotationX = Math.max(-0.9, Math.min(0.9, currentRotationX));

        camera.position.x = Math.sin(currentRotationY) * Math.cos(currentRotationX) * cameraDistance;
        camera.position.y = Math.sin(currentRotationX) * cameraDistance;
        camera.position.z = Math.cos(currentRotationY) * Math.cos(currentRotationX) * cameraDistance;
        camera.lookAt(0, 4, 0);

        renderer.render(scene, camera);
    }

    // --- CARGAR DATOS EN LA INTERFAZ ---
    function populateHTML() {
        const introRecipient = document.getElementById('intro-recipient-text');
        if (introRecipient) introRecipient.textContent = config.recipientName;

        const cardRecipient = document.getElementById('card-recipient-text');
        if (cardRecipient) cardRecipient.textContent = config.recipientName;

        const cardTitle = document.getElementById('card-title-text');
        if (cardTitle) cardTitle.textContent = config.title;

        const cardSubtitle = document.getElementById('card-subtitle-text');
        if (cardSubtitle) cardSubtitle.textContent = config.subtitle;

        const cardMessage = document.getElementById('card-message-text');
        if (cardMessage) cardMessage.textContent = config.message;

        const cardSignature = document.getElementById('card-signature-text');
        if (cardSignature) cardSignature.textContent = config.signature;

        const wishesGrid = document.getElementById('wishes-grid');
        if (wishesGrid && config.wishes) {
            wishesGrid.innerHTML = '';
            config.wishes.forEach(w => {
                const item = document.createElement('div');
                item.className = 'wish-item';
                item.innerHTML = `
                    <div class="wish-icon">${w.icon}</div>
                    <div class="wish-info">
                        <h4>${w.title}</h4>
                        <p>${w.text}</p>
                    </div>
                `;
                wishesGrid.appendChild(item);
            });
        }
    }

    window.addEventListener('DOMContentLoaded', init);
})();
