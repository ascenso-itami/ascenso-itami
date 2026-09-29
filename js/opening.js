(() => {
    const screen = document.getElementById('openingScreen');
    const link = screen?.querySelector('.opening-link');
    if (!screen || !link) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let leaving = false;
    const autoplay = window.setTimeout(goMain, 3000);

    function goMain() {
        if (leaving) return;
        leaving = true;
        window.clearTimeout(autoplay);
        screen.classList.add('slide-up');
        window.setTimeout(() => {
            window.location.replace(link.href);
        }, reducedMotion.matches ? 0 : 600);
    }

    link.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        goMain();
    });
})();
