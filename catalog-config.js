// Single source of truth for catalogue volumes.
// To launch a new volume: fill in its URLs, set available: true,
// and update defaultVolume. Array order = display order (newest first).
window.CATALOG = {
    // Volume shown by default on the homepage and used for no-JS fallback links.
    defaultVolume: 'vol1',

    volumes: [
        {
            id: 'vol2',
            label: 'Vol-2',
            year: '2026',
            title: 'Vol-2 · 2026',
            available: false,
            viewUrl: '',
            downloadUrl: '',
            sizeNote: '',
            description: '',
            collectionNames: []
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
