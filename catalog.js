// Catalogue chooser modal + homepage volume toggle.
// Reads window.CATALOG (catalog-config.js must load first).
document.addEventListener('DOMContentLoaded', function () {
    var config = window.CATALOG;
    if (!config || !config.volumes) return;

    var availableVolumes = config.volumes.filter(function (v) { return v.available; });
    var lastTrigger = null;

    /* ---------- Chooser modal ---------- */

    function buildChooser() {
        if (document.getElementById('catalogChooser')) return document.getElementById('catalogChooser');

        var overlay = document.createElement('div');
        overlay.id = 'catalogChooser';
        overlay.className = 'modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'catalogChooserTitle');

        var rows = availableVolumes.map(function (v) {
            var sub = v.description ? '<span>' + v.description + '</span>' : '';
            var note = v.sizeNote ? '<small>' + v.sizeNote + '</small>' : '';
            var view = v.viewUrl
                ? '<a class="cta-button" href="' + v.viewUrl + '" target="_blank" rel="noopener">View</a>'
                : '';
            var download = v.downloadUrl
                ? '<a class="cta-button primary" href="' + v.downloadUrl + '" target="_blank" rel="noopener">Download</a>'
                : '';
            return '<div class="volume-row">' +
                '<div class="volume-info"><strong>' + v.title + '</strong>' + sub + note + '</div>' +
                '<div class="volume-actions">' + view + download + '</div>' +
                '</div>';
        }).join('');

        overlay.innerHTML =
            '<div class="glass-card modal-content catalog-chooser">' +
            '<button class="modal-close" aria-label="Close">&times;</button>' +
            '<div class="modal-body">' +
            '<h3 id="catalogChooserTitle">Our Catalogue</h3>' +
            '<p>Choose a volume to view online or download &amp; share.</p>' +
            '<div class="volume-list">' + rows + '</div>' +
            '</div></div>';

        document.body.appendChild(overlay);

        overlay.querySelector('.modal-close').addEventListener('click', closeChooser);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeChooser();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) closeChooser();
        });
        // Light focus containment: pull focus back if it tabs out of the modal.
        document.addEventListener('focusin', function (e) {
            if (overlay.classList.contains('active') && !overlay.contains(e.target)) {
                overlay.querySelector('.modal-close').focus();
            }
        });

        return overlay;
    }

    function openChooser(trigger) {
        var overlay = buildChooser();
        lastTrigger = trigger || null;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        overlay.querySelector('.modal-close').focus();
    }

    function closeChooser() {
        var overlay = document.getElementById('catalogChooser');
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
        lastTrigger = null;
    }

    var triggers = document.querySelectorAll('[data-catalog-open]');
    triggers.forEach(function (el) {
        el.setAttribute('aria-haspopup', 'dialog');
    });
    document.addEventListener('click', function (e) {
        var trigger = e.target.closest ? e.target.closest('[data-catalog-open]') : null;
        if (trigger) {
            e.preventDefault();
            openChooser(trigger);
        }
    });

    /* ---------- Homepage volume toggle ---------- */

    var grids = document.querySelectorAll('[data-volume-grid]');
    if (!grids.length) return;

    // Only volumes that are available AND have a grid on this page.
    var toggleVolumes = availableVolumes.filter(function (v) {
        return document.querySelector('[data-volume-grid="' + v.id + '"]');
    });
    if (toggleVolumes.length < 2) return;

    var STORAGE_KEY = 'glassmic.volume';

    function isValid(id) {
        return toggleVolumes.some(function (v) { return v.id === id; });
    }

    function storedVolume() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function resolveVolume() {
        var param = new URLSearchParams(window.location.search).get('vol');
        if (param && isValid(param)) return param;
        var stored = storedVolume();
        if (stored && isValid(stored)) return stored;
        if (isValid(config.defaultVolume)) return config.defaultVolume;
        return toggleVolumes[0].id;
    }

    var toggle = document.createElement('div');
    toggle.className = 'volume-toggle';
    toggle.setAttribute('role', 'tablist');
    toggle.setAttribute('aria-label', 'Catalogue volume');
    toggleVolumes.forEach(function (v) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('data-volume', v.id);
        btn.textContent = v.title;
        btn.addEventListener('click', function () { applyVolume(v.id, true); });
        toggle.appendChild(btn);
    });

    var header = document.querySelector('#collections .section-header');
    (header || grids[0].parentNode).appendChild(toggle);

    function applyVolume(id, persist) {
        grids.forEach(function (grid) {
            grid.hidden = grid.getAttribute('data-volume-grid') !== id;
        });
        toggle.querySelectorAll('[role="tab"]').forEach(function (btn) {
            btn.setAttribute('aria-selected', String(btn.getAttribute('data-volume') === id));
        });
        if (persist) {
            try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* private mode */ }
        }
        var url = new URL(window.location.href);
        url.searchParams.set('vol', id);
        history.replaceState(null, '', url);
    }

    applyVolume(resolveVolume(), false);
});
