// ページが完全に読み込まれてからプログラムを実行する
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    const backdrop = document.getElementById('menuBackdrop');
    const header = document.querySelector('.global-header');
    if (!hamburgerBtn || !navMenu || !backdrop || !header) return;

    const mobileViewport = window.matchMedia('(max-width: 900px)');
    let isOpen = false;

    function setMenu(open, restoreFocus = false) {
        isOpen = open && mobileViewport.matches;
        navMenu.classList.toggle('is-open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        hamburgerBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
        navMenu.inert = mobileViewport.matches && !isOpen;
        backdrop.hidden = !isOpen;
        if (restoreFocus && mobileViewport.matches) hamburgerBtn.focus();
    }

    hamburgerBtn.addEventListener('click', () => setMenu(!isOpen));
    backdrop.addEventListener('click', () => setMenu(false, true));
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false, true));
    });
    mobileViewport.addEventListener('change', () => {
        setMenu(false, navMenu.contains(document.activeElement));
    });

    document.addEventListener('keydown', event => {
        if (!isOpen) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            setMenu(false, true);
        } else if (event.key === 'Tab') {
            const controls = header.querySelectorAll('.global-brand, .global-menu-toggle, .global-nav a');
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
    setMenu(false);
});

document.addEventListener('DOMContentLoaded', () => {
    const staffCards = document.querySelectorAll('.staff-card');
    const modal = document.getElementById('profileModal');
    const modalClose = document.getElementById('modalClose');
    
    const modalImg = document.getElementById('modalImg');
    const modalRole = document.getElementById('modalRole');
    const modalName = document.getElementById('modalName');
    const modalCareer = document.getElementById('modalCareer');
    const modalVision = document.getElementById('modalVision');

    if (modal && modalClose && modalImg && modalRole && modalName && modalCareer && modalVision) {
        staffCards.forEach(card => {
            card.addEventListener('click', () => {
                modalImg.src = card.getAttribute('data-img');
                modalRole.textContent = card.getAttribute('data-role');
                modalName.textContent = card.getAttribute('data-name');
                modalCareer.innerHTML = card.getAttribute('data-career');
                modalVision.innerHTML = card.getAttribute('data-vision');
                modal.classList.add('active');
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', event => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') modal.classList.remove('active');
        });
    }
});

// --- スクロールに合わせてロードマップをふわっと表示する処理 ---
document.addEventListener("DOMContentLoaded", function () {
    const roadItems = document.querySelectorAll(".road-step-item");

    if (roadItems.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 画面内に入ったら
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-show");
                    // 一度表示されたら監視を終了する場合
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: "0px 0px -50px 0px", // 画面下部から少し手前で発火
            threshold: 0.1 // 要素が10%見えたら実行
        });

        roadItems.forEach(item => {
            observer.observe(item);
        });
    }
});

// トップの試合結果リンクから、該当する活動報告を開く。
function openLinkedMatch() {
    let targetId;
    try {
        targetId = decodeURIComponent(window.location.hash.slice(1));
    } catch {
        return;
    }
    if (!targetId) return;
    const match = document.getElementById(targetId);
    if (!match?.matches('details.match-card')) return;
    match.open = true;
    match.scrollIntoView({ block: 'start', behavior: 'auto' });
}

document.addEventListener('DOMContentLoaded', openLinkedMatch);
window.addEventListener('hashchange', openLinkedMatch);

// --- ページ内リンクのスムーズスクロール（高さのズレ防止付き） ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // 「#」だけのときは除外
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            const headerHeight = (document.querySelector('.global-header')?.offsetHeight ?? 80) + 16;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
        }
    });
});
