// ==================== VR/XR DEVELOPER PORTFOLIO - INTERACTIVE EFFECTS ====================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all effects
  initParticles();
  initScrollAnimations();
  init3DCardEffects();
  initCursorEffects();
  initVideoHandlers();
  initNavbarEffects();
});

// ==================== FLOATING PARTICLES BACKGROUND ====================
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticleArray();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;

      // Random color selection for VR theme
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#22d3ee'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function initParticleArray() {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = (1 - distance / 120) * 0.2;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        entry.target.style.opacity = '1';
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.querySelectorAll('.card, .section-container > *, .about-section').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Parallax scrolling effect
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('#home::before, #home::after');

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (scrolled > 50) {
      navbar.style.background = 'rgba(10, 10, 15, 0.95)';
      navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.3)';
    } else {
      navbar.style.background = 'rgba(10, 10, 15, 0.8)';
      navbar.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.1)';
    }
  });
}

// ==================== 3D CARD EFFECTS ====================
function init3DCardEffects() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `
        translateY(-10px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ==================== CUSTOM CURSOR EFFECTS ====================
function initCursorEffects() {
  // Create cursor glow element
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'cursor-glow';
  cursorGlow.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    transition: transform 0.15s ease;
    display: none;
  `;
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.display = 'block';
    cursorGlow.style.left = `${e.clientX - 10}px`;
    cursorGlow.style.top = `${e.clientY - 10}px`;
  });

  // Enhance hover effects
  document.querySelectorAll('a, button, .skill-badge, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorGlow.style.transform = 'scale(2.5)';
      cursorGlow.style.background = 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%)';
    });

    el.addEventListener('mouseleave', () => {
      cursorGlow.style.transform = 'scale(1)';
      cursorGlow.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%)';
    });
  });
}

// ==================== VIDEO HANDLERS ====================
function initVideoHandlers() {
  document.querySelectorAll('.video-box').forEach(box => {
    const video = box.querySelector('video');
    const playBtnContainer = box.querySelector('.play-button-container');

    if (video && playBtnContainer) {
      const label = playBtnContainer.querySelector('label');
      video.controls = false;

      label.addEventListener('click', () => {
        video.play();
        video.controls = true;
        playBtnContainer.style.display = 'none';
      });

      video.addEventListener('ended', () => {
        playBtnContainer.style.display = 'grid';
        video.controls = false;
      });
    }
  });
}

// ==================== NAVBAR ACTIVE LINK ====================
function initNavbarEffects() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ==================== VIDEO SLIDER FUNCTION ====================
function scrollVideos(direction, button) {
  const slider = button
    .closest('.position-relative')
    ?.querySelector('[id$="-slider"]');

  if (!slider) return;

  const card = slider.querySelector('.card');
  if (!card) return;

  const cardStyle = window.getComputedStyle(card);
  const marginRight = parseInt(cardStyle.marginRight) || 16;
  const cardWidth = card.offsetWidth + marginRight;

  slider.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}

// ==================== SKILL BADGE RIPPLE EFFECT ====================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-badge').forEach(badge => {
    badge.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation to CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    .skill-badge {
      position: relative;
      overflow: hidden;
    }

    .nav-link.active {
      background: rgba(99, 102, 241, 0.2) !important;
      color: white !important;
    }

    .nav-link.active::before {
      transform: translateX(-50%) scaleX(1) !important;
    }
  `;
  document.head.appendChild(style);
});

// ==================== SMOOTH SCROLL ENHANCEMENT ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== PROFILE IMAGE GLOW EFFECT ====================
// Disabled to maintain consistent cyan/purple border theme
// document.addEventListener('DOMContentLoaded', () => {
//   const profileImg = document.querySelector('.profile-img');
//   if (profileImg) {
//     let hue = 0;
//     setInterval(() => {
//       hue = (hue + 1) % 360;
//       profileImg.style.filter = `hue-rotate(${hue}deg) brightness(1.05)`;
//     }, 50);
//   }
// });

// ==================== TYPING EFFECT FOR ROLE ====================
document.addEventListener('DOMContentLoaded', () => {
  const roleElement = document.querySelector('#home .col-md-7 > p');

  if (roleElement) {
    const originalText = roleElement.textContent;
    roleElement.textContent = '';
    let i = 0;

    function typeWriter() {
      if (i < originalText.length) {
        roleElement.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }

    // Start typing after page loads
    setTimeout(typeWriter, 500);
  }
});

// ==================== GLOWING BUTTON EFFECT ====================
document.querySelectorAll('.btn-primary, .btn-outline-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    btn.style.setProperty('--mouse-x', `${x}px`);
    btn.style.setProperty('--mouse-y', `${y}px`);
  });
});
