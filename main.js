/**
 * KIPP Weekly Blog - Main JavaScript
 * Funcionalidades mejoradas para el nuevo diseño profesional
 */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "kipp-theme";
  const root = document.documentElement;

  const yearNode = document.getElementById("current-year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  const getThemeMeta = () => document.querySelector('meta[name="theme-color"]');
  const setThemeColor = (theme) => {
    const meta = getThemeMeta();
    if (!meta) return;
    meta.setAttribute("content", theme === "dark" ? "#0b1020" : "#2563eb");
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    setThemeColor(theme);
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.querySelector(".theme-toggle-label")?.replaceChildren(
        document.createTextNode(theme === "dark" ? "Modo claro" : "Modo oscuro")
      );
    });
  };

  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  applyTheme(savedTheme || (preferredDark ? "dark" : "light"));

  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  });

  const navLinks = document.querySelectorAll(".main-nav a");
  const currentPath = window.location.pathname.replace(/\/$/, "");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    const linkUrl = new URL(href, window.location.origin + window.location.pathname);
    const normalized = linkUrl.pathname.replace(/\/$/, "");
    if (normalized === currentPath || (currentPath.endsWith("/index.html") && normalized === currentPath.replace("/index.html", ""))) {
      link.classList.add("active");
    }
  });

  const header = document.querySelector(".site-header");
  if (header) {
    const handleScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const setMenuOpen = (open) => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mainNav.classList.toggle("mobile-open", open);
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isExpanded);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (!mainNav.classList.contains("mobile-open")) return;
      if (mainNav.contains(event.target) || menuToggle.contains(event.target)) return;
      setMenuOpen(false);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "#!") return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const animatedElements = document.querySelectorAll(".card, .section-title");
  if ("IntersectionObserver" in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    animatedElements.forEach((element, index) => {
      if (element.classList.contains("card")) {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
      }
      observer.observe(element);
    });
  }
});
