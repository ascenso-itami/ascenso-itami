document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("openingScreen");
  if (opening) {
    let closing = false;
    const dismissOpening = () => {
      if (closing) return;
      closing = true;
      clearTimeout(openingTimer);
      opening.classList.add("is-leaving");
      window.setTimeout(() => opening.remove(), 700);
    };
    const openingTimer = window.setTimeout(dismissOpening, 3000);
    opening.addEventListener("click", dismissOpening);
    opening.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dismissOpening();
      }
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clearTimeout(openingTimer);
      opening.remove();
    }
  }

  const menuButton = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("navMenu");
  if (menuButton && menu) {
    const setMenu = (open) => {
      menu.classList.toggle("active", open);
      menuButton.classList.toggle("active", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute(
        "aria-label",
        open ? "メニューを閉じる" : "メニューを開く",
      );
    };
    menuButton.addEventListener("click", () =>
      setMenu(!menu.classList.contains("active")),
    );
    menu
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target))
        setMenu(false);
    });
  }

  const modal = document.getElementById("profileModal");
  const closeButton = document.getElementById("modalClose");
  const cards = document.querySelectorAll(".staff-card");
  if (modal && closeButton && cards.length) {
    const modalImg = document.getElementById("modalImg");
    const modalRole = document.getElementById("modalRole");
    const modalName = document.getElementById("modalName");
    const modalCareer = document.getElementById("modalCareer");
    const modalVision = document.getElementById("modalVision");
    let previousFocus = null;
    const setLineBreakText = (element, value) => {
      element.replaceChildren();
      String(value || "")
        .split(/<br\s*\/?>/i)
        .forEach((line, index) => {
          if (index) element.append(document.createElement("br"));
          element.append(document.createTextNode(line));
        });
    };
    const closeModal = () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
    const openModal = (card) => {
      previousFocus = document.activeElement;
      modalImg.src =
        card.querySelector(".player-img-box img")?.getAttribute("src") ||
        card.dataset.img ||
        "";
      modalImg.alt = card.dataset.name || "";
      modalRole.textContent = card.dataset.role || "";
      modalName.textContent = card.dataset.name || "";
      setLineBreakText(modalCareer, card.dataset.career);
      setLineBreakText(modalVision, card.dataset.vision);
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeButton.focus();
    };
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "modalName");
    modal.setAttribute("aria-hidden", "true");
    closeButton.setAttribute("aria-label", "詳細を閉じる");
    cards.forEach((card) => {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", card.dataset.name + "の詳細を見る");
      card.addEventListener("click", () => openModal(card));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(card);
        }
      });
    });
    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = [
        ...modal.querySelectorAll(
          'button, a[href], input, [tabindex]:not([tabindex="-1"])',
        ),
      ];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("active"))
        closeModal();
    });
  }

  const filterBar = document.querySelector(".player-filters");
  const playerGrid = document.querySelector(".player-grid");
  if (filterBar && playerGrid) {
    const playerCards = [...playerGrid.querySelectorAll(".player-card")];
    const count = document.getElementById("playerCount");
    const updateFilter = (position) => {
      let visible = 0;
      playerCards.forEach((card) => {
        const matches =
          position === "ALL" ||
          card.querySelector(".player-position")?.textContent.trim() ===
            position;
        card.hidden = !matches;
        if (matches) visible++;
      });
      filterBar
        .querySelectorAll("button")
        .forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.position === position),
          ),
        );
      if (count) count.textContent = `${visible} PLAYERS`;
    };
    filterBar.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-position]");
      if (button) updateFilter(button.dataset.position);
    });
    updateFilter("ALL");
  }

  const roadSteps = document.querySelector(".road-steps");
  if (
    roadSteps &&
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    roadSteps.classList.add("animate-road");
    const observer = new IntersectionObserver(
      (entries, current) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-show");
            current.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -35px 0px", threshold: 0.08 },
    );
    roadSteps
      .querySelectorAll(".road-step-item")
      .forEach((item) => observer.observe(item));
  }

  const form = document.querySelector(".contact-form");
  if (form) {
    const positionInputs = form.querySelectorAll('input[name="position"]');
    positionInputs.forEach((input) =>
      input.addEventListener("change", () =>
        positionInputs[0].setCustomValidity(""),
      ),
    );
    form.addEventListener("submit", (event) => {
      if (![...positionInputs].some((input) => input.checked)) {
        event.preventDefault();
        positionInputs[0].setCustomValidity(
          "希望ポジションを一つ以上選択してください。",
        );
        positionInputs[0].reportValidity();
      } else {
        positionInputs[0].setCustomValidity("");
      }
    });
  }
});
