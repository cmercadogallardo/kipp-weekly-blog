/**
 * KIPP Weekly Blog - Main JavaScript
 * Funcionalidades básicas del blog
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

  // Animación suave de entrada para cards
  const cards = document.querySelectorAll(".card");
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

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // Console greeting - porque KIPP tiene personalidad
  console.log("%c🔍 KIPP Weekly Blog", "font-size: 20px; font-weight: bold; color: #2563eb;");
  console.log("%cConocimiento Semanal, Análisis Profundo", "font-size: 12px; color: #64748b;");
  console.log("%cDiseñado con 🔍 y café ☕", "font-size: 12px; color: #64748b;");
});
