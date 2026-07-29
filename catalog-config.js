// Single source of truth for catalogue volumes.
// To launch a new volume: fill in its URLs, set available: true,
// and update defaultVolume. Array order = display order (newest first).
window.CATALOG = {
    // Volume shown by default on the homepage and used for no-JS fallback links.
    defaultVolume: 'vol3',

    volumes: [
        {
            id: 'vol3',
            label: 'Vol-3',
            year: '2026',
            title: 'Vol-3 · 2026',
            available: true,
            viewUrl: 'https://github.com/manan744/manan744.github.io/releases/download/v2.0.0/the.glassmic.VOLUME.3.pdf',
            downloadUrl: 'https://github.com/manan744/manan744.github.io/releases/download/v2.0.0/the.glassmic.VOLUME.3.pdf',
            sizeNote: '~190 MB high-resolution PDF — Wi-Fi recommended',
            description: 'Neer, Divine Diwali and Navrang collections',
            collectionNames: ['Neer', 'Divine Diwali', 'Navrang']
        },
        {
            id: 'vol1',
            label: 'Vol-1',
            year: '2025',
            title: 'Vol-1 · 2025',
            available: true,
            viewUrl: 'https://qr.scan.page/uploads/pdf/hQX6Xe_c21cbf9c921fbb4c.pdf',
            downloadUrl: 'https://github.com/manan744/manan744.github.io/releases/download/v1.0.0/the.glassmic.pdf.5.pdf',
            sizeNote: '160 MB+ high-resolution PDF — Wi-Fi recommended',
            description: 'Neer, Akaar, Navrang and Bandhan collections',
            collectionNames: ['Neer', 'Akaar', 'Navrang', 'Bandhan']
        }
    ]
};
