document.addEventListener('mousemove', (e) => {
    const bg = document.querySelector('.interactive-bg');
    if (bg) {
        /* Parallax sensitive movement - inverted for depth feel */
        const x = (window.innerWidth - e.pageX * 5) / 100;
        const y = (window.innerHeight - e.pageY * 5) / 100;

        bg.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }
});
