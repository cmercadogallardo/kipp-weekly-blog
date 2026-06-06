/**
 * KIPP Weekly Blog - main interactions in vanilla JS.
 */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "kipp-theme";
  const MOBILE_QUERY = "(max-width: 768px)";
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const mainNav = document.querySelector(".main-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const themeToggles = Array.from(document.querySelectorAll(".theme-toggle"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)");
  const mobileViewport = window.matchMedia(MOBILE_QUERY);

  const safeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (_error) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (_error) {}
    },
  };

  const yearNode = document.getElementById("current-year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  const normalizePath = (value) => {
    const decoded = decodeURIComponent(value || "/");
    const trimmedIndex = decoded.replace(/index\.html$/i, "");
    const trimmedSlash = trimmedIndex.replace(/\/+$/, "");
    return trimmedSlash || "/";
  };

  const slugify = (value) =>
    (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section";

  const getThemeMeta = () => document.querySelector('meta[name="theme-color"]');

  const updateThemeColor = (theme) => {
    const meta = getThemeMeta();
    if (!meta) return;

    const styles = getComputedStyle(root);
    const lightColor = styles.getPropertyValue("--primary-600").trim() || "#2563eb";
    const darkColor = styles.getPropertyValue("--bg-body").trim() || "#0b1020";
    meta.setAttribute("content", theme === "dark" ? darkColor : lightColor);
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    updateThemeColor(theme);

    themeToggles.forEach((button) => {
      const nextLabel = theme === "dark" ? "Modo claro" : "Modo oscuro";
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.setAttribute("aria-label", `Activar ${nextLabel.toLowerCase()}`);

      const labelNode = button.querySelector(".theme-toggle-label");
      if (labelNode) labelNode.textContent = nextLabel;
    });
  };

  const storedTheme = safeStorage.get(STORAGE_KEY);
  applyTheme(storedTheme || (preferredDark.matches ? "dark" : "light"));

  preferredDark.addEventListener("change", (event) => {
    if (safeStorage.get(STORAGE_KEY)) return;
    applyTheme(event.matches ? "dark" : "light");
  });

  themeToggles.forEach((button) => {
    button.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      safeStorage.set(STORAGE_KEY, next);
      applyTheme(next);
    });
  });

  if (header) {
    const syncHeader = () => header.classList.toggle("scrolled", window.scrollY > 10);
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  const isFocusable = (element) =>
    Boolean(
      element &&
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-hidden") !== "true" &&
        element.tabIndex !== -1
    );

  const getFocusableElements = (container) =>
    Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => isFocusable(element) && element.offsetParent !== null);

  let lockedScrollY = 0;
  let restoreFocusTo = null;

  const lockScroll = () => {
    lockedScrollY = window.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.dataset.scrollLocked = "true";
  };

  const unlockScroll = () => {
    if (body.dataset.scrollLocked !== "true") return;
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    delete body.dataset.scrollLocked;
    window.scrollTo(0, lockedScrollY);
  };

  const setNavInteractiveState = (enabled) => {
    if (!mainNav) return;
    mainNav.setAttribute("aria-hidden", String(!enabled));
    if ("inert" in mainNav) mainNav.inert = !enabled;
  };

  const setMenuOpen = (open, options = {}) => {
    if (!mainNav || !menuToggle) return;

    const returnFocus = options.returnFocus !== false;
    const shouldOpen = Boolean(open && mobileViewport.matches);

    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.setAttribute("aria-label", shouldOpen ? "Cerrar menú" : "Abrir menú");
    mainNav.classList.toggle("mobile-open", shouldOpen);
    setNavInteractiveState(!mobileViewport.matches || shouldOpen);

    if (shouldOpen) {
      restoreFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : menuToggle;
      lockScroll();

      const [firstFocusable] = getFocusableElements(mainNav);
      (firstFocusable || mainNav).focus();
      return;
    }

    unlockScroll();

    if (returnFocus && restoreFocusTo instanceof HTMLElement) {
      restoreFocusTo.focus();
    }
  };

  if (mainNav && menuToggle) {
    if (!mainNav.id) mainNav.id = "primary-navigation";
    if (!mainNav.hasAttribute("tabindex")) mainNav.setAttribute("tabindex", "-1");

    menuToggle.setAttribute("aria-controls", mainNav.id);
    setNavInteractiveState(!mobileViewport.matches);

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileViewport.matches) setMenuOpen(false, { returnFocus: false });
      });
    });

    document.addEventListener("keydown", (event) => {
      if (menuToggle.getAttribute("aria-expanded") !== "true") return;

      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(mainNav);
      if (focusable.length === 0) {
        event.preventDefault();
        mainNav.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (menuToggle.getAttribute("aria-expanded") !== "true") return;
      if (mainNav.contains(event.target) || menuToggle.contains(event.target)) return;
      setMenuOpen(false, { returnFocus: false });
    });

    mobileViewport.addEventListener("change", (event) => {
      if (event.matches) {
        setMenuOpen(false, { returnFocus: false });
        return;
      }

      unlockScroll();
      mainNav.classList.remove("mobile-open");
      mainNav.removeAttribute("aria-hidden");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      if ("inert" in mainNav) mainNav.inert = false;
    });
  }

  const setActiveState = (link, active, current = "page") => {
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", current);
    } else {
      link.removeAttribute("aria-current");
    }
  };

  const currentUrl = new URL(window.location.href);
  const currentPath = normalizePath(currentUrl.pathname);
  const mainNavLinks = Array.from(document.querySelectorAll(".main-nav a"));

  const routeMatches = mainNavLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return null;

      try {
        const linkUrl = new URL(href, window.location.href);
        if (linkUrl.origin !== currentUrl.origin) return null;

        const candidatePath = normalizePath(linkUrl.pathname);
        if (candidatePath === currentPath) return { link, score: 200 + candidatePath.length };
        if (candidatePath !== "/" && currentPath.startsWith(`${candidatePath}/`)) {
          return { link, score: 100 + candidatePath.length };
        }

        return null;
      } catch (_error) {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  const activePageLink = routeMatches[0] ? routeMatches[0].link : null;
  mainNavLinks.forEach((link) => setActiveState(link, link === activePageLink));

  const focusTarget = (target) => {
    if (!(target instanceof HTMLElement)) return;
    const hadTabIndex = target.hasAttribute("tabindex");

    if (!hadTabIndex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });

    if (!hadTabIndex) {
      target.addEventListener(
        "blur",
        () => {
          target.removeAttribute("tabindex");
        },
        { once: true }
      );
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#" || href === "#!") return;

      const url = new URL(href, window.location.href);
      if (!url.hash || normalizePath(url.pathname) !== currentPath) return;

      const target = document.getElementById(url.hash.slice(1));
      if (!target) return;

      event.preventDefault();

      if (menuToggle?.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false, { returnFocus: false });
      }

      target.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start",
      });
      focusTarget(target);

      if (url.hash !== window.location.hash) {
        window.history.pushState({}, "", url.hash);
      }
    });
  });

  const sectionNavLinks = mainNavLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href) return null;

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== currentUrl.origin) return null;
        if (!url.hash || normalizePath(url.pathname) !== currentPath) return null;

        const target = document.getElementById(url.hash.slice(1));
        if (!target) return null;

        return { link, target };
      } catch (_error) {
        return null;
      }
    })
    .filter(Boolean);

  const setActiveSectionLink = (activeLink) => {
    mainNavLinks.forEach((link) => {
      if (link === activeLink) {
        setActiveState(link, true, "location");
        return;
      }

      if (link === activePageLink) {
        setActiveState(link, !activeLink, "page");
        return;
      }

      setActiveState(link, false);
    });
  };

  if (sectionNavLinks.length > 0 && "IntersectionObserver" in window) {
    const visibleSections = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target, Math.abs(entry.boundingClientRect.top));
          } else {
            visibleSections.delete(entry.target);
          }
        });

        let activeLink = null;
        let bestDistance = Number.POSITIVE_INFINITY;

        sectionNavLinks.forEach(({ link, target }) => {
          const distance = visibleSections.get(target);
          if (typeof distance !== "number") return;
          if (distance < bestDistance) {
            bestDistance = distance;
            activeLink = link;
          }
        });

        setActiveSectionLink(activeLink);
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0.15, 0.4, 0.7],
      }
    );

    sectionNavLinks.forEach(({ target }) => observer.observe(target));

    if (window.location.hash) {
      const currentHashLink = sectionNavLinks.find(
        ({ target }) => `#${target.id}` === window.location.hash
      );
      if (currentHashLink) setActiveSectionLink(currentHashLink.link);
    }
  }

  document.querySelectorAll(".js-print-page").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  const linkifyEntryUrls = () => {
    document.querySelectorAll(".entry-content p, .entry-content li").forEach((container) => {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.textContent || !/https?:\/\//.test(node.textContent)) {
            return NodeFilter.FILTER_REJECT;
          }

          const parent = node.parentElement;
          if (parent?.closest("a, code, pre, script, style")) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const replacements = [];
      let currentNode = walker.nextNode();
      while (currentNode) {
        replacements.push(currentNode);
        currentNode = walker.nextNode();
      }

      replacements.forEach((textNode) => {
        const text = textNode.textContent || "";
        const matches = Array.from(text.matchAll(/https?:\/\/[^\s<]+/g));
        if (matches.length === 0) return;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        matches.forEach((match) => {
          const url = match[0];
          const index = match.index ?? 0;

          if (index > lastIndex) {
            fragment.append(document.createTextNode(text.slice(lastIndex, index)));
          }

          const link = document.createElement("a");
          link.href = url;
          link.textContent = url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.setAttribute("aria-label", `Abrir fuente externa: ${url}`);
          fragment.append(link);
          lastIndex = index + url.length;
        });

        if (lastIndex < text.length) {
          fragment.append(document.createTextNode(text.slice(lastIndex)));
        }

        textNode.parentNode?.replaceChild(fragment, textNode);
      });
    });
  };

  linkifyEntryUrls();

  const entryContent = document.querySelector(".entry-content");
  const entryArticle = document.querySelector(".entry-article") || entryContent?.closest("article") || null;
  const entryMetaBar = document.querySelector(".entry-meta-bar") || entryArticle?.querySelector(".meta") || null;

  const ensureEntryToc = () => {
    if (!entryContent) return null;

    let toc = document.querySelector(".entry-toc");
    if (toc) return toc;

    const headings = Array.from(entryContent.querySelectorAll("h2, h3, h4"));
    if (headings.length === 0) return null;

    const wrapper = document.createElement("section");
    wrapper.className = "card sidebar-card entry-sidebar-card entry-generated-toc";
    wrapper.setAttribute("aria-label", "Tabla de contenidos del artículo");
    wrapper.style.margin = "1.5rem 0";

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Navegación";

    const title = document.createElement("h3");
    title.textContent = "En este artículo";

    toc = document.createElement("nav");
    toc.className = "entry-toc";
    toc.setAttribute("aria-label", "Tabla de contenidos");

    wrapper.append(eyebrow, title, toc);

    if (entryContent.parentElement === entryArticle && entryArticle) {
      entryContent.before(wrapper);
    } else {
      entryContent.parentElement?.insertBefore(wrapper, entryContent);
    }

    return toc;
  };

  const buildEntryToc = () => {
    if (!entryContent) return { toc: null, sections: [] };

    const toc = ensureEntryToc();
    if (!toc) return { toc: null, sections: [] };

    const headings = Array.from(entryContent.querySelectorAll("h2, h3, h4"));
    if (headings.length === 0) {
      toc.replaceChildren();
      return { toc, sections: [] };
    }

    if (!entryContent.id) entryContent.id = "article-content";

    const usedIds = new Set(Array.from(document.querySelectorAll("[id]")).map((node) => node.id));
    headings.forEach((heading) => {
      if (heading.id) return;

      const baseId = slugify(heading.textContent || heading.tagName.toLowerCase());
      let candidate = baseId;
      let counter = 2;

      while (usedIds.has(candidate)) {
        candidate = `${baseId}-${counter}`;
        counter += 1;
      }

      heading.id = candidate;
      usedIds.add(candidate);
    });

    const fragment = document.createDocumentFragment();
    const introLink = document.createElement("a");
    introLink.href = `#${entryContent.id}`;
    introLink.textContent = "Introducción";
    fragment.append(introLink);

    headings.forEach((heading) => {
      const link = document.createElement("a");
      const level = Number(heading.tagName.slice(1));
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent?.trim() || "Sección";
      if (level > 2) link.style.paddingInlineStart = `${0.95 + (level - 2) * 0.85}rem`;
      fragment.append(link);
    });

    toc.replaceChildren(fragment);
    return { toc, sections: [entryContent, ...headings] };
  };

  const { toc: entryToc, sections: tocSections } = buildEntryToc();

  if (entryContent) {
    const textNodes = entryContent.querySelectorAll("p, li, blockquote");
    const headings = entryContent.querySelectorAll("h2, h3, h4");
    const words = (entryContent.textContent || "").trim().split(/\s+/).filter(Boolean).length;
    const longRead = words >= 350 || textNodes.length >= 8 || headings.length >= 3;

    textNodes.forEach((node) => {
      node.style.textWrap = "pretty";
    });

    headings.forEach((heading) => {
      heading.style.scrollMarginTop = "calc(var(--header-height) + 1.5rem)";
      heading.style.textWrap = "balance";
    });

    if (longRead) {
      if (entryArticle) entryArticle.setAttribute("data-long-read", "true");

      entryContent.style.fontSize = "clamp(1.04rem, 0.98rem + 0.25vw, 1.12rem)";
      entryContent.style.lineHeight = "1.8";
      entryContent.style.maxWidth = "72ch";

      if (entryToc?.closest(".entry-generated-toc")) {
        entryToc.closest(".entry-generated-toc").style.position = "relative";
      }

      if (entryMetaBar && !entryMetaBar.querySelector('[data-reading-time="true"]')) {
        const readingMinutes = Math.max(1, Math.round(words / 220));
        const chip = document.createElement("div");
        chip.className = entryMetaBar.querySelector(".entry-meta-chip") ? "entry-meta-chip" : "meta-item";
        chip.dataset.readingTime = "true";

        if (chip.className === "entry-meta-chip") {
          chip.innerHTML = `<span class="entry-meta-label">Lectura</span><strong>${readingMinutes} min</strong>`;
        } else {
          chip.textContent = `Lectura: ${readingMinutes} min`;
        }

        entryMetaBar.append(chip);
      }

      const progressBar = document.createElement("div");
      progressBar.setAttribute("aria-hidden", "true");
      progressBar.style.position = "fixed";
      progressBar.style.top = "0";
      progressBar.style.left = "0";
      progressBar.style.width = "100%";
      progressBar.style.height = "3px";
      progressBar.style.transformOrigin = "0 50%";
      progressBar.style.transform = "scaleX(0)";
      progressBar.style.background = "linear-gradient(90deg, var(--primary-500), var(--primary-300))";
      progressBar.style.pointerEvents = "none";
      progressBar.style.zIndex = "1200";
      body.append(progressBar);

      const updateProgress = () => {
        const articleBox = (entryArticle || entryContent).getBoundingClientRect();
        const total = Math.max((entryArticle || entryContent).offsetHeight - window.innerHeight, 1);
        const scrolled = Math.min(Math.max(window.scrollY - ((entryArticle || entryContent).offsetTop || 0), 0), total);
        const progress = total <= 0 ? 1 : scrolled / total;
        const clamped = Math.max(0, Math.min(progress, 1));
        progressBar.style.transform = `scaleX(${articleBox.top > window.innerHeight ? 0 : clamped})`;
      };

      updateProgress();
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
    }
  }

  if (entryToc && tocSections.length > 0 && "IntersectionObserver" in window) {
    const tocLinks = Array.from(entryToc.querySelectorAll("a"));
    const linkById = new Map(tocLinks.map((link) => [link.hash.slice(1), link]));
    const visibleTargets = new Map();

    const setActiveTocLink = (activeId) => {
      tocLinks.forEach((link) => {
        const active = link.hash.slice(1) === activeId;
        if (active) {
          link.setAttribute("aria-current", "location");
          link.style.borderColor = "var(--primary-300)";
          link.style.background = "color-mix(in oklab, var(--primary-100) 84%, transparent)";
          return;
        }

        link.removeAttribute("aria-current");
        link.style.borderColor = "";
        link.style.background = "";
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleTargets.set(entry.target.id, Math.abs(entry.boundingClientRect.top));
          } else {
            visibleTargets.delete(entry.target.id);
          }
        });

        let activeId = tocSections[0].id;
        let bestDistance = Number.POSITIVE_INFINITY;

        visibleTargets.forEach((distance, id) => {
          if (distance < bestDistance) {
            bestDistance = distance;
            activeId = id;
          }
        });

        if (linkById.has(activeId)) setActiveTocLink(activeId);
      },
      {
        rootMargin: "-18% 0px -60% 0px",
        threshold: [0.15, 0.45, 0.75],
      }
    );

    tocSections.forEach((section) => observer.observe(section));
    setActiveTocLink(window.location.hash ? window.location.hash.slice(1) : tocSections[0].id);
  }

  const animatedCards = Array.from(document.querySelectorAll(".card, .section-title"));
  if (animatedCards.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    animatedCards.forEach((element, index) => {
      if (!element.classList.contains("card")) {
        observer.observe(element);
        return;
      }

      element.style.opacity = "0";
      element.style.transform = "translateY(18px)";
      element.style.transition = reduceMotion.matches
        ? "opacity 0.01s linear, transform 0.01s linear"
        : `opacity 0.45s ease ${index * 0.08}s, transform 0.45s ease ${index * 0.08}s`;
      observer.observe(element);
    });
  }
});
