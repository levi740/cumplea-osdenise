// =========================================================
// ARCHIVO DE CONFIGURACIÓN - FELICITACIÓN DE CUMPLEAÑOS
// Modifica los valores entre comillas según tus preferencias
// =========================================================

const BIRTHDAY_CONFIG = {
    // Nombre de la persona festejada
    recipientName: "Denise Adileni Martínez Flores",

    // Título principal en la dedicatoria
    title: "¡Feliz Cumpleaños, Denise!",

    // Subtítulo o apodo cariñoso
    subtitle: "Para la flor más hermosa",

    // Mensaje o carta principal de felicitación
    message: `Hoy el universo entero se viste de fiesta para celebrar el día en que llegaste al mundo a iluminar con tu sonrisa, tu ternura y esa magia tan única que te caracteriza.\n\nEn este día tan especial quise regalarte algo eterno: no solo un ramo, sino una galaxia entera de rosas amarillas que nunca se marchitarán, cada una brillando en el espacio para recordarte lo valiosa, maravillosa e importante que eres.\n\nQue este nuevo año de vida te llene de salud, infinitas bendiciones, paz en el alma y motivos constantes para sonreír. Que cada sueño que guardas en tu corazón encuentre las alas para hacerse realidad.\n\n¡Feliz Cumpleaños, Denise! Que la felicidad te acompañe en cada paso hoy y siempre.`,

    // Mensaje de pie de carta / Despedida
    signature: "Con todo mi cariño, admiración y los mejores deseos ✨",

    // Fecha o detalle de cumpleaños (opcional)
    birthdayDate: "¡Un día mágico celebrado entre estrellas!",

    // Lista de 4 deseos cósmicos que aparecen en la tarjeta
    wishes: [
        { icon: "🌟", title: "Luz Infinita", text: "Que tu brillo natural jamás se apague y continúe iluminando la vida de quienes te rodean." },
        { icon: "💛", title: "Felicidad Pura", text: "Rosas amarillas que simbolicen alegría perpetua, calidez y momentos inolvidables." },
        { icon: "🚀", title: "Metas y Sueños", text: "Que la vida te abra todas las puertas para conquistar todo aquello que te propongas." },
        { icon: "✨", title: "Paz y Amor", text: "Que en tu corazón siempre reinen la plenitud, la salud y la serenidad más profunda." }
    ],

    // Foto opcional (si tienes una foto, colócala en esta carpeta y pon aquí su nombre, ej: "foto.jpg", o déjalo vacío "")
    photoUrl: "", 

    // Opciones de audio:
    // "musica.mp3" es el audio original extraído directamente del video de TikTok (dj.lbeats)
    audioSrc: "musica.mp3", 

    // Frases flotantes que orbitan en la galaxia junto a los ramos (personalizadas por el usuario)
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
    ],

    // Colores temáticos de la galaxia
    colors: {
        flowerYellow: 0xffd700,      // Amarillo dorado de las flores
        flowerCenter: 0xffaa00,      // Centro cálido de las flores
        galaxyCore: 0xfff5a6,        // Núcleo brillante
        galaxyArms: 0xffcc00,        // Brazos de estrellas doradas
        ambientStars: 0xffea88       // Polvo estelar ambiental
    }
};

window.BIRTHDAY_CONFIG = BIRTHDAY_CONFIG;
