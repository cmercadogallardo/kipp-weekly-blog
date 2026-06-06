/**
 * KIPP Weekly Blog - Main JavaScript
 * Funcionalidades mejoradas para el nuevo diseño profesional
 */

document.addEventListener("DOMContentLoaded", () => {
  // Actualizar año en el footer
  const yearNode = document.getElementById("current-year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  // Marcar navegación activa
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".main-nav a");
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && (href === currentPage || href.includes(currentPage))) {
      link.classList.add("active");
    }
  });

  // Header scroll effect - añadir sombra al hacer scroll
  const header = document.querySelector(".site-header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    
    // Check initial scroll position
    handleScroll();
    
    // Listen for scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      mainNav.classList.toggle("mobile-open");
      
      // Toggle icon
      const icon = menuToggle.querySelector("svg");
      if (icon) {
        if (!isExpanded) {
          icon.innerHTML = `
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          `;
        } else {
          icon.innerHTML = `
            <line x1="6" y1="6" x2="18" y2="18"></line>
            <line x1="6" y1="18" x2="18" y2="6"></line>
          `;
        }
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId !== "#" && targetId !== "#!") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

  // Intersection Observer para animaciones de entrada
  const animatedElements = document.querySelectorAll(".card, .section-title");
  
  if (animatedElements.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((element, index) => {
      if (element.classList.contains("card")) {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
      }
      observer.observe(element);
    });
  }

  // Añadir efecto hover mejorado a los botones CTA
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-2px)";
    });
    
    btn.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0)";
    });
  });

  // Console greeting - porque KIPP tiene personalidad
  console.log("%c🔍 KIPP Weekly Blog", "font-size: 20px; font-weight: bold; color: #2563eb;");
  console.log("%cConocimiento Semanal, Análisis Profundo", "font-size: 12px; color: #64748b;");
  console.log("%cDiseñado con 🔍 y café ☕", "font-size: 12px; color: #64748b;");
  console.log("%c✨ Nuevo diseño profesional activado", "font-size: 12px; color: #10b981;");
});
