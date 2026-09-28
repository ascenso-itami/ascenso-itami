// ページが完全に読み込まれてからプログラムを実行する
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });

        // メニュー内のリンクをクリックしたら自動で閉じる
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            });
        });
    }
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

    if (!modal || !modalClose || !modalImg || !modalRole || !modalName || !modalCareer || !modalVision) return;

    // カードをクリックしたとき
    staffCards.forEach(card => {
        card.addEventListener('click', () => {
            modalImg.src = card.getAttribute('data-img');
            modalRole.textContent = card.getAttribute('data-role');
            modalName.textContent = card.getAttribute('data-name');
            
            // ▼ ここを textContent から innerHTML に変更します
            modalCareer.innerHTML = card.getAttribute('data-career');
            modalVision.innerHTML = card.getAttribute('data-vision');
            
            modal.classList.add('active');
        });
    });

    // 閉じるボタンを押したとき
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // モーダルの外側（背景）をクリックしたとき
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// --- スクロールに合わせてロードマップをふわっと表示する処理 ---
document.addEventListener("DOMContentLoaded", function () {
    const roadItems = document.querySelectorAll(".road-step-item");
    const roadSteps = document.querySelector(".road-steps");

    if (roadSteps && roadItems.length > 0 && "IntersectionObserver" in window &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        roadSteps.classList.add("animate-road");
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 画面内に入ったら
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-show");
                    observer.unobserve(entry.target);
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

// --- ページ内リンクのスムーズスクロール（高さのズレ防止付き） ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // 「#」だけのときは除外
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            // 固定ヘッダーの高さを考慮して少し手前で止める場合（例: 80px）
            const headerHeight = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
