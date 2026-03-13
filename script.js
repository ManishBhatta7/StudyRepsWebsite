/* ═══════════════════════════════════════════════════════
   StudyReps Landing Page — JavaScript
   Scroll animations, navbar, FAQ, mobile menu
   ═══════════════════════════════════════════════════════ */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ── Mobile Menu ──
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
});

function closeMobileMenu() {
  mobileNav.classList.remove('open');
  mobileMenuBtn.textContent = '☰';
}

// ── FAQ Accordion ──
function toggleFaq(button) {
  const item = button.parentElement;
  const isActive = item.classList.contains('active');
  
  // Close all
  document.querySelectorAll('.faq-item').forEach(el => {
    el.classList.remove('active');
  });
  
  // Open clicked (if not already open)
  if (!isActive) {
    item.classList.add('active');
  }
}

// ── Scroll-triggered fade-in animations ──
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ── Counter animation for social proof ──
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start >= target) {
      element.textContent = target.toLocaleString() + '+';
      return;
    }
    element.textContent = Math.floor(start).toLocaleString() + '+';
    requestAnimationFrame(updateCounter);
  }
  
  updateCounter();
}

// Trigger counter when social proof is visible
const socialProof = document.querySelector('.hero-social-proof strong');
if (socialProof) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, 2400);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counterObserver.observe(socialProof);
}

// ── Parallax effect on hero mockup ──
const heroMockup = document.querySelector('.hero-mockup');
if (heroMockup) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < 800) {
      heroMockup.style.transform = `translateY(${-16 + scrolled * 0.03}px)`;
    }
  });
}

// ── Preload complete ──
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure fonts are loaded before showing animations
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// ── PWA Support ──
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const installBtnMobile = document.getElementById('installBtnMobile');

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

// Handle Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'inline-flex';
  if (installBtnMobile) installBtnMobile.style.display = 'block';
});

const handleInstall = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User responded to the install prompt: ${outcome}`);
    deferredPrompt = null;
    if (installBtn) installBtn.style.display = 'none';
    if (installBtnMobile) installBtnMobile.style.display = 'none';
  }
};

if (installBtn) installBtn.addEventListener('click', handleInstall);
if (installBtnMobile) installBtnMobile.addEventListener('click', handleInstall);

// Hide install button when app is installed
window.addEventListener('appinstalled', (evt) => {
  console.log('StudyReps was installed.');
  if (installBtn) installBtn.style.display = 'none';
  if (installBtnMobile) installBtnMobile.style.display = 'none';
});
