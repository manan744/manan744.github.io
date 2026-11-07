// Site enhancements: lightbox, inquiry basket, code search, scroll reveal,
// WhatsApp button, hero slideshow. Feature-detects what each page needs.
// Must load BEFORE form-handler.js on pages without the inline lead modal.
(function () {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var WHATSAPP_BASE = 'https://wa.me/919837345999?text=';
    var BASKET_KEY = 'glassmic.inquiry';

    // WhatsApp opens with the visitor's selected products already in the message.
    function whatsappHref(codes) {
        var msg = codes.length
            ? "Hi The Glassmic, I'm interested in these products: " + codes.join(', ') + '. Please share a quotation.'
            : "Hi The Glassmic, I'm interested in your collections.";
        return WHATSAPP_BASE + encodeURIComponent(msg);
    }

    function readBasket() {
        try {
            var v = JSON.parse(localStorage.getItem(BASKET_KEY) || '[]');
            return Array.isArray(v) ? v : [];
        } catch (e) { return []; }
    }
    function writeBasket(codes) {
        try { localStorage.setItem(BASKET_KEY, JSON.stringify(codes)); } catch (e) { /* private mode */ }
    }

    document.addEventListener('DOMContentLoaded', function () {

        /* ---------- Lead modal injection (pages without the inline modal) ---------- */
        if (!document.getElementById('leadModal')) {
            var modalHtml =
                '<div id="leadModal" class="modal-overlay">' +
                '<div class="glass-card modal-content">' +
                '<button class="modal-close" id="closeModal">&times;</button>' +
                '<div class="modal-body">' +
                '<h3>Request a Quotation</h3>' +
                '<p>Fill in your details below and our team will get back to you shortly.</p>' +
                '<form id="leadForm" class="lead-form">' +
                '<div class="form-group"><label for="company">Company Name*</label>' +
                '<input type="text" id="company" name="company" placeholder="Your Company Ltd." required>' +
                '<span class="error-msg" id="companyError"></span></div>' +
                '<div class="form-group"><label for="name">Contact Person*</label>' +
                '<input type="text" id="name" name="name" placeholder="John Doe" required>' +
                '<span class="error-msg" id="nameError"></span></div>' +
                '<div class="form-group"><label for="phone">Phone Number</label>' +
                '<input type="tel" id="phone" name="phone" placeholder="+91 98765 43210">' +
                '<span class="error-msg" id="phoneError"></span></div>' +
                '<div class="form-group"><label for="email">Email ID</label>' +
                '<input type="email" id="email" name="email" placeholder="john@company.com">' +
                '<span class="error-msg" id="emailError"></span></div>' +
                '<div class="form-group"><label for="productCodes">Product Codes</label>' +
                '<textarea id="productCodes" name="productCodes" placeholder="Enter product codes or any specific selections"></textarea>' +
                '<span class="error-msg" id="productCodesError"></span></div>' +
                '<div class="form-actions"><button type="submit" class="cta-button primary full-width" id="submitBtn">Submit Inquiry</button></div>' +
                '</form>' +
                '<div id="successMessage" class="success-message hidden">' +
                '<div class="success-icon">✓</div><h4>Thank You!</h4>' +
                '<p>Your inquiry has been received. We\'ll be in touch soon.</p></div>' +
                '</div></div></div>';
            var wrap = document.createElement('div');
            wrap.innerHTML = modalHtml;
            document.body.appendChild(wrap.firstChild);
        }

        function openLeadModal() {
            var modal = document.getElementById('leadModal');
            if (!modal) return;
            var codes = readBasket();
            var textarea = document.getElementById('productCodes');
            if (textarea && codes.length) textarea.value = codes.join(', ');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Clear the basket once an inquiry is successfully submitted.
        var successMsg = document.getElementById('successMessage');
        if (successMsg && window.MutationObserver) {
            new MutationObserver(function () {
                if (!successMsg.classList.contains('hidden')) {
                    writeBasket([]);
                    updateFab();
                    document.querySelectorAll('.add-inquiry.added').forEach(function (b) {
                        b.classList.remove('added');
                        b.textContent = '+';
                    });
                }
            }).observe(successMsg, { attributes: true, attributeFilter: ['class'] });
        }

        /* ---------- Floating buttons: WhatsApp + Inquire ---------- */
        var fabWrap = document.createElement('div');
        fabWrap.className = 'fab-stack';
        fabWrap.innerHTML =
            '<button type="button" class="inquiry-fab" hidden>Inquire <span class="fab-count"></span></button>' +
            '<a class="whatsapp-fab" href="' + whatsappHref(readBasket()) + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
            '<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" fill="currentColor">' +
            '<path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.9 1 3.9 1.5 4.7 1.5 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.8c-1.6 0-3.2-.4-4.6-1.2l-.3-.2-4.3 1.4 1.4-4.2-.2-.3c-1.3-1.7-2-3.7-2-5.8C6 9.4 10.5 5 16 5s10 4.4 10 9.9-4.5 9.9-10 9.9zm5.5-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4z"/>' +
            '</svg></a>';
        document.body.appendChild(fabWrap);

        var fab = fabWrap.querySelector('.inquiry-fab');
        var whatsappFab = fabWrap.querySelector('.whatsapp-fab');
        function updateFab() {
            var codes = readBasket();
            fab.hidden = codes.length === 0;
            fab.querySelector('.fab-count').textContent = '(' + codes.length + ')';
            whatsappFab.href = whatsappHref(codes);
        }
        fab.addEventListener('click', openLeadModal);
        updateFab();

        /* ---------- Gallery features (lightbox, basket buttons, search) ---------- */
        var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
        if (items.length) {
            var entries = items.map(function (item) {
                var img = item.querySelector('img');
                var tag = item.querySelector('.image-tag');
                return { item: item, src: img ? img.src : '', alt: img ? img.alt : '', code: tag ? tag.textContent.trim() : '' };
            });

            // + buttons (only where a product code exists)
            entries.forEach(function (e) {
                if (!e.code) return;
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'add-inquiry';
                btn.setAttribute('aria-label', 'Add ' + e.code + ' to inquiry');
                var inBasket = readBasket().indexOf(e.code) !== -1;
                btn.textContent = inBasket ? '✓' : '+';
                if (inBasket) btn.classList.add('added');
                btn.addEventListener('click', function (ev) {
                    ev.stopPropagation();
                    toggleCode(e.code, btn);
                });
                e.item.appendChild(btn);
                e.btn = btn;
            });

            // Lightbox
            var lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-modal', 'true');
            lightbox.setAttribute('aria-label', 'Product viewer');
            lightbox.innerHTML =
                '<button class="lb-close" aria-label="Close">&times;</button>' +
                '<button class="lb-prev" aria-label="Previous">&#10094;</button>' +
                '<figure><img alt=""><figcaption>' +
                '<span class="lb-code"></span>' +
                '<button type="button" class="cta-button lb-add"></button>' +
                '</figcaption></figure>' +
                '<button class="lb-next" aria-label="Next">&#10095;</button>';
            document.body.appendChild(lightbox);

            var lbImg = lightbox.querySelector('img');
            var lbCode = lightbox.querySelector('.lb-code');
            var lbAdd = lightbox.querySelector('.lb-add');
            var current = -1;
            var lastFocus = null;

            function showIndex(i) {
                current = (i + entries.length) % entries.length;
                var e = entries[current];
                lbImg.src = e.src;
                lbImg.alt = e.alt || e.code;
                lbCode.textContent = e.code;
                lbCode.style.display = e.code ? '' : 'none';
                lbAdd.style.display = e.code ? '' : 'none';
                refreshLbAdd();
                // preload neighbours
                [current + 1, current - 1].forEach(function (j) {
                    var n = entries[(j + entries.length) % entries.length];
                    if (n) { var im = new Image(); im.src = n.src; }
                });
            }
            function refreshLbAdd() {
                var e = entries[current];
                if (!e || !e.code) return;
                var added = readBasket().indexOf(e.code) !== -1;
                lbAdd.textContent = added ? '✓ Added to inquiry' : '+ Add to inquiry';
                lbAdd.classList.toggle('added', added);
            }
            function openLightbox(i, origin) {
                lastFocus = origin || null;
                showIndex(i);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                lightbox.querySelector('.lb-close').focus();
            }
            function closeLightbox() {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
                if (lastFocus && lastFocus.focus) lastFocus.focus();
            }

            entries.forEach(function (e, i) {
                e.item.addEventListener('click', function () { openLightbox(i, e.item); });
                e.item.setAttribute('tabindex', '0');
                e.item.setAttribute('role', 'button');
                e.item.addEventListener('keydown', function (ev) {
                    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openLightbox(i, e.item); }
                });
            });
            lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
            lightbox.querySelector('.lb-prev').addEventListener('click', function () { showIndex(current - 1); });
            lightbox.querySelector('.lb-next').addEventListener('click', function () { showIndex(current + 1); });
            lbAdd.addEventListener('click', function () {
                var e = entries[current];
                if (e && e.code) toggleCode(e.code, e.btn);
                refreshLbAdd();
            });
            lightbox.addEventListener('click', function (ev) {
                if (ev.target === lightbox) closeLightbox();
            });
            document.addEventListener('keydown', function (ev) {
                if (!lightbox.classList.contains('active')) return;
                if (ev.key === 'Escape') closeLightbox();
                if (ev.key === 'ArrowLeft') showIndex(current - 1);
                if (ev.key === 'ArrowRight') showIndex(current + 1);
            });
            // touch swipe
            var touchX = null;
            lightbox.addEventListener('touchstart', function (ev) {
                touchX = ev.changedTouches[0].clientX;
            }, { passive: true });
            lightbox.addEventListener('touchend', function (ev) {
                if (touchX === null) return;
                var dx = ev.changedTouches[0].clientX - touchX;
                touchX = null;
                if (Math.abs(dx) > 45) showIndex(dx < 0 ? current + 1 : current - 1);
            }, { passive: true });

            function toggleCode(code, btn) {
                var codes = readBasket();
                var at = codes.indexOf(code);
                if (at === -1) codes.push(code); else codes.splice(at, 1);
                writeBasket(codes);
                if (btn) {
                    var added = at === -1;
                    btn.classList.toggle('added', added);
                    btn.textContent = added ? '✓' : '+';
                }
                updateFab();
                refreshLbAdd();
            }

            // Search by product code (only when codes exist on the page)
            if (entries.some(function (e) { return e.code; })) {
                var header = document.querySelector('.section-header');
                var grid = document.querySelector('.gallery-grid');
                if (header && grid) {
                    var norm = function (s) { return s.toLowerCase().replace(/[^a-z0-9]/g, ''); };
                    var box = document.createElement('div');
                    box.className = 'code-search';
                    box.innerHTML =
                        '<input type="search" placeholder="Search product code — e.g. TGI/462" aria-label="Search product code">' +
                        '<span class="search-count"></span>';
                    header.appendChild(box);
                    var input = box.querySelector('input');
                    var count = box.querySelector('.search-count');
                    var timer = null;
                    input.addEventListener('input', function () {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            var q = norm(input.value);
                            var shown = 0;
                            entries.forEach(function (e) {
                                var hit = !q || norm(e.code).indexOf(q) !== -1;
                                e.item.style.display = hit ? '' : 'none';
                                if (hit) shown++;
                            });
                            count.textContent = q ? shown + ' of ' + entries.length + ' products' : '';
                        }, 120);
                    });
                }
            }
        }

        /* ---------- Image download deterrence ----------
           Product photos can't be right-clicked, long-pressed or dragged out;
           the catalogue PDF is the sanctioned download. (Screenshots are an
           OS feature and cannot be blocked by any website.) */
        document.addEventListener('contextmenu', function (e) {
            if (e.target.closest && e.target.closest(
                '.gallery-item, #lightbox, .card-image, .collection-banner, .hero-slides, .story-card')) {
                e.preventDefault();
            }
        });
        document.addEventListener('dragstart', function (e) {
            if (e.target.tagName === 'IMG') e.preventDefault();
        });

        /* ---------- Scroll reveal ---------- */
        if (!reduceMotion && 'IntersectionObserver' in window) {
            var targets = Array.prototype.slice.call(document.querySelectorAll(
                '.gallery-item, .collection-card, .section-header, .catalog-viewer-box, .story-card, .detail-item'));
            var pending = targets.length;
            function revealTarget(t) {
                if (!t.classList.contains('in-view')) {
                    t.classList.add('in-view');
                    io.unobserve(t);
                    pending--;
                }
            }
            var io = new IntersectionObserver(function (obs) {
                obs.forEach(function (entry) {
                    if (entry.isIntersecting || entry.boundingClientRect.top < 0) revealTarget(entry.target);
                });
            }, { threshold: 0.06 });
            targets.forEach(function (t) {
                t.classList.add('reveal');
                io.observe(t);
            });
            // Safety sweep: observers can coalesce a fast enter+leave into no
            // record at all, leaving scrolled-past items invisible. Periodically
            // reveal anything at, above, or near the current fold.
            var sweepTimer = null;
            function sweep() {
                sweepTimer = null;
                if (pending <= 0) {
                    window.removeEventListener('scroll', onScroll);
                    return;
                }
                var fold = window.innerHeight * 0.96;
                targets.forEach(function (t) {
                    if (t.classList.contains('in-view')) return;
                    var r = t.getBoundingClientRect();
                    if (r.height > 0 && r.top < fold) revealTarget(t);
                });
            }
            function onScroll() {
                if (!sweepTimer) sweepTimer = setTimeout(sweep, 180);
            }
            window.addEventListener('scroll', onScroll, { passive: true });
        }

        /* ---------- Hero slideshow (homepage) ---------- */
        var hero = document.querySelector('.hero-card');
        if (hero && !reduceMotion) {
            var slides = [
                'assets/og-cover.jpg',
                'assets/collections/vol3/neer/neer_p13_0.jpeg',
                'assets/collections/vol3/navrang/navrang_p37_3.jpeg',
                'assets/collections/vol3/divine-diwali/divine-diwali_p16_1.jpeg'
            ];
            var deck = document.createElement('div');
            deck.className = 'hero-slides';
            deck.setAttribute('aria-hidden', 'true');
            slides.forEach(function (src, i) {
                var im = document.createElement('img');
                im.src = src;
                im.alt = '';
                if (i === 0) im.className = 'active';
                deck.appendChild(im);
            });
            var veil = document.createElement('div');
            veil.className = 'hero-veil';
            hero.insertBefore(veil, hero.firstChild);
            hero.insertBefore(deck, hero.firstChild);
            hero.classList.add('has-slides');
            var idx = 0;
            setInterval(function () {
                var imgs = deck.querySelectorAll('img');
                imgs[idx].classList.remove('active');
                idx = (idx + 1) % imgs.length;
                imgs[idx].classList.add('active');
            }, 5000);
        }
    });
})();
