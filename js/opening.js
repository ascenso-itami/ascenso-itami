(() => {
    const screen = document.getElementById('openingScreen');
    const link = screen?.querySelector('.opening-link');
    if (!screen || !link || window.location.hash) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;
    screen.hidden = false;
    document.body.classList.add('opening-body');
    let leaving = false;
    const autoplay = window.setTimeout(() => revealHome(false), 3000);

    function revealHome(moveFocus) {
        if (leaving) return;
        leaving = true;
        window.clearTimeout(autoplay);
        screen.classList.add('slide-up');
        window.setTimeout(() => {
            const hadFocus = screen.contains(document.activeElement);
            screen.hidden = true;
            document.body.classList.remove('opening-body');
            if (moveFocus || hadFocus) document.getElementById('home')?.focus({ preventScroll: true });
        }, reducedMotion.matches ? 0 : 800);
    }

    link.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        revealHome(true);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') revealHome(true);
    });
})();
