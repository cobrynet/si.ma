// Fix Safari Desktop Responsive
(function() {
    // Rileva Safari con più euristiche (UA, vendor, WebKit), evitando Chrome/Edge/Opera
    const ua = navigator.userAgent || '';
    const vendor = navigator.vendor || '';
    const isAppleVendor = /Apple/i.test(vendor);
    const isWebKit = /AppleWebKit/i.test(ua) && !/(Edg|Edge|OPR|OPiOS|CriOS|Chrome)/i.test(ua);
    const isSafari = (isAppleVendor && isWebKit) || (typeof safari !== 'undefined');
    console.log('[SafariFix] UA=', ua);
    
    const params = new URLSearchParams(location.search);
    const forcedFlag = params.get('forceSafariFix') === '1' || localStorage.getItem('forceSafariFix') === '1' || (typeof window.__forceSafariFix !== 'undefined' && window.__forceSafariFix === true);
    const debugFlag = params.get('safariDebug') === '1' || forcedFlag;

    function applySafariFix() {
        const vpw = window.innerWidth;
        const vph = window.innerHeight;
        const msgPrefix = '[SafariFix]';
        console.log(`${msgPrefix} UA OK=${isSafari} forced=${forcedFlag} vp=${vpw}x${vph}`);

        // Badge visivo per confermare esecuzione (solo in debug o forced)
        if (debugFlag) {
            try {
                let badge = document.getElementById('safari-debug-badge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.id = 'safari-debug-badge';
                    badge.style.cssText = 'position:fixed;z-index:99999;top:6px;left:6px;background:#18202d;color:#E8F1F8;padding:4px 8px;border-radius:6px;font:12px/1.2 Outfit,system-ui,-apple-system,sans-serif;opacity:.85;pointer-events:none';
                    badge.textContent = 'Safari debug ON';
                    document.body.appendChild(badge);
                }
            } catch(e) {}
        }

        // Disattiva totalmente su mobile/tablet: non applicare scaling
        if (vpw <= 1024) {
            console.log(`${msgPrefix} skip on mobile/tablet viewport (<=1024px)`);
            return;
        }

        if (!((isSafari && vpw >= 1025) || forcedFlag)) {
            console.log(`${msgPrefix} skip (non-Safari o viewport < 1025). Usa ?forceSafariFix=1 o SafariFix.forceOn()`);
            return;
        }

    // Calcola fattore rispetto alla canvas di 1728 (con margine di sicurezza)
    let scaleFactor = Math.min(1, (vpw - 12) / 1728); // -12px margine per scrollbars/rounding

        // Applica zoom ai container principali
        const containers = [
            document.querySelector('.home'),
            document.querySelector('.main-container-contatti'),
            document.querySelector('.main-container-sezione2')
        ].filter(Boolean);

        containers.forEach(container => {
            // Imposta larghezza canvas e zoom
            container.style.width = '1728px';
            container.style.maxWidth = 'none';
            container.style.zoom = String(scaleFactor);

            // Compensa l'altezza (per evitare tagli in basso)
            const originalHeight = container.scrollHeight || container.offsetHeight;
            if (originalHeight) {
                container.style.minHeight = (originalHeight / scaleFactor) + 'px';
            }
        });

        // Auto-fit: se ancora sfora, riduci lo scale a piccoli passi
        try {
            let attempts = 0;
            const maxAttempts = 8;
            while (attempts < maxAttempts) {
                const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
                if (sw <= window.innerWidth + 1) break;
                scaleFactor = Math.max(0.7, scaleFactor - 0.02); // non scendere sotto 70%
                containers.forEach(container => {
                    container.style.zoom = String(scaleFactor);
                    const originalHeight = container.scrollHeight || container.offsetHeight;
                    if (originalHeight) {
                        container.style.minHeight = (originalHeight / scaleFactor) + 'px';
                    }
                });
                attempts++;
            }
            console.log(`${msgPrefix} auto-fit attempts=${attempts} final scale=${scaleFactor.toFixed(3)}`);
        } catch(e) {}

        // Contenimento overflow
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
        document.body.style.maxWidth = '100vw';

        // DIAGNOSTICA: individua elementi che sforano in orizzontale (solo in debug)
        if (debugFlag) {
            try {
                const offenders = [];
                const nodes = document.querySelectorAll('body *');
                nodes.forEach(el => {
                    // escludi badge e script
                    if (el.id === 'safari-debug-badge' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
                    const r = el.getBoundingClientRect();
                    const overflowRight = r.right - window.innerWidth;
                    if (overflowRight > 1) {
                        offenders.push({ el, overflow: Math.round(overflowRight), r });
                        el.style.outline = '2px dashed #ff3b30';
                    }
                });
                offenders.sort((a,b) => b.overflow - a.overflow);
                console.log(`${msgPrefix} overflow count=${offenders.length}`);
                console.table(offenders.slice(0, 15).map(o => ({
                    tag: o.el.tagName.toLowerCase(),
                    class: o.el.className,
                    id: o.el.id,
                    overflow: o.overflow,
                    left: Math.round(o.r.left),
                    right: Math.round(o.r.right),
                    width: Math.round(o.r.width)
                })));
            } catch(e) {
                console.warn('[SafariFix] diagnostic error', e);
            }
        }

        console.log(`${msgPrefix} applied scale=${scaleFactor.toFixed(3)}`);
    }

    // Espone API globali per forzare l'esecuzione da console
    window.SafariFix = {
        run: () => applySafariFix(),
        forceOn: () => { localStorage.setItem('forceSafariFix','1'); window.__forceSafariFix = true; console.log('[SafariFix] force ON; ricarica la pagina'); },
        forceOff: () => { localStorage.removeItem('forceSafariFix'); window.__forceSafariFix = false; console.log('[SafariFix] force OFF; ricarica la pagina'); }
    };

    // Esegui a DOM pronto e su resize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySafariFix);
    } else {
        applySafariFix();
    }
    window.addEventListener('resize', () => {
        // debounce semplice
        clearTimeout(window.__safariFixT);
        window.__safariFixT = setTimeout(applySafariFix, 150);
    });
})();
