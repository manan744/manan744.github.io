// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('nav-open');
        });

        // Close menu when a nav link is clicked (except dropdown toggles)
        document.querySelectorAll('.nav-links a').forEach(function (link) {
            if (!link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', function () {
                    nav.classList.remove('nav-open');
                });
            }
        });
    }

    // Dropdown toggle for mobile (tap to open/close)
    document.querySelectorAll('.dropdown-toggle').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var parent = btn.closest('.nav-dropdown');
            if (parent) {
                parent.classList.toggle('open');
            }
        });
    });
});
